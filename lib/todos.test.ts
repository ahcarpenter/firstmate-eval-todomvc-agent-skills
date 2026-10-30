import { describe, expect, it } from "vitest";
import { addList, filterTodos, listPath, nextId, parseLists, pluralize, type Todo, type TodoList } from "./todos";

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

describe("listPath", () => {
  it("links the all filter to the list itself", () => {
    expect(listPath("2")).toBe("/lists/2");
    expect(listPath("2", "all")).toBe("/lists/2");
  });

  it("appends the other filters", () => {
    expect(listPath("2", "active")).toBe("/lists/2/active");
    expect(listPath("2", "completed")).toBe("/lists/2/completed");
  });
});

describe("addList", () => {
  it("appends an empty list after the highest id", () => {
    const lists: TodoList[] = [
      { id: "1", name: "Todos", todos },
      { id: "3", name: "Work", todos: [] },
    ];
    expect(addList(lists, "Home")).toEqual([...lists, { id: "4", name: "Home", todos: [] }]);
  });
});

describe("parseLists", () => {
  it("returns the stored lists", () => {
    const lists: TodoList[] = [{ id: "1", name: "Work", todos }];
    expect(parseLists(JSON.stringify(lists), null)).toEqual(lists);
  });

  it("turns todos saved before lists existed into a list called Todos", () => {
    expect(parseLists(null, JSON.stringify(todos))).toEqual([{ id: "1", name: "Todos", todos }]);
  });

  it("prefers stored lists over the old todos", () => {
    const lists: TodoList[] = [{ id: "1", name: "Work", todos: [] }];
    expect(parseLists(JSON.stringify(lists), JSON.stringify(todos))).toEqual(lists);
  });

  it("starts with an empty Todos list when nothing is stored", () => {
    expect(parseLists(null, null)).toEqual([{ id: "1", name: "Todos", todos: [] }]);
  });

  it("never returns no lists", () => {
    expect(parseLists("[]", JSON.stringify(todos))).toEqual([{ id: "1", name: "Todos", todos }]);
  });

  it("ignores unreadable storage", () => {
    expect(parseLists("{", "not json")).toEqual([{ id: "1", name: "Todos", todos: [] }]);
  });
});
