export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export type Filter = "all" | "active" | "completed";

export const FILTERS: Filter[] = ["all", "active", "completed"];

export type TodoList = {
  id: string;
  name: string;
  todos: Todo[];
};

export const STORAGE_KEY = "todos-nextjs-lists";

// Todos saved before lists existed; read once to seed the "Todos" list and left in place.
export const LEGACY_STORAGE_KEY = "todos-nextjs";

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

export function nextListId(lists: TodoList[]): string {
  return String(lists.reduce((max, list) => Math.max(max, Number(list.id) || 0), 0) + 1);
}

export function addList(lists: TodoList[], name: string): TodoList[] {
  return [...lists, { id: nextListId(lists), name, todos: [] }];
}

export function renameList(lists: TodoList[], id: string, name: string): TodoList[] {
  return lists.map((list) => (list.id === id ? { ...list, name } : list));
}

// The last list stays: with no lists saved, loadLists would bring back the old todos.
export function deleteList(lists: TodoList[], id: string): TodoList[] {
  return lists.length > 1 ? lists.filter((list) => list.id !== id) : lists;
}

export function listPath(id: string, filter: Filter = "all"): string {
  const base = `/lists/${encodeURIComponent(id)}`;
  return filter === "all" ? base : `${base}/${filter}`;
}

function readJson<T>(storage: Pick<Storage, "getItem">, key: string): T | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function loadLists(storage: Pick<Storage, "getItem"> = window.localStorage): TodoList[] {
  const lists = readJson<TodoList[]>(storage, STORAGE_KEY);
  if (lists && lists.length > 0) return lists;
  const legacyTodos = readJson<Todo[]>(storage, LEGACY_STORAGE_KEY) ?? [];
  return [{ id: "1", name: DEFAULT_LIST_NAME, todos: legacyTodos }];
}

export function saveLists(lists: TodoList[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}
