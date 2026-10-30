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

  it("never reuses an id that is still in the list", () => {
    expect(nextId([{ id: 2, title: "Walk the dog", completed: true }])).toBe(3);
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

  it("leaves the list alone when the id is unknown", () => {
    expect(removeTodo(todos, 9)).toEqual({ todos, deleted: null });
  });
});

describe("restoreTodo", () => {
  it("puts the todo back at its old position", () => {
    const { todos: rest, deleted } = removeTodo(todos, 1);
    expect(restoreTodo(rest, deleted!)).toEqual(todos);
  });

  it("appends the todo when the list has shrunk past its position", () => {
    expect(restoreTodo([], { todo: todos[1], index: 1 })).toEqual([todos[1]]);
  });

  it("gives the todo a new id when its old one was taken", () => {
    const added = { id: 2, title: "Pay rent", completed: false };
    expect(restoreTodo([todos[0], added], { todo: todos[1], index: 1 })).toEqual([
      todos[0],
      { ...todos[1], id: 3 },
      added,
    ]);
  });
});
