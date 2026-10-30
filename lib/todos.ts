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

export const SORT_STORAGE_KEY = "todos-nextjs-sort-by-date";

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

// `today` is the user's calendar day as YYYY-MM-DD, from `localDateString`.
export function formatDueDate(dueDate: string | undefined, today: string): string | null {
  const date = parseDueDate(dueDate);
  if (!date) return null;
  if (dueDate === today) return "Due today";
  // Both days are UTC midnights, so one day later is exactly 24 hours later.
  const todayDate = parseDueDate(today);
  if (todayDate && date.getTime() - todayDate.getTime() === 24 * 60 * 60 * 1000) return "Due tomorrow";
  // Format in UTC to keep the same calendar day the date was parsed as.
  return `Due ${DUE_DATE_FORMAT.format(date)}`;
}

// Today's calendar day in the user's time zone, as YYYY-MM-DD.
export function localDateString(now: Date): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// `today` is YYYY-MM-DD, so comparing the strings compares the days.
export function isOverdue(todo: Todo, today: string): boolean {
  return !todo.completed && parseDueDate(todo.dueDate) !== null && todo.dueDate! < today;
}

// Applies an edit; an empty due date removes the todo's date.
export function editTodo(todo: Todo, title: string, dueDate: string): Todo {
  const edited: Todo = { ...todo, title };
  if (dueDate) edited.dueDate = dueDate;
  else delete edited.dueDate;
  return edited;
}

export function filterTodos(todos: Todo[], filter: Filter, today: string): Todo[] {
  if (filter === "active") return todos.filter((todo) => !todo.completed);
  if (filter === "completed") return todos.filter((todo) => todo.completed);
  if (filter === "overdue") return todos.filter((todo) => isOverdue(todo, today));
  return todos;
}

// Earliest due date first, undated todos last; ties keep their order because sort is stable.
export function sortByDueDate(todos: Todo[]): Todo[] {
  const key = (todo: Todo) => (parseDueDate(todo.dueDate) ? todo.dueDate! : null);
  return [...todos].sort((a, b) => {
    const dueA = key(a);
    const dueB = key(b);
    if (dueA === dueB) return 0;
    if (dueA === null) return 1;
    if (dueB === null) return -1;
    return dueA < dueB ? -1 : 1;
  });
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

export function loadSortByDate(): boolean {
  try {
    return window.localStorage.getItem(SORT_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function saveSortByDate(sortByDate: boolean): void {
  window.localStorage.setItem(SORT_STORAGE_KEY, String(sortByDate));
}
