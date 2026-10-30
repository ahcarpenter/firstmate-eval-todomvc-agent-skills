import { describe, expect, it } from "vitest";
import { filterTodos, formatDueDate, nextId, pluralize, type Todo } from "./todos";

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
