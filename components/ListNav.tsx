"use client";

import Link from "next/link";
import { useState } from "react";
import { listPath, type TodoList } from "@/lib/todos";

type Props = {
  lists: TodoList[];
  currentId: string | undefined;
  onCreate: (name: string) => void;
};

export default function ListNav({ lists, currentId, onCreate }: Props) {
  const [newName, setNewName] = useState("");

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const name = newName.trim();
    if (!name) return;
    onCreate(name);
    setNewName("");
  }

  return (
    <nav className="lists" aria-label="Lists">
      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            <Link
              href={listPath(list.id)}
              className={list.id === currentId ? "selected" : undefined}
              aria-current={list.id === currentId ? "page" : undefined}
            >
              {list.name}
            </Link>
          </li>
        ))}
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
