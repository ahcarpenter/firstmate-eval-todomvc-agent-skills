import { describe, expect, it } from "vitest";
import {
  DEFAULT_LIST_NAME,
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  addList,
  filterTodos,
  listPath,
  loadLists,
  nextId,
  nextListId,
  pluralize,
  type Todo,
  type TodoList,
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

function storageWith(entries: Record<string, string>): Pick<Storage, "getItem"> {
  return { getItem: (key) => entries[key] ?? null };
}

describe("nextListId", () => {
  it("starts at 1", () => {
    expect(nextListId([])).toBe("1");
  });

  it("follows the highest existing id", () => {
    const lists: TodoList[] = [
      { id: "3", name: "Work", todos: [] },
      { id: "1", name: "Home", todos: [] },
    ];
    expect(nextListId(lists)).toBe("4");
  });
});

describe("addList", () => {
  it("appends an empty list with the next id", () => {
    const lists = addList([{ id: "1", name: DEFAULT_LIST_NAME, todos }], "Groceries");
    expect(lists).toHaveLength(2);
    expect(lists[1]).toEqual({ id: "2", name: "Groceries", todos: [] });
  });
});

describe("listPath", () => {
  it("builds the list URL for each filter", () => {
    expect(listPath("2")).toBe("/lists/2");
    expect(listPath("2", "active")).toBe("/lists/2/active");
    expect(listPath("2", "completed")).toBe("/lists/2/completed");
  });
});

describe("loadLists", () => {
  it("starts with one empty Todos list", () => {
    expect(loadLists(storageWith({}))).toEqual([{ id: "1", name: DEFAULT_LIST_NAME, todos: [] }]);
  });

  it("moves todos saved before lists into a Todos list", () => {
    const storage = storageWith({ [LEGACY_STORAGE_KEY]: JSON.stringify(todos) });
    expect(loadLists(storage)).toEqual([{ id: "1", name: "Todos", todos }]);
  });

  it("prefers saved lists over the old todos", () => {
    const lists: TodoList[] = [{ id: "5", name: "Work", todos: [] }];
    const storage = storageWith({
      [STORAGE_KEY]: JSON.stringify(lists),
      [LEGACY_STORAGE_KEY]: JSON.stringify(todos),
    });
    expect(loadLists(storage)).toEqual(lists);
  });

  it("falls back to the old todos when saved lists are unreadable", () => {
    const storage = storageWith({ [STORAGE_KEY]: "{not json", [LEGACY_STORAGE_KEY]: JSON.stringify(todos) });
    expect(loadLists(storage)).toEqual([{ id: "1", name: "Todos", todos }]);
  });
});
