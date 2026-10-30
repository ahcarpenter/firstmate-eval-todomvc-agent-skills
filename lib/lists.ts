import { STORAGE_KEY, type Todo } from "./todos";

export type TodoList = {
  id: string;
  name: string;
  todos: Todo[];
};

export const LISTS_STORAGE_KEY = "todos-nextjs-lists";

export const DEFAULT_LIST_NAME = "Todos";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function listId(lists: TodoList[], name: string): string {
  const base = slugify(name) || "list";
  const taken = new Set(lists.map((list) => list.id));
  let id = base;
  for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
  return id;
}

export function createList(lists: TodoList[], name: string): TodoList {
  return { id: listId(lists, name), name, todos: [] };
}

// Before lists existed, todos were stored on their own under STORAGE_KEY.
// Those todos become a list called "Todos" the first time lists are read.
export function parseLists(raw: string | null, legacyRaw: string | null): TodoList[] {
  const lists = raw ? (JSON.parse(raw) as TodoList[]) : [];
  if (lists.length > 0) return lists;
  const todos = legacyRaw ? (JSON.parse(legacyRaw) as Todo[]) : [];
  return [{ id: listId([], DEFAULT_LIST_NAME), name: DEFAULT_LIST_NAME, todos }];
}

export function loadLists(): TodoList[] {
  try {
    return parseLists(window.localStorage.getItem(LISTS_STORAGE_KEY), window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return parseLists(null, null);
  }
}

export function saveLists(lists: TodoList[]): void {
  window.localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(lists));
}
