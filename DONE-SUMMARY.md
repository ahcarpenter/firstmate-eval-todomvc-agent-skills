"Clear completed" can now be undone the same way as a delete. It's committed as `c967a91` on branch `fm/undo-delete-followup-r1`, which sits directly on top of `main`, and I've marked the task done in the status file. Lint, typecheck, all 16 unit tests and all 9 end-to-end tests pass. Nothing was pushed, and the worktree is clean.

- **How it works:** after clearing, the same undo bar appears for five seconds. It pauses while your pointer is on it or it has keyboard focus. Undo puts back every cleared todo in its old position, still completed, and the restored list survives a page reload.
- **Message:** the bar says "Cleared 2 completed todos" (or "1 completed todo"); deleting a single todo still says "Deleted “title”". I picked this wording myself, so change it if you'd prefer something else.
- **Id clashes:** if a todo added after the clear has taken a cleared todo's id, the restored todo gets a new id, the same as undoing a delete.
- **Code:** the main changes are in `lib/todos.ts`, `components/TodoApp.tsx` and `components/UndoBar.tsx`. There are new unit tests and a new end-to-end file, `e2e/undo-clear-completed.spec.ts`, and the README line about the undo bar now mentions "Clear completed".

The task's message inbox was empty, so there were no extra instructions to act on.
