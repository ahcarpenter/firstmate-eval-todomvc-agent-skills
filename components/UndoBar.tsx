"use client";

import styles from "./UndoBar.module.css";

type Props = {
  title: string | null;
  onUndo: () => void;
  onPause: (paused: boolean) => void;
};

// The status region stays mounted so screen readers announce the message when it appears.
export default function UndoBar({ title, onUndo, onPause }: Props) {
  return (
    <div role="status">
      {title !== null && (
        <div
          className={styles.bar}
          // onMouseEnter misses the pointer arriving from a destroy button that hid mid-move.
          onMouseOver={() => onPause(true)}
          onMouseLeave={() => onPause(false)}
          onFocus={() => onPause(true)}
          onBlur={() => onPause(false)}
        >
          <span className={styles.title}>Deleted “{title}”</span>
          <button className={styles.undo} onClick={onUndo}>
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
