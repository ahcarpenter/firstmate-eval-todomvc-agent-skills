"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ListNav from "@/components/ListNav";
import TodoItem from "@/components/TodoItem";
import { createList, loadLists, saveLists, type TodoList } from "@/lib/lists";
import { filterTodos, nextId, pluralize, type Filter, type Todo } from "@/lib/todos";

const ENTER_KEY = "Enter";

// Without a listId, the app shows the first list.
export default function TodoApp({ listId, filter }: { listId?: string; filter: Filter }) {
  const router = useRouter();
  const [lists, setLists] = useState<TodoList[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    // Read storage after mount so the server render and the first client render match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLists(loadLists());
    setLoaded(true);
  }, []);

  const list = listId === undefined ? lists[0] : lists.find((candidate) => candidate.id === listId);
  const todos = list?.todos ?? [];

  // Save straight away rather than in an effect, so a new list is stored before navigating to it.
  function updateLists(next: TodoList[]) {
    setLists(next);
    saveLists(next);
  }

  function setTodos(next: Todo[]) {
    if (!list) return;
    updateLists(lists.map((candidate) => (candidate.id === list.id ? { ...candidate, todos: next } : candidate)));
  }

  function addList(name: string) {
    const created = createList(lists, name);
    updateLists([...lists, created]);
    router.push(`/lists/${created.id}`);
  }

  function addTodo(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== ENTER_KEY || !list) return;
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
    setTodos(todos.filter((todo) => todo.id !== id));
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
    setTodos(todos.filter((todo) => !todo.completed));
  }

  const listHref = `/lists/${list?.id}`;
  const shown = filterTodos(todos, filter);
  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <>
      <section className="todoapp">
        <ListNav lists={lists} currentId={list?.id} onCreate={addList} />
        {loaded && !list && <p className="missing-list">This list does not exist. Pick a list or create one.</p>}
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
                <Link href={listHref} className={filter === "all" ? "selected" : undefined}>
                  All
                </Link>
              </li>
              <li>
                <Link href={`${listHref}/active`} className={filter === "active" ? "selected" : undefined}>
                  Active
                </Link>
              </li>
              <li>
                <Link href={`${listHref}/completed`} className={filter === "completed" ? "selected" : undefined}>
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
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Part of <a href="https://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>
  );
}
