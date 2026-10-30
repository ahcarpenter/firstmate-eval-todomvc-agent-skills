import { describe, expect, it } from "vitest";
import {
  filterTodos,
  nextId,
  pluralize,
  removeCompleted,
  removeTodo,
  restoreTodo,
  restoreTodos,
  type Todo,
} from "./todos";

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

  it("never reuses an id after a deletion", () => {
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
    const { todos: rest, deleted } = removeTodo(todos, 2);
    expect(rest.map((todo) => todo.id)).toEqual([1]);
    expect(deleted).toEqual({ todo: todos[1], index: 1 });
  });

  it("leaves the list alone for an unknown id", () => {
    expect(removeTodo(todos, 9)).toEqual({ todos, deleted: null });
  });
});

describe("restoreTodo", () => {
  it("puts the todo back where it was", () => {
    const { todos: rest, deleted } = removeTodo(todos, 1);
    expect(restoreTodo(rest, deleted!)).toEqual(todos);
  });

  it("appends the todo when the list has shrunk past its old position", () => {
    const restored = restoreTodo([], { todo: todos[1], index: 1 });
    expect(restored).toEqual([todos[1]]);
  });

  it("gives the todo a fresh id when its old one has been reused", () => {
    const { todos: rest, deleted } = removeTodo(todos, 2);
    const added = [...rest, { id: nextId(rest), title: "Read a book", completed: false }];
    const restored = restoreTodo(added, deleted!);
    expect(restored.map((todo) => todo.title)).toEqual(["Buy milk", "Walk the dog", "Read a book"]);
    expect(new Set(restored.map((todo) => todo.id)).size).toBe(3);
  });
});

describe("removeCompleted", () => {
  const mixed: Todo[] = [
    { id: 1, title: "Buy milk", completed: true },
    { id: 2, title: "Walk the dog", completed: false },
    { id: 3, title: "Read a book", completed: true },
    { id: 4, title: "Call mum", completed: false },
  ];

  it("removes every completed todo and remembers where each was", () => {
    const { todos: rest, deleted } = removeCompleted(mixed);
    expect(rest.map((todo) => todo.id)).toEqual([2, 4]);
    expect(deleted).toEqual([
      { todo: mixed[0], index: 0 },
      { todo: mixed[2], index: 2 },
    ]);
  });

  it("puts every cleared todo back in place, still completed", () => {
    const { todos: rest, deleted } = removeCompleted(mixed);
    expect(restoreTodos(rest, deleted)).toEqual(mixed);
  });

  it("gives cleared todos fresh ids when their old ones have been reused", () => {
    const { todos: rest, deleted } = removeCompleted(mixed.slice(2));
    const added = [...rest, { id: nextId(rest), title: "Pay rent", completed: false }];
    const restored = restoreTodos(added, deleted);
    expect(restored.map((todo) => todo.title)).toEqual(["Read a book", "Call mum", "Pay rent"]);
    expect(restored[0].completed).toBe(true);
    expect(new Set(restored.map((todo) => todo.id)).size).toBe(3);
  });
});
