import { describe, expect, it } from "vitest";
import { duplicateTodo, filterTodos, nextId, pluralize, withUniqueIds, type Todo } from "./todos";

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

  it("does not reuse an id after a todo is deleted", () => {
    const afterDelete = todos.filter((todo) => todo.id !== 1);
    expect(nextId(afterDelete)).toBe(3);
  });
});

describe("withUniqueIds", () => {
  it("keeps unique ids unchanged", () => {
    expect(withUniqueIds(todos)).toEqual(todos);
  });

  it("gives later duplicates fresh ids", () => {
    const stored: Todo[] = [
      { id: 2, title: "two", completed: false },
      { id: 3, title: "three", completed: false },
      { id: 3, title: "four", completed: true },
    ];
    expect(withUniqueIds(stored).map((todo) => [todo.id, todo.title])).toEqual([
      [2, "two"],
      [3, "three"],
      [4, "four"],
    ]);
  });
});

describe("duplicateTodo", () => {
  it("inserts a not-completed copy right below the original with a fresh id", () => {
    expect(duplicateTodo(todos, 2)).toEqual([
      ...todos,
      { id: 3, title: "Walk the dog", completed: false },
    ]);
    expect(duplicateTodo(todos, 1).map((todo) => [todo.id, todo.title])).toEqual([
      [1, "Buy milk"],
      [3, "Buy milk"],
      [2, "Walk the dog"],
    ]);
  });

  it("leaves the list alone for an unknown id", () => {
    expect(duplicateTodo(todos, 99)).toBe(todos);
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
