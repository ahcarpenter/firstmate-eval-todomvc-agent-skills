Lists can now be renamed and deleted. The change is committed on `fm/multiple-lists-followup-r1` as `840ee65`. Lint, typecheck, the unit tests (19) and the end-to-end tests (6, including two new ones for rename and delete) all pass.

- **Buttons:** each list in the nav has a "Rename <name>" button (✎) and a "Delete <name>" button (×).
- **Rename:** the button swaps the link for a field holding the list's name, already focused. Enter saves the new name and Escape cancels. Two choices the brief didn't cover: an empty name keeps the old one, and clicking away from the field also cancels.
- **Delete:** it asks for confirmation with the browser's confirm dialog, then removes the list and its todos. If the open list was deleted, the app switches to the first remaining list.
- **Last list:** its Delete button is disabled and greyed out, with a tooltip explaining why.
- **Persistence:** renames and deletions are saved right away, and the tests confirm they survive a reload.

I also updated the README line describing the list nav. The branch fast-forwards cleanly from `main`, the worktree is clean, nothing was pushed, and I've appended `done` to the status file.
