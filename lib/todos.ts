export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

// A deleted todo and the position it held, kept so the deletion can be undone.
export type DeletedTodo = {
  todo: Todo;
  index: number;
};

export type Filter = "all" | "active" | "completed";

export const FILTERS: Filter[] = ["all", "active", "completed"];

export const STORAGE_KEY = "todos-nextjs";

export function nextId(todos: Todo[]): number {
  return Math.max(0, ...todos.map((todo) => todo.id)) + 1;
}

export function pluralize(count: number, word: string): string {
  return count === 1 ? word : `${word}s`;
}

export function filterTodos(todos: Todo[], filter: Filter): Todo[] {
  if (filter === "active") return todos.filter((todo) => !todo.completed);
  if (filter === "completed") return todos.filter((todo) => todo.completed);
  return todos;
}

export function removeTodo(todos: Todo[], id: number): { todos: Todo[]; deleted: DeletedTodo | null } {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return { todos, deleted: null };
  return { todos: todos.filter((todo) => todo.id !== id), deleted: { todo: todos[index], index } };
}

// Puts a deleted todo back where it was. If a todo added since then took its id, it gets a new one.
export function restoreTodo(todos: Todo[], { todo, index }: DeletedTodo): Todo[] {
  const restored = todos.some((other) => other.id === todo.id) ? { ...todo, id: nextId(todos) } : todo;
  return [...todos.slice(0, index), restored, ...todos.slice(index)];
}

export function loadTodos(): Todo[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Todo[]) : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
