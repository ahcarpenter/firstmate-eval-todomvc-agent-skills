import { describe, expect, it } from "vitest";
import { filterTodos, formatDue, isOverdue, nextId, pluralize, sortByDue, todayISO, withDue, type Todo } from "./todos";

const todos: Todo[] = [
  { id: 1, title: "Buy milk", completed: false },
  { id: 2, title: "Walk the dog", completed: true },
];

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
    expect(filterTodos(todos, "all")).toHaveLength(2);
  });

  it("returns only active todos", () => {
    expect(filterTodos(todos, "active").map((todo) => todo.id)).toEqual([1]);
  });

  it("returns only completed todos", () => {
    expect(filterTodos(todos, "completed").map((todo) => todo.id)).toEqual([2]);
  });

  it("returns only overdue todos", () => {
    const dated: Todo[] = [
      ...todos,
      { id: 3, title: "Pay rent", completed: false, due: "2026-11-01" },
      { id: 4, title: "File taxes", completed: false, due: "2026-11-10" },
    ];
    expect(filterTodos(dated, "overdue", "2026-11-05").map((todo) => todo.id)).toEqual([3]);
  });
});

describe("isOverdue", () => {
  const today = "2026-11-05";

  it("is true for an active todo due before today", () => {
    expect(isOverdue({ id: 1, title: "Pay rent", completed: false, due: "2026-11-04" }, today)).toBe(true);
  });

  it("is false for a todo due today or later", () => {
    expect(isOverdue({ id: 1, title: "Pay rent", completed: false, due: "2026-11-05" }, today)).toBe(false);
    expect(isOverdue({ id: 1, title: "Pay rent", completed: false, due: "2026-11-06" }, today)).toBe(false);
  });

  it("is false for a completed todo", () => {
    expect(isOverdue({ id: 1, title: "Pay rent", completed: true, due: "2026-11-04" }, today)).toBe(false);
  });

  it("is false for a todo without a due date", () => {
    expect(isOverdue({ id: 1, title: "Pay rent", completed: false }, today)).toBe(false);
  });
});

describe("todayISO", () => {
  it("uses the local calendar date", () => {
    expect(todayISO(new Date(2026, 0, 5, 23, 30))).toBe("2026-01-05");
  });
});

describe("formatDue", () => {
  it("shows the short month and day", () => {
    expect(formatDue("2026-11-03")).toBe("Due Nov 3");
  });

  it("keeps the stored calendar day", () => {
    expect(formatDue("2027-01-31")).toBe("Due Jan 31");
  });
});

describe("withDue", () => {
  it("sets the due date", () => {
    expect(withDue(todos[0], "2026-11-03")).toEqual({ id: 1, title: "Buy milk", completed: false, due: "2026-11-03" });
  });

  it("removes the due date when empty", () => {
    expect(withDue({ ...todos[0], due: "2026-11-03" }, "")).toEqual(todos[0]);
  });
});

describe("sortByDue", () => {
  const list: Todo[] = [
    { id: 1, title: "Buy milk", completed: false },
    { id: 2, title: "File taxes", completed: false, due: "2026-11-10" },
    { id: 3, title: "Walk the dog", completed: true },
    { id: 4, title: "Pay rent", completed: false, due: "2026-11-01" },
    { id: 5, title: "Call mom", completed: false, due: "2026-11-10" },
  ];

  it("puts the earliest due date first and undated todos last, keeping ties in order", () => {
    expect(sortByDue(list).map((todo) => todo.id)).toEqual([4, 2, 5, 1, 3]);
  });

  it("leaves the original list untouched", () => {
    sortByDue(list);
    expect(list.map((todo) => todo.id)).toEqual([1, 2, 3, 4, 5]);
  });
});
