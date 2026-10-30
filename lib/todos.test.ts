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

describe("removeCompleted", () => {
  it("removes every completed todo and remembers where each was", () => {
    const list: Todo[] = [
      { id: 1, title: "a", completed: true },
      { id: 2, title: "b", completed: false },
      { id: 3, title: "c", completed: true },
    ];
    expect(removeCompleted(list)).toEqual({
      todos: [list[1]],
      deleted: [
        { todo: list[0], index: 0 },
        { todo: list[2], index: 2 },
      ],
    });
  });
});

describe("restoreTodos", () => {
  const list: Todo[] = [
    { id: 1, title: "a", completed: true },
    { id: 2, title: "b", completed: false },
    { id: 3, title: "c", completed: true },
    { id: 4, title: "d", completed: false },
    { id: 5, title: "e", completed: true },
  ];

  it("puts every cleared todo back where it was, still completed", () => {
    const { todos: remaining, deleted } = removeCompleted(list);
    expect(restoreTodos(remaining, deleted)).toEqual(list);
  });

  it("does not depend on the order the deletions are given in", () => {
    const { todos: remaining, deleted } = removeCompleted(list);
    expect(restoreTodos(remaining, [...deleted].reverse())).toEqual(list);
  });

  it("leaves the list alone when nothing was deleted", () => {
    expect(restoreTodos(list, [])).toEqual(list);
  });
});
