"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TodoItem from "@/components/TodoItem";
import UndoBar from "@/components/UndoBar";
import {
  filterTodos,
  loadTodos,
  nextId,
  pluralize,
  removeCompleted,
  removeTodo,
  restoreTodos,
  saveTodos,
  type DeletedTodo,
  type Filter,
  type Todo,
} from "@/lib/todos";

const ENTER_KEY = "Enter";
const UNDO_MS = 5000;

type Deletion = { deleted: DeletedTodo[]; message: string };

export default function TodoApp({ filter }: { filter: Filter }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleted, setDeleted] = useState<Deletion | null>(null);
  const [undoPaused, setUndoPaused] = useState(false);

  useEffect(() => {
    // Read storage after mount so the server render and the first client render match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodos(loadTodos());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveTodos(todos);
  }, [todos, loaded]);

  useEffect(() => {
    if (!deleted || undoPaused) return;
    const timer = setTimeout(() => setDeleted(null), UNDO_MS);
    return () => clearTimeout(timer);
  }, [deleted, undoPaused]);

  function addTodo(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== ENTER_KEY) return;
    const title = newTitle.trim();
    if (!title) return;
    setTodos([...todos, { id: nextId(todos), title, completed: false }]);
    setNewTitle("");
  }

  function toggle(id: number) {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  }

  function toggleAll(completed: boolean) {
    setTodos(todos.map((todo) => ({ ...todo, completed })));
  }

  function destroy(id: number) {
    const result = removeTodo(todos, id);
    setTodos(result.todos);
    setDeleted(result.deleted && { deleted: [result.deleted], message: `Deleted “${result.deleted.todo.title}”` });
    setUndoPaused(false);
  }

  function undoDelete() {
    if (!deleted) return;
    setTodos(restoreTodos(todos, deleted.deleted));
    setDeleted(null);
    setUndoPaused(false);
  }

  function save(id: number, title: string) {
    const trimmed = title.trim();
    if (!trimmed) {
      destroy(id);
    } else {
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, title: trimmed } : todo)));
    }
    setEditingId(null);
  }

  function clearCompleted() {
    const result = removeCompleted(todos);
    const count = result.deleted.length;
    setTodos(result.todos);
    setDeleted({ deleted: result.deleted, message: `Cleared ${count} completed ${pluralize(count, "todo")}` });
    setUndoPaused(false);
  }

  const shown = filterTodos(todos, filter);
  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            onKeyDown={addTodo}
          />
        </header>
        {todos.length > 0 && (
          <section className="main">
            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              checked={activeCount === 0}
              onChange={(event) => toggleAll(event.target.checked)}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
              {shown.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  editing={editingId === todo.id}
                  onToggle={() => toggle(todo.id)}
                  onDestroy={() => destroy(todo.id)}
                  onEdit={() => setEditingId(todo.id)}
                  onSave={(title) => save(todo.id, title)}
                  onCancel={() => setEditingId(null)}
                />
              ))}
            </ul>
          </section>
        )}
        {todos.length > 0 && (
          <footer className="footer">
            <span className="todo-count">
              <strong>{activeCount}</strong> {pluralize(activeCount, "item")} left
            </span>
            <ul className="filters">
              <li>
                <Link href="/" className={filter === "all" ? "selected" : undefined}>
                  All
                </Link>
              </li>
              <li>
                <Link href="/active" className={filter === "active" ? "selected" : undefined}>
                  Active
                </Link>
              </li>
              <li>
                <Link href="/completed" className={filter === "completed" ? "selected" : undefined}>
                  Completed
                </Link>
              </li>
            </ul>
            {completedCount > 0 && (
              <button className="clear-completed" onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </footer>
        )}
      </section>
      <UndoBar message={deleted ? deleted.message : null} onUndo={undoDelete} onPause={setUndoPaused} />
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Part of <a href="https://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>
  );
}
