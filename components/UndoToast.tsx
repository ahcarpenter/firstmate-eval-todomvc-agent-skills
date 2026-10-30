"use client";

import { useEffect, useState } from "react";
import styles from "./UndoToast.module.css";

export const UNDO_TIMEOUT_MS = 5000;

type Props = {
  title: string;
  onUndo: () => void;
  onExpire: () => void;
};

// Offers to undo a deletion for a few seconds. The countdown waits while the pointer or focus is on it.
export default function UndoToast({ title, onUndo, onExpire }: Props) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(onExpire, UNDO_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [paused, onExpire]);

  return (
    <div
      className={styles.toast}
      role="status"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <span className={styles.message}>Deleted “{title}”</span>
      <button className={styles.undo} onClick={onUndo}>
        Undo
      </button>
    </div>
  );
}
