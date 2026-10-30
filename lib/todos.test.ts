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

  it("does not reuse an id still in use after a delete", () => {
    const afterDelete: Todo[] = [
      { id: 1, title: "one", completed: false },
      { id: 3, title: "three", completed: false },
    ];
    expect(nextId(afterDelete)).toBe(4);
  });
});

describe("withUniqueIds", () => {
  it("keeps todos whose ids are already unique", () => {
    expect(withUniqueIds(todos)).toEqual(todos);
  });

  it("gives a repeated id a fresh one and keeps the first", () => {
    const stored: Todo[] = [
      { id: 1, title: "one", completed: false },
      { id: 3, title: "three", completed: false },
      { id: 3, title: "four", completed: true },
    ];
    expect(withUniqueIds(stored).map((todo) => [todo.id, todo.title])).toEqual([
      [1, "one"],
      [3, "three"],
      [4, "four"],
    ]);
  });
});

describe("duplicateTodo", () => {
  it("adds a not-completed copy with a fresh id right after the original", () => {
    const list: Todo[] = [...todos, { id: 3, title: "Call mum", completed: false }];
    expect(duplicateTodo(list, 2)).toEqual([
      { id: 1, title: "Buy milk", completed: false },
      { id: 2, title: "Walk the dog", completed: true },
      { id: 4, title: "Walk the dog", completed: false },
      { id: 3, title: "Call mum", completed: false },
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
