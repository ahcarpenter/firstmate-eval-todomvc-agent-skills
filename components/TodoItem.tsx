"use client";

import { useState } from "react";
import { formatDue, type Todo } from "@/lib/todos";

type Props = {
  todo: Todo;
  today: string;
  overdue: boolean;
  editing: boolean;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onSave: (title: string, due: string) => void;
  onCancel: () => void;
};

export default function TodoItem({ todo, today, overdue, editing, onToggle, onDestroy, onEdit, onSave, onCancel }: Props) {
  const [editText, setEditText] = useState(todo.title);
  const [editDue, setEditDue] = useState(todo.due ?? "");

  function startEditing() {
    setEditText(todo.title);
    setEditDue(todo.due ?? "");
    onEdit();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      onSave(editText, editDue);
    } else if (event.key === "Escape") {
      setEditText(todo.title);
      setEditDue(todo.due ?? "");
      onCancel();
    }
  }

  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    // Moving focus between the title and the date keeps editing open.
    if (!event.currentTarget.contains(event.relatedTarget)) onSave(editText, editDue);
  }

  const classes = [todo.completed ? "completed" : "", editing ? "editing" : ""].filter(Boolean).join(" ");

  return (
    <li className={classes || undefined}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={todo.completed} onChange={onToggle} />
        <label onDoubleClick={startEditing}>
          {todo.title}
          {todo.due && (
            <span className="todo-due">
              {formatDue(todo.due, today)}
              {overdue && <span className="todo-overdue">Overdue</span>}
            </span>
          )}
        </label>
        <button className="destroy" onClick={onDestroy} />
      </div>
      {editing && (
        <div onBlur={handleBlur}>
          <input
            className="edit"
            autoFocus
            value={editText}
            onChange={(event) => setEditText(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <label className="edit-due">
            Change date
            <input
              type="date"
              value={editDue}
              onChange={(event) => setEditDue(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </label>
        </div>
      )}
    </li>
  );
}
