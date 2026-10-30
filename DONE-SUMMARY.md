"Clear completed" can now be undone the same way as a delete. The change is committed as `d8917f6` on `fm/undo-delete-followup-r3`, a clean fast-forward from `main`. I've appended `done` to the status file, the worktree is clean, and the inbox had no messages. Lint, typecheck, 18 unit tests and 13 Playwright tests all pass.

- **Behaviour:** clearing shows "Cleared N completed todo(s)" with the same five-second Undo toast. Undo puts every cleared todo back in its original position, still completed. That holds if todos were added while the toast was showing, and from the `/completed` filter when the list has emptied. If a new todo took a cleared todo's id, the restored todo gets a new one.
- **Code:** I added `removeCompleted` and `restoreTodos` to `lib/todos.ts`. `UndoToast` now takes a `message`, and `TodoApp` holds one undo offer for either a delete or a clear. The README is updated, and the new end-to-end tests are in `e2e/undo-clear.spec.ts`.
- **Countdown fix:** the toast used to be keyed by todo id, so a new offer could inherit the old countdown. Each offer now has its own key, which also fixes this for deletes when a re-used id is deleted.

**Decisions:**
- Only the latest action can be undone. Clearing right after a delete replaces the delete's offer, and the reverse is also true, matching the existing "a new deletion replaces the previous offer" rule.
- `destroy` no longer dismisses the current offer when the todo id is unknown.
