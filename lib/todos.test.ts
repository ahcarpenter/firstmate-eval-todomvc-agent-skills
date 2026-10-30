import { describe, expect, it } from "vitest";
import { filterTodos, formatDue, isOverdue, localToday, localTomorrow, nextId, pluralize, type Todo } from "./todos";

const todos: Todo[] = [
  { id: 1, title: "Buy milk", completed: false },
  { id: 2, title: "Walk the dog", completed: true },
  { id: 3, title: "Pay rent", completed: false, due: "2026-10-28" },
  { id: 4, title: "File taxes", completed: true, due: "2026-10-28" },
  { id: 5, title: "Book flights", completed: false, due: "2026-10-29" },
];

const TODAY = "2026-10-29";

describe("nextId", () => {
  it("starts at 1", () => {
    expect(nextId([])).toBe(1);
  });

  it("follows the existing todos", () => {
    expect(nextId(todos)).toBe(6);
  });
});

describe("pluralize", () => {
  it("uses the singular for one", () => {
    expect(pluralize(1, "item")).toBe("item");
  });

  it("uses the plural otherwise", () => {
    expect(pluralize(0, "item")).toBe("items");
    expect(pluralize(2, "item")).toBe("items");
  });
});

describe("filterTodos", () => {
  it("returns everything for all", () => {
    expect(filterTodos(todos, "all", TODAY)).toHaveLength(5);
  });

  it("returns only active todos", () => {
    expect(filterTodos(todos, "active", TODAY).map((todo) => todo.id)).toEqual([1, 3, 5]);
  });

  it("returns only completed todos", () => {
    expect(filterTodos(todos, "completed", TODAY).map((todo) => todo.id)).toEqual([2, 4]);
  });

  it("returns only overdue todos", () => {
    expect(filterTodos(todos, "overdue", TODAY).map((todo) => todo.id)).toEqual([3]);
  });
});

describe("formatDue", () => {
  it("shows the month and day", () => {
    expect(formatDue("2026-11-03")).toBe("Due Nov 3");
    expect(formatDue("2027-01-31")).toBe("Due Jan 31");
  });
});

describe("isOverdue", () => {
  it("is true for an active todo due before today", () => {
    expect(isOverdue({ id: 1, title: "a", completed: false, due: "2026-10-28" }, TODAY)).toBe(true);
    expect(isOverdue({ id: 1, title: "a", completed: false, due: "2025-12-31" }, TODAY)).toBe(true);
  });

  it("is false for a todo due today or later", () => {
    expect(isOverdue({ id: 1, title: "a", completed: false, due: TODAY }, TODAY)).toBe(false);
    expect(isOverdue({ id: 1, title: "a", completed: false, due: "2026-11-03" }, TODAY)).toBe(false);
  });

  it("is false for a completed todo", () => {
    expect(isOverdue({ id: 1, title: "a", completed: true, due: "2026-10-28" }, TODAY)).toBe(false);
  });

  it("is false for a todo without a due date", () => {
    expect(isOverdue({ id: 1, title: "a", completed: false }, TODAY)).toBe(false);
  });
});

describe("localToday", () => {
  it("formats the local calendar date with padding", () => {
    expect(localToday(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
    expect(localToday(new Date(2026, 10, 30, 0, 0))).toBe("2026-11-30");
  });
});

describe("localTomorrow", () => {
  it("gives the next local calendar date, rolling over months and years", () => {
    expect(localTomorrow(new Date(2026, 9, 29, 23, 59))).toBe("2026-10-30");
    expect(localTomorrow(new Date(2026, 9, 31, 0, 0))).toBe("2026-11-01");
    expect(localTomorrow(new Date(2026, 11, 31, 12))).toBe("2027-01-01");
  });
});
