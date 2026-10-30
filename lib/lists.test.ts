import { describe, expect, it } from "vitest";
import { createList, listId, parseLists, type TodoList } from "./lists";

const todo = { id: 1, title: "Buy milk", completed: false };

describe("parseLists", () => {
  it("turns existing todos into a list called Todos", () => {
    expect(parseLists(null, JSON.stringify([todo]))).toEqual([{ id: "todos", name: "Todos", todos: [todo] }]);
  });

  it("starts with an empty Todos list when nothing is stored", () => {
    expect(parseLists(null, null)).toEqual([{ id: "todos", name: "Todos", todos: [] }]);
  });

  it("starts with a Todos list when the stored lists are empty", () => {
    expect(parseLists("[]", null)).toEqual([{ id: "todos", name: "Todos", todos: [] }]);
  });

  it("prefers stored lists over the old todos", () => {
    const lists: TodoList[] = [{ id: "work", name: "Work", todos: [] }];
    expect(parseLists(JSON.stringify(lists), JSON.stringify([todo]))).toEqual(lists);
  });
});

describe("listId", () => {
  it("makes a URL-safe id from the name", () => {
    expect(listId([], "  Groceries & Stuff! ")).toBe("groceries-stuff");
  });

  it("falls back when the name has no URL-safe characters", () => {
    expect(listId([], "日本")).toBe("list");
  });

  it("does not reuse an existing id", () => {
    const lists = [createList([], "Work")];
    expect(listId(lists, "work")).toBe("work-2");
    expect(listId([...lists, createList(lists, "Work")], "Work")).toBe("work-3");
  });
});

describe("createList", () => {
  it("creates an empty list with the given name", () => {
    expect(createList([], "Work")).toEqual({ id: "work", name: "Work", todos: [] });
  });
});
