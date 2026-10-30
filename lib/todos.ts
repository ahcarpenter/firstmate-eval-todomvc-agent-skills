export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  // Calendar date as YYYY-MM-DD, the value an <input type="date"> produces.
  due?: string;
};

export type Filter = "all" | "active" | "completed" | "overdue";

export const FILTERS: Filter[] = ["all", "active", "completed", "overdue"];

export const STORAGE_KEY = "todos-nextjs";

export const SORT_BY_DUE_KEY = "todos-nextjs-sort-by-due";

export function nextId(todos: Todo[]): number {
  return todos.length + 1;
}

export function pluralize(count: number, word: string): string {
  return count === 1 ? word : `${word}s`;
}

const DUE_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

// Build a local date from YYYY-MM-DD parts so it stays on the same day in every time zone.
function parseISO(date: string, addDays = 0): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day + addDays);
}

// Today and tomorrow read as words; every other date as "Due Nov 3".
export function formatDue(due: string, today: string): string {
  if (due === today) return "Due today";
  if (due === todayISO(parseISO(today, 1))) return "Due tomorrow";
  return `Due ${DUE_FORMAT.format(parseISO(due))}`;
}

// Today's local calendar date as YYYY-MM-DD, comparable with a todo's due date.
export function todayISO(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// An empty date, what a cleared <input type="date"> holds, removes the due date.
export function withDue(todo: Todo, due: string): Todo {
  const updated: Todo = { ...todo, due };
  if (!due) delete updated.due;
  return updated;
}

export function isOverdue(todo: Todo, today: string): boolean {
  // YYYY-MM-DD strings sort in calendar order.
  return !todo.completed && todo.due !== undefined && todo.due < today;
}

// Every overdue todo becomes due today; the rest keep their dates.
export function moveOverdueToToday(todos: Todo[], today: string): Todo[] {
  return todos.map((todo) => (isOverdue(todo, today) ? { ...todo, due: today } : todo));
}

export function filterTodos(todos: Todo[], filter: Filter, today: string = todayISO()): Todo[] {
  if (filter === "active") return todos.filter((todo) => !todo.completed);
  if (filter === "completed") return todos.filter((todo) => todo.completed);
  if (filter === "overdue") return todos.filter((todo) => isOverdue(todo, today));
  return todos;
}

// Titles containing the text, ignoring case; an empty search keeps every todo.
export function searchTodos(todos: Todo[], text: string): Todo[] {
  const needle = text.toLowerCase();
  return todos.filter((todo) => todo.title.toLowerCase().includes(needle));
}

// Earliest due date first, undated todos last; ties keep their list order.
export function sortByDue(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    if (a.due === b.due) return 0;
    if (a.due === undefined) return 1;
    if (b.due === undefined) return -1;
    return a.due < b.due ? -1 : 1;
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

export function loadSortByDue(): boolean {
  return window.localStorage.getItem(SORT_BY_DUE_KEY) === "true";
}

export function saveSortByDue(sortByDue: boolean): void {
  window.localStorage.setItem(SORT_BY_DUE_KEY, String(sortByDue));
}
