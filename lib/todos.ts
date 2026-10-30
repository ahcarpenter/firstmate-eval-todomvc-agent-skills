export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export type TodoList = {
  id: string;
  name: string;
  todos: Todo[];
};

export type Filter = "all" | "active" | "completed";

export const FILTERS: Filter[] = ["all", "active", "completed"];

// Todos saved before lists existed. They seed the "Todos" list and are left in place.
export const LEGACY_STORAGE_KEY = "todos-nextjs";

export const STORAGE_KEY = "todos-nextjs-lists";

export const DEFAULT_LIST_NAME = "Todos";

export function nextId(todos: Todo[]): number {
  return todos.length + 1;
}

export function pluralize(count: number, word: string): string {
  return count === 1 ? word : `${word}s`;
}

export function filterTodos(todos: Todo[], filter: Filter): Todo[] {
  if (filter === "active") return todos.filter((todo) => !todo.completed);
  if (filter === "completed") return todos.filter((todo) => todo.completed);
  return todos;
}

export function listPath(listId: string, filter: Filter = "all"): string {
  const base = `/lists/${encodeURIComponent(listId)}`;
  return filter === "all" ? base : `${base}/${filter}`;
}

export function nextListId(lists: TodoList[]): string {
  return String(Math.max(0, ...lists.map((list) => Number(list.id) || 0)) + 1);
}

export function addList(lists: TodoList[], name: string): TodoList[] {
  return [...lists, { id: nextListId(lists), name, todos: [] }];
}

export function renameList(lists: TodoList[], id: string, name: string): TodoList[] {
  return lists.map((list) => (list.id === id ? { ...list, name } : list));
}

// Keeps the last list, so there is always one to show.
export function deleteList(lists: TodoList[], id: string): TodoList[] {
  const next = lists.filter((list) => list.id !== id);
  return next.length > 0 ? next : lists;
}

function parse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// Builds the lists from storage, turning pre-list todos into a list called "Todos".
export function parseLists(raw: string | null, legacyRaw: string | null): TodoList[] {
  const lists = parse<TodoList[]>(raw);
  if (Array.isArray(lists) && lists.length > 0) return lists;
  const legacy = parse<Todo[]>(legacyRaw);
  return [{ id: "1", name: DEFAULT_LIST_NAME, todos: Array.isArray(legacy) ? legacy : [] }];
}

export function loadLists(): TodoList[] {
  return parseLists(window.localStorage.getItem(STORAGE_KEY), window.localStorage.getItem(LEGACY_STORAGE_KEY));
}

export function saveLists(lists: TodoList[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}
