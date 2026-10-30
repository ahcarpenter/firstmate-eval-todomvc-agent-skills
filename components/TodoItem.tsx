"use client";

import { useEffect, useRef, useState } from "react";
import type { Todo } from "@/lib/todos";

type Props = {
  todo: Todo;
  editing: boolean;
  onToggle: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onSave: (title: string) => void;
  onCancel: () => void;
};

export default function TodoItem({ todo, editing, onToggle, onDestroy, onEdit, onSave, onCancel }: Props) {
  const [editText, setEditText] = useState(todo.title);
  const editButton = useRef<HTMLButtonElement>(null);
  // Set when Enter or Escape ends an edit, so focus returns to the row instead of the page body.
  const restoreFocus = useRef(false);
  const titleId = `todo-title-${todo.id}`;

  useEffect(() => {
    if (!editing && restoreFocus.current) {
      restoreFocus.current = false;
      editButton.current?.focus();
    }
  }, [editing]);

  function startEditing() {
    setEditText(todo.title);
    onEdit();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      // Without this, the same Enter press activates the edit button once focus returns to it.
      event.preventDefault();
      restoreFocus.current = true;
      onSave(editText);
    } else if (event.key === "Escape") {
      restoreFocus.current = true;
      setEditText(todo.title);
      onCancel();
    }
  }

  const classes = [todo.completed ? "completed" : "", editing ? "editing" : ""].filter(Boolean).join(" ");

  return (
    <li className={classes || undefined}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
          aria-labelledby={titleId}
        />
        <label id={titleId} onDoubleClick={startEditing}>
          {todo.title}
        </label>
        <button ref={editButton} type="button" className="edit-todo" onClick={startEditing} aria-label={`Edit ${todo.title}`} />
        <button type="button" className="destroy" onClick={onDestroy} aria-label={`Delete ${todo.title}`} />
      </div>
      {editing && (
        <input
          className="edit"
          autoFocus
          aria-label={`Edit ${todo.title}`}
          value={editText}
          onChange={(event) => setEditText(event.target.value)}
          onBlur={() => onSave(editText)}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
}
