"use client";

import Link from "next/link";
import { useState } from "react";
import type { TodoList } from "@/lib/lists";

type Props = {
  lists: TodoList[];
  currentId: string | undefined;
  onCreate: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
};

export default function ListNav({ lists, currentId, onCreate, onRename, onDelete }: Props) {
  const [name, setName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState("");

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName("");
  }

  function startRenaming(list: TodoList) {
    setRenameText(list.name);
    setRenamingId(list.id);
  }

  // An empty name keeps the old one.
  function finishRenaming() {
    const trimmed = renameText.trim();
    if (renamingId && trimmed) onRename(renamingId, trimmed);
    setRenamingId(null);
  }

  function handleRenameKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      finishRenaming();
    } else if (event.key === "Escape") {
      setRenamingId(null);
    }
  }

  function confirmDelete(list: TodoList) {
    if (window.confirm(`Delete the list "${list.name}" and its todos?`)) onDelete(list.id);
  }

  return (
    <nav className="lists" aria-label="Lists">
      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            {renamingId === list.id ? (
              <input
                className="rename-list"
                aria-label="Rename list"
                autoFocus
                value={renameText}
                onChange={(event) => setRenameText(event.target.value)}
                onBlur={finishRenaming}
                onKeyDown={handleRenameKeyDown}
              />
            ) : (
              <>
                <Link
                  href={`/lists/${list.id}`}
                  className={list.id === currentId ? "selected" : undefined}
                  aria-current={list.id === currentId ? "page" : undefined}
                >
                  {list.name}
                </Link>
                <button type="button" aria-label={`Rename ${list.name}`} onClick={() => startRenaming(list)}>
                  Rename
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${list.name}`}
                  title={lists.length === 1 ? "The last list cannot be deleted" : undefined}
                  disabled={lists.length === 1}
                  onClick={() => confirmDelete(list)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <label htmlFor="new-list">New list name</label>
      <input
        id="new-list"
        className="new-list"
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    </nav>
  );
}
