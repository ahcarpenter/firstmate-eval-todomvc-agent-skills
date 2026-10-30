export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  // Calendar day as YYYY-MM-DD, the value a date input produces.
  dueDate?: string;
};

export type Filter = "all" | "active" | "completed" | "overdue";

export const FILTERS: Filter[] = ["all", "active", "completed", "overdue"];

export const STORAGE_KEY = "todos-nextjs";

export function nextId(todos: Todo[]): number {
  return todos.length + 1;
}

export function pluralize(count: number, word: string): string {
  return count === 1 ? word : `${word}s`;
}

const DUE_DATE_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function parseDueDate(dueDate: string | undefined): Date | null {
  if (!dueDate || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) return null;
  // A bare YYYY-MM-DD parses as UTC midnight.
  const date = new Date(dueDate);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDueDate(dueDate: string | undefined): string | null {
  const date = parseDueDate(dueDate);
  // Format in UTC to keep the same calendar day the date was parsed as.
  return date ? `Due ${DUE_DATE_FORMAT.format(date)}` : null;
}

// Today's calendar day in the user's time zone, as YYYY-MM-DD.
export function localDateString(now: Date): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// Tomorrow's calendar day in the user's time zone, as YYYY-MM-DD.
export function tomorrowDateString(now: Date): string {
  // The Date constructor rolls day overflow into the next month and year.
  return localDateString(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
}

// `today` is YYYY-MM-DD, so comparing the strings compares the days.
export function isOverdue(todo: Todo, today: string): boolean {
  return !todo.completed && parseDueDate(todo.dueDate) !== null && todo.dueDate! < today;
}

export function filterTodos(todos: Todo[], filter: Filter, today: string): Todo[] {
  if (filter === "active") return todos.filter((todo) => !todo.completed);
  if (filter === "completed") return todos.filter((todo) => todo.completed);
  if (filter === "overdue") return todos.filter((todo) => isOverdue(todo, today));
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
