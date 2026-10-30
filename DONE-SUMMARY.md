Each todo now has a Duplicate button next to its delete button, and the change is committed as `6b70f16` on `fm/fix-duplicate-ids-followup-r2`. Lint, typecheck, the 12 unit tests and the 3 end-to-end tests all pass.

Firstmate's one inbox message said to use my best judgement and carry on. I moved it to `handled/`, added a `resolved` line to close my earlier `blocked`, and added `done` at the end.

**What it does:**
- **Placement:** like the delete ×, the button shows when you hover over a todo. Clicking it adds a copy right below the original with the same title, not completed.
- **Its own todo:** the copy gets a new id, so toggling, editing or deleting it doesn't affect the original.
- **Kept across reloads:** copies are saved to localStorage along with the other todos.
- **Files:** the logic is a new `duplicateTodo` function in `lib/todos.ts`, wired up in `components/TodoApp.tsx` and `components/TodoItem.tsx`. The button's style is in a new `app/todo-item.css`, and I updated the README's layout notes.
- **Tests:** new unit tests check where the copy goes, its id and its completed state. A new end-to-end test duplicates a completed todo, toggles the copy alone, reloads, and deletes the copy alone.

**Assumptions:**
- I worked in this directory as the task's worktree, even though it's the repository's only checkout (the reason I'd stopped before). Following the brief's rule, the branch, edits and commit are all here.
- The copy is placed right after the original in the full list, so under a filter like Active, a copy of a completed todo shows up in its own place.
- The button shows a ⧉ symbol, with "Duplicate" as its tooltip and accessible name. To fit it, todo titles now leave 100px of space on the right instead of 15px.
- I didn't look at the button in a browser, so its exact position and the symbol's appearance haven't been checked by eye. The end-to-end test does hover and click it.

The branch fast-forwards from `main` and the working tree is clean. Nothing was pushed or merged.
