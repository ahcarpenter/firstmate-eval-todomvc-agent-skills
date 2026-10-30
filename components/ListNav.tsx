"use client";

import Link from "next/link";
import { useState } from "react";
import { listPath, type TodoList } from "@/lib/todos";

type Props = {
  lists: TodoList[];
  currentId: string | undefined;
  onCreate: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
};

export default function ListNav({ lists, currentId, onCreate, onRename, onDelete }: Props) {
  const [newName, setNewName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState("");

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const name = newName.trim();
    if (!name) return;
    onCreate(name);
    setNewName("");
  }

  function startRenaming(list: TodoList) {
    setRenameText(list.name);
    setRenamingId(list.id);
  }

  // An empty name keeps the old one.
  function handleRenameKeyDown(event: React.KeyboardEvent<HTMLInputElement>, id: string) {
    if (event.key === "Enter") {
      const name = renameText.trim();
      if (name) onRename(id, name);
      setRenamingId(null);
    } else if (event.key === "Escape") {
      setRenamingId(null);
    }
  }

  return (
    <nav className="lists" aria-label="Lists">
      <ul>
        {lists.map((list) =>
          list.id === renamingId ? (
            <li key={list.id}>
              <input
                className="rename-list"
                aria-label="List name"
                autoFocus
                value={renameText}
                onChange={(event) => setRenameText(event.target.value)}
                onKeyDown={(event) => handleRenameKeyDown(event, list.id)}
                onBlur={() => setRenamingId(null)}
              />
            </li>
          ) : (
            <li key={list.id}>
              <Link
                href={listPath(list.id)}
                className={list.id === currentId ? "selected" : undefined}
                aria-current={list.id === currentId ? "page" : undefined}
              >
                {list.name}
              </Link>
              <button className="list-action" aria-label={`Rename ${list.name}`} onClick={() => startRenaming(list)}>
                ✎
              </button>
              <button
                className="list-action"
                aria-label={`Delete ${list.name}`}
                disabled={lists.length === 1}
                title={lists.length === 1 ? "The last list cannot be deleted" : undefined}
                onClick={() => onDelete(list.id)}
              >
                ×
              </button>
            </li>
          ),
        )}
      </ul>
      <input
        className="new-list"
        aria-label="New list name"
        placeholder="New list name"
        value={newName}
        onChange={(event) => setNewName(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    </nav>
  );
}
