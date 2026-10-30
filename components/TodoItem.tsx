"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Todo } from "@/lib/todos";

type Props = {
  todo: Todo;
  editing: boolean;
  onToggle: () => void;
  onToggleImportant: () => void;
  onDestroy: () => void;
  onEdit: () => void;
  onSave: (title: string) => void;
  onCancel: () => void;
};

export default function TodoItem({ todo, editing, onToggle, onToggleImportant, onDestroy, onEdit, onSave, onCancel }: Props) {
  const [editText, setEditText] = useState(todo.title);
  const titleRef = useRef<HTMLLabelElement>(null);
  const restoreFocus = useRef(false);
  const toggleId = useId();

  useEffect(() => {
    // An edit ended with Enter or Escape drops focus along with the edit field; return it to the title.
    // An edit ended by blur leaves focus wherever the user moved it.
    if (!editing && restoreFocus.current) {
      restoreFocus.current = false;
      titleRef.current?.focus();
    }
  }, [editing]);

  function startEditing() {
    setEditText(todo.title);
    onEdit();
  }

  function handleTitleKeyDown(event: React.KeyboardEvent<HTMLLabelElement>) {
    if (event.key === "Enter" || event.key === " " || event.key === "F2") {
      event.preventDefault();
      startEditing();
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      restoreFocus.current = true;
      onSave(editText);
    } else if (event.key === "Escape") {
      restoreFocus.current = true;
      setEditText(todo.title);
      onCancel();
    }
  }

  const classes = [todo.completed ? "completed" : "", todo.important ? "important" : "", editing ? "editing" : ""].filter(Boolean).join(" ");

  return (
    <li className={classes || undefined}>
      <div className="view">
        <input
          id={toggleId}
          className="toggle"
          type="checkbox"
          aria-label={todo.title}
          checked={todo.completed}
          onChange={onToggle}
        />
        <label
          ref={titleRef}
          role="button"
          tabIndex={0}
          aria-label={`Edit ${todo.title}`}
          onDoubleClick={startEditing}
          onKeyDown={handleTitleKeyDown}
        >
          {todo.title}
        </label>
        {/* Every row's star is named "Important"; the description says which todo it marks. */}
        <button
          className="important-toggle"
          aria-label="Important"
          aria-describedby={toggleId}
          aria-pressed={todo.important}
          onClick={onToggleImportant}
        />
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
