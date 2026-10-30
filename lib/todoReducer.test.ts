import { describe, expect, it } from "vitest";
import { todoReducer } from "./todoReducer";
import type { Todo } from "./todos";

const todos: Todo[] = [
  { id: 1, title: "Buy milk", completed: false },
  { id: 2, title: "Walk the dog", completed: true },
];

describe("todoReducer", () => {
  it("replaces the list on load", () => {
    expect(todoReducer([], { type: "load", todos })).toBe(todos);
  });

  it("adds a trimmed, active todo with the next id", () => {
    expect(todoReducer(todos, { type: "add", title: "  Feed cat  " })).toEqual([
      ...todos,
      { id: 3, title: "Feed cat", completed: false },
    ]);
  });

  it("ignores a blank title on add", () => {
    expect(todoReducer(todos, { type: "add", title: "   " })).toBe(todos);
  });

  it("toggles one todo", () => {
    const next = todoReducer(todos, { type: "toggle", id: 1 });
    expect(next.map((todo) => todo.completed)).toEqual([true, true]);
  });

  it("marks every todo with toggleAll", () => {
    expect(todoReducer(todos, { type: "toggleAll", completed: true }).every((todo) => todo.completed)).toBe(true);
    expect(todoReducer(todos, { type: "toggleAll", completed: false }).some((todo) => todo.completed)).toBe(false);
  });

  it("destroys one todo", () => {
    expect(todoReducer(todos, { type: "destroy", id: 1 }).map((todo) => todo.id)).toEqual([2]);
  });

  it("saves a trimmed title", () => {
    const next = todoReducer(todos, { type: "save", id: 2, title: "  Walk the cat " });
    expect(next[1]).toEqual({ id: 2, title: "Walk the cat", completed: true });
    expect(next[0]).toBe(todos[0]);
  });

  it("destroys the todo when saved with a blank title", () => {
    expect(todoReducer(todos, { type: "save", id: 1, title: "  " }).map((todo) => todo.id)).toEqual([2]);
  });

  it("clears completed todos", () => {
    expect(todoReducer(todos, { type: "clearCompleted" }).map((todo) => todo.id)).toEqual([1]);
  });
});
