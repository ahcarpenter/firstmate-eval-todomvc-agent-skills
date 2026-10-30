import { describe, expect, it } from "vitest";
import { filterTodos, formatDueDate, isOverdue, localDateString, nextId, pluralize, tomorrowDateString, type Todo } from "./todos";

const todos: Todo[] = [
  { id: 1, title: "Buy milk", completed: false },
  { id: 2, title: "Walk the dog", completed: true },
];

const dated: Todo[] = [
  ...todos,
  { id: 3, title: "Pay rent", completed: false, dueDate: "2026-10-29" },
  { id: 4, title: "File taxes", completed: true, dueDate: "2026-10-01" },
  { id: 5, title: "Call mom", completed: false, dueDate: "2026-10-30" },
];

const today = "2026-10-30";

describe("nextId", () => {
  it("starts at 1", () => {
    expect(nextId([])).toBe(1);
  });

  it("follows the existing todos", () => {
    expect(nextId(todos)).toBe(3);
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
    expect(filterTodos(todos, "all", today)).toHaveLength(2);
  });

  it("returns only active todos", () => {
    expect(filterTodos(todos, "active", today).map((todo) => todo.id)).toEqual([1]);
  });

  it("returns only completed todos", () => {
    expect(filterTodos(todos, "completed", today).map((todo) => todo.id)).toEqual([2]);
  });

  it("returns only overdue todos", () => {
    expect(filterTodos(dated, "overdue", today).map((todo) => todo.id)).toEqual([3]);
  });
});

describe("formatDueDate", () => {
  it("shows the month and day", () => {
    expect(formatDueDate("2026-11-03")).toBe("Due Nov 3");
  });

  it("keeps the calendar day regardless of time zone", () => {
    expect(formatDueDate("2026-01-01")).toBe("Due Jan 1");
    expect(formatDueDate("2026-12-31")).toBe("Due Dec 31");
  });

  it("returns null without a valid date", () => {
    expect(formatDueDate(undefined)).toBeNull();
    expect(formatDueDate("")).toBeNull();
    expect(formatDueDate("not a date")).toBeNull();
    expect(formatDueDate("2026-13-01")).toBeNull();
  });
});

describe("isOverdue", () => {
  it("is overdue when active and due before today", () => {
    expect(isOverdue({ id: 1, title: "a", completed: false, dueDate: "2026-10-29" }, today)).toBe(true);
    expect(isOverdue({ id: 1, title: "a", completed: false, dueDate: "2025-12-31" }, today)).toBe(true);
  });

  it("is not overdue when due today or later", () => {
    expect(isOverdue({ id: 1, title: "a", completed: false, dueDate: "2026-10-30" }, today)).toBe(false);
    expect(isOverdue({ id: 1, title: "a", completed: false, dueDate: "2026-11-01" }, today)).toBe(false);
  });

  it("is not overdue once completed", () => {
    expect(isOverdue({ id: 1, title: "a", completed: true, dueDate: "2026-10-29" }, today)).toBe(false);
  });

  it("is not overdue without a valid due date", () => {
    expect(isOverdue({ id: 1, title: "a", completed: false }, today)).toBe(false);
    expect(isOverdue({ id: 1, title: "a", completed: false, dueDate: "" }, today)).toBe(false);
    expect(isOverdue({ id: 1, title: "a", completed: false, dueDate: "not a date" }, today)).toBe(false);
    expect(isOverdue({ id: 1, title: "a", completed: false, dueDate: "2026-13-01" }, today)).toBe(false);
  });
});

describe("localDateString", () => {
  it("uses the local calendar day", () => {
    expect(localDateString(new Date(2026, 9, 30, 23, 59))).toBe("2026-10-30");
    expect(localDateString(new Date(2026, 0, 5, 0, 0))).toBe("2026-01-05");
  });
});

describe("tomorrowDateString", () => {
  it("uses the next local calendar day", () => {
    expect(tomorrowDateString(new Date(2026, 9, 30, 23, 59))).toBe("2026-10-31");
    expect(tomorrowDateString(new Date(2026, 9, 31, 0, 0))).toBe("2026-11-01");
    expect(tomorrowDateString(new Date(2026, 11, 31, 12, 0))).toBe("2027-01-01");
  });
});
