import { describe, expect, it } from "vitest";
import {
  editTodo,
  filterTodos,
  formatDue,
  isOverdue,
  localToday,
  moveOverdueToToday,
  nextId,
  pluralize,
  searchTodos,
  sortByDue,
  type Todo,
} from "./todos";

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

describe("searchTodos", () => {
  it("keeps todos whose title contains the text, ignoring letter case", () => {
    expect(searchTodos(todos, "PA").map((todo) => todo.id)).toEqual([3]);
    expect(searchTodos(todos, "b").map((todo) => todo.id)).toEqual([1, 5]);
  });

  it("returns everything for an empty or blank search", () => {
    expect(searchTodos(todos, "")).toBe(todos);
    expect(searchTodos(todos, "   ")).toBe(todos);
  });

  it("ignores surrounding spaces but matches inner ones", () => {
    expect(searchTodos(todos, " the dog ").map((todo) => todo.id)).toEqual([2]);
    expect(searchTodos(todos, "milk dog")).toEqual([]);
  });
});

describe("sortByDue", () => {
  it("puts the earliest due date first and undated todos last, keeping ties in order", () => {
    expect(sortByDue(todos).map((todo) => todo.id)).toEqual([3, 4, 5, 1, 2]);
  });

  it("orders dates across months and years", () => {
    const dated: Todo[] = [
      { id: 1, title: "a", completed: false, due: "2027-01-02" },
      { id: 2, title: "b", completed: false },
      { id: 3, title: "c", completed: false, due: "2026-12-31" },
      { id: 4, title: "d", completed: false, due: "2026-02-10" },
    ];
    expect(sortByDue(dated).map((todo) => todo.id)).toEqual([4, 3, 1, 2]);
  });

  it("leaves the input untouched", () => {
    const copy = [...todos];
    sortByDue(todos);
    expect(todos).toEqual(copy);
  });
});

describe("editTodo", () => {
  it("sets the title and a new due date", () => {
    expect(editTodo(todos[2], "Pay the rent", "2026-11-03")).toEqual({
      id: 3,
      title: "Pay the rent",
      completed: false,
      due: "2026-11-03",
    });
  });

  it("adds a due date to an undated todo", () => {
    expect(editTodo(todos[0], "Buy milk", "2026-11-03")).toEqual({ ...todos[0], due: "2026-11-03" });
  });

  it("removes the due date when it is empty", () => {
    const edited = editTodo(todos[2], "Pay rent", "");
    expect(edited).toEqual({ id: 3, title: "Pay rent", completed: false });
    expect("due" in edited).toBe(false);
  });
});

describe("formatDue", () => {
  it("shows the month and day", () => {
    expect(formatDue("2026-11-03", TODAY)).toBe("Due Nov 3");
    expect(formatDue("2027-01-31", TODAY)).toBe("Due Jan 31");
  });

  it("says today and tomorrow for those days", () => {
    expect(formatDue("2026-10-29", TODAY)).toBe("Due today");
    expect(formatDue("2026-10-30", TODAY)).toBe("Due tomorrow");
    expect(formatDue("2026-10-28", TODAY)).toBe("Due Oct 28");
    expect(formatDue("2026-10-31", TODAY)).toBe("Due Oct 31");
  });

  it("finds tomorrow across month and year ends", () => {
    expect(formatDue("2026-11-01", "2026-10-31")).toBe("Due tomorrow");
    expect(formatDue("2027-01-01", "2026-12-31")).toBe("Due tomorrow");
    expect(formatDue("2028-02-29", "2028-02-28")).toBe("Due tomorrow");
    expect(formatDue("2027-03-01", "2027-02-28")).toBe("Due tomorrow");
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

describe("moveOverdueToToday", () => {
  it("moves only overdue todos to today and keeps the rest as they were", () => {
    expect(moveOverdueToToday(todos, TODAY)).toEqual([
      todos[0],
      todos[1],
      { ...todos[2], due: TODAY },
      todos[3],
      todos[4],
    ]);
  });

  it("leaves the input untouched", () => {
    const copy = structuredClone(todos);
    moveOverdueToToday(todos, TODAY);
    expect(todos).toEqual(copy);
  });
});

describe("localToday", () => {
  it("formats the local calendar date with padding", () => {
    expect(localToday(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
    expect(localToday(new Date(2026, 10, 30, 0, 0))).toBe("2026-11-30");
  });
});
