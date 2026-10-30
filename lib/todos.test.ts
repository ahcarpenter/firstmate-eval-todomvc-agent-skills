import { describe, expect, it } from "vitest";
import { filterTodos, nextId, pluralize, removeTodo, restoreTodo, type Todo } from "./todos";

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

describe("removeTodo", () => {
  it("removes the todo and remembers where it was", () => {
    expect(removeTodo(todos, 2)).toEqual({ todos: [todos[0]], deleted: { todo: todos[1], index: 1 } });
  });

  it("leaves the list alone for an unknown id", () => {
    expect(removeTodo(todos, 99)).toEqual({ todos, deleted: null });
  });
});

describe("restoreTodo", () => {
  it("puts the todo back where it was", () => {
    const { todos: remaining, deleted } = removeTodo(todos, 1);
    expect(restoreTodo(remaining, deleted!)).toEqual(todos);
  });

  it("appends when the list has since shrunk", () => {
    expect(restoreTodo([], { todo: todos[1], index: 1 })).toEqual([todos[1]]);
  });
});
