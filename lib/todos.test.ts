import { afterEach, describe, expect, it, vi } from "vitest";
import { filterTodos, loadTodos, nextId, pluralize, type Todo } from "./todos";

const todos: Todo[] = [
  { id: 1, title: "Buy milk", completed: false, important: false },
  { id: 2, title: "Walk the dog", completed: true, important: false },
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

describe("loadTodos", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function stubStorage(value: string | null) {
    vi.stubGlobal("window", { localStorage: { getItem: () => value } });
  }

  it("keeps important marks", () => {
    stubStorage(JSON.stringify([{ id: 1, title: "Buy milk", completed: false, important: true }]));
    expect(loadTodos()[0].important).toBe(true);
  });

  it("treats todos saved without an important mark as not important", () => {
    stubStorage(JSON.stringify([{ id: 1, title: "Buy milk", completed: false }]));
    expect(loadTodos()[0].important).toBe(false);
  });
});
