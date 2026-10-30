"use client";

import Link from "next/link";
import { useState } from "react";
import type { TodoList } from "@/lib/lists";

type Props = {
  lists: TodoList[];
  currentId: string | undefined;
  onCreate: (name: string) => void;
};

export default function ListNav({ lists, currentId, onCreate }: Props) {
  const [name, setName] = useState("");

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName("");
  }

  return (
    <nav className="lists" aria-label="Lists">
      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            <Link
              href={`/lists/${list.id}`}
              className={list.id === currentId ? "selected" : undefined}
              aria-current={list.id === currentId ? "page" : undefined}
            >
              {list.name}
            </Link>
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
