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
  // Set when a key ends the edit, so focus returns to the item instead of the page body.
  const restoreFocus = useRef(false);

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
      // Focus moves to the edit button; without this the same Enter would activate it and reopen the edit.
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
          aria-label={`Toggle ${todo.title}`}
          checked={todo.completed}
          onChange={onToggle}
        />
        <label onDoubleClick={startEditing}>{todo.title}</label>
        <button ref={editButton} className="edit-button" aria-label={`Edit ${todo.title}`} onClick={startEditing} />
        <button className="destroy" aria-label={`Delete ${todo.title}`} onClick={onDestroy} />
      </div>
      {editing && (
        <input
          className="edit"
          aria-label={`Edit ${todo.title}`}
          autoFocus
          value={editText}
          onChange={(event) => setEditText(event.target.value)}
          onBlur={() => onSave(editText)}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
}
