import { describe, expect, it } from "vitest";
import { editTodo, filterTodos, formatDueDate, isOverdue, localDateString, nextId, pluralize, sortByDueDate, type Todo } from "./todos";

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
    expect(formatDueDate("2026-11-03", today)).toBe("Due Nov 3");
    expect(formatDueDate("2026-10-29", today)).toBe("Due Oct 29");
  });

  it("keeps the calendar day regardless of time zone", () => {
    expect(formatDueDate("2026-01-01", today)).toBe("Due Jan 1");
    expect(formatDueDate("2026-12-31", today)).toBe("Due Dec 31");
  });

  it("says today or tomorrow for a todo due soon", () => {
    expect(formatDueDate("2026-10-30", today)).toBe("Due today");
    expect(formatDueDate("2026-10-31", today)).toBe("Due tomorrow");
  });

  it("finds tomorrow across month and year ends", () => {
    expect(formatDueDate("2026-11-01", "2026-10-31")).toBe("Due tomorrow");
    expect(formatDueDate("2027-01-01", "2026-12-31")).toBe("Due tomorrow");
    expect(formatDueDate("2028-02-29", "2028-02-28")).toBe("Due tomorrow");
    expect(formatDueDate("2028-03-01", "2028-02-28")).toBe("Due Mar 1");
  });

  it("returns null without a valid date", () => {
    expect(formatDueDate(undefined, today)).toBeNull();
    expect(formatDueDate("", today)).toBeNull();
    expect(formatDueDate("not a date", today)).toBeNull();
    expect(formatDueDate("2026-13-01", today)).toBeNull();
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

describe("editTodo", () => {
  const todo: Todo = { id: 3, title: "Pay rent", completed: false, dueDate: "2026-10-29" };

  it("changes the title and the due date", () => {
    expect(editTodo(todo, "Pay the rent", "2026-11-05")).toEqual({ ...todo, title: "Pay the rent", dueDate: "2026-11-05" });
  });

  it("adds a due date to an undated todo", () => {
    expect(editTodo(todos[0], "Buy milk", "2026-11-01")).toEqual({ ...todos[0], dueDate: "2026-11-01" });
  });

  it("removes the due date when it is cleared", () => {
    const edited = editTodo(todo, "Pay rent", "");
    expect(edited).toEqual({ id: 3, title: "Pay rent", completed: false });
    expect("dueDate" in edited).toBe(false);
  });
});

describe("sortByDueDate", () => {
  it("puts the earliest due date first and undated todos last", () => {
    expect(sortByDueDate(dated).map((todo) => todo.id)).toEqual([4, 3, 5, 1, 2]);
  });

  it("keeps the usual order for ties", () => {
    const tied: Todo[] = [
      { id: 1, title: "a", completed: false, dueDate: "2026-11-02" },
      { id: 2, title: "b", completed: false },
      { id: 3, title: "c", completed: false, dueDate: "2026-11-01" },
      { id: 4, title: "d", completed: false, dueDate: "2026-11-02" },
      { id: 5, title: "e", completed: false },
    ];
    expect(sortByDueDate(tied).map((todo) => todo.id)).toEqual([3, 1, 4, 2, 5]);
  });

  it("treats an invalid due date as undated", () => {
    const invalid: Todo[] = [
      { id: 1, title: "a", completed: false, dueDate: "not a date" },
      { id: 2, title: "b", completed: false, dueDate: "" },
      { id: 3, title: "c", completed: false, dueDate: "2026-11-01" },
    ];
    expect(sortByDueDate(invalid).map((todo) => todo.id)).toEqual([3, 1, 2]);
  });

  it("does not change the given list", () => {
    const copy = [...dated];
    sortByDueDate(dated);
    expect(dated).toEqual(copy);
  });
});
