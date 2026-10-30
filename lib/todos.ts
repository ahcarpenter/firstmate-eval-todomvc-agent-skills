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

export function nextId(todos: Todo[]): number {
  return todos.length + 1;
}

export function pluralize(count: number, word: string): string {
  return count === 1 ? word : `${word}s`;
}

const DUE_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export function formatDue(due: string): string {
  // Build the date from its parts so it stays on the same day in every time zone.
  const [year, month, day] = due.split("-").map(Number);
  return `Due ${DUE_FORMAT.format(new Date(year, month - 1, day))}`;
}

// Today's local calendar date as YYYY-MM-DD, comparable with a todo's due date.
export function todayISO(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function isOverdue(todo: Todo, today: string): boolean {
  // YYYY-MM-DD strings sort in calendar order.
  return !todo.completed && todo.due !== undefined && todo.due < today;
}

export function filterTodos(todos: Todo[], filter: Filter, today: string = todayISO()): Todo[] {
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
