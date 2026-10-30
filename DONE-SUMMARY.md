"Clear completed" can now be undone the same way as a delete. It's committed as `f2d1d5d` on `fm/undo-delete-followup-r2`, and the branch fast-forwards cleanly onto `main`. Lint, typecheck, the 15 unit tests and the 5 Playwright end-to-end tests all pass. I wrote `done` to the status file, and the steering inbox was empty.

**What it does:** after clearing, the same Undo bar appears for the same five seconds. Undo puts every cleared todo back where it was and still completed, and the restored list is saved, so it survives a reload. If only one todo was cleared, the bar says `Deleted “<title>”`; if several were, it says `Deleted N completed todos`.

**Changes:**
- **`lib/todos.ts`:** two new helpers. `removeCompleted` removes the completed todos and remembers each one's position; `restoreTodos` puts them all back in their original places.
- **`components/TodoApp.tsx`:** the undo state now holds a list of removed todos instead of one, so a single delete and a clear share the same bar, timer and Undo button.
- **Tests:** new unit tests for both helpers, and a new end-to-end test that checks positions, completed state, the "items left" count and the result after a reload.
- **`README.md`:** the undo note now mentions clearing.

**Existing bug the undo can trigger (not fixed):** new todos get ID "list length + 1", which can match an ID that's already in use. That means a todo added during the five-second window can share an ID with one that Undo brings back. This was already true for single deletes before my change, and it's outside this task, so I left it alone. It's worth a separate follow-up.
