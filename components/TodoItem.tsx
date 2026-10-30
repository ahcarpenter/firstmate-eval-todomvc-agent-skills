"use client";

import { useState } from "react";
import { formatDueDate, type Todo } from "@/lib/todos";

type Props = {
  todo: Todo;
  // The user's calendar day as YYYY-MM-DD.
  today: string;
  overdue: boolean;
  editing: boolean;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onSave: (title: string, dueDate: string) => void;
  onCancel: () => void;
};

export default function TodoItem({ todo, today, overdue, editing, onToggle, onDestroy, onEdit, onSave, onCancel }: Props) {
  const [editText, setEditText] = useState(todo.title);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? "");

  function startEditing() {
    setEditText(todo.title);
    setEditDueDate(todo.dueDate ?? "");
    onEdit();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      onSave(editText, editDueDate);
    } else if (event.key === "Escape") {
      setEditText(todo.title);
      setEditDueDate(todo.dueDate ?? "");
      onCancel();
    }
  }

  // Moving focus between the title and date fields keeps editing; leaving both saves.
  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) onSave(editText, editDueDate);
  }

  const due = formatDueDate(todo.dueDate, today);
  const classes = [todo.completed ? "completed" : "", editing ? "editing" : ""].filter(Boolean).join(" ");

  return (
    <li className={classes || undefined}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={todo.completed} onChange={onToggle} />
        <label onDoubleClick={startEditing}>
          {todo.title}
          {due && <span className="due-date">{due}</span>}
          {overdue && <span className="overdue-label">Overdue</span>}
        </label>
        <button className="destroy" onClick={onDestroy} />
      </div>
      {editing && (
        <div className="edit-row" onBlur={handleBlur}>
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
              value={editDueDate}
              onChange={(event) => setEditDueDate(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </label>
        </div>
      )}
    </li>
  );
}
