export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  /** Calendar date as `YYYY-MM-DD`, the value of a date input. */
  due?: string;
};

export type Filter = "all" | "active" | "completed";

export const FILTERS: Filter[] = ["all", "active", "completed"];

export const STORAGE_KEY = "todos-nextjs";

export function nextId(todos: Todo[]): number {
  return todos.length + 1;
}

export function pluralize(count: number, word: string): string {
  return count === 1 ? word : `${word}s`;
}

// Read the date in UTC so the calendar day never shifts with the viewer's time zone.
const DUE_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export function formatDue(due: string): string {
  return `Due ${DUE_FORMAT.format(new Date(`${due}T00:00:00Z`))}`;
}

export function filterTodos(todos: Todo[], filter: Filter): Todo[] {
  if (filter === "active") return todos.filter((todo) => !todo.completed);
  if (filter === "completed") return todos.filter((todo) => todo.completed);
  return todos;
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
