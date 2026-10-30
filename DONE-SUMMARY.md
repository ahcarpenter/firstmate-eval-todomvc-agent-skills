You can now change a todo's due date: when you edit a todo, a "Change date" field appears next to the title with its current date. It's committed as `19e177d` on `fm/edit-due-date-r2`, which fast-forwards from `main`. Nothing is pushed, no PR was opened, the worktree is clean, and the `done` line is on the status file.

**What it does**
- Enter in either field saves both the title and the date, and Escape cancels both.
- Clearing the date field removes the todo's date.
- Moving between the two fields keeps the todo in edit mode; clicking away from both saves, as clicking away from the title did before.
- Overdue labels and the footer count update to the new date.

**Code changes**
- A new `editTodo` function in `lib/todos.ts`.
- `components/TodoItem.tsx` has the new field and the Enter, Escape and click-away handling; `components/TodoApp.tsx` passes the date through when saving.
- `app/globals.css` styles the field. The "Change date" label reuses the "Due date" label's styles, with a more specific selector so todomvc-app-css's own label style doesn't override it.
- The README line about `TodoItem` now mentions both fields.
- About 100 lines changed.

**Checks**
- `npm run lint`, `npm run typecheck`, `npm test` (19 unit tests, 3 new) and `npm run build` all pass.
- `npm run test:e2e` passes 5/5, including 2 new tests in `e2e/edit-due-date.spec.ts`. They cover saving with Enter from each field, Escape, clearing the date, overdue changing both ways, a reload, and switching between the two fields.
- To check the tests have teeth, I temporarily made clicking away always save. Both new e2e tests failed, and I restored the file.
- I tried it by hand in Chrome with `chrome-devtools-axi`. Screenshots are in `home/data/edit-due-date-r2/`: `before-editing.png` shows only the title box; `after-editing.png` shows the title plus "Change date" set to 10/29/2026. My first "after" screenshot showed the label misaligned, which is what led to the selector fix.
- I reviewed the change myself for correctness, readability, design, security and performance. The diff adds no suppression comments, stubs, or skipped or weakened tests.
- I ran no doubt cycles, and there was no review by a second model.

The best-practices pack is `addyosmani/agent-skills` at 0.6.14. The repo has no `CONSTRAINTS.md`, so I followed the brief's general rules for a clean diff.

**Follow-ups (noticed, not changed)**
- Running `next dev` creates an untracked `AGENTS.md` in the repo root; I deleted the copy it made here. Setting `agentRules: false` in `next.config.ts` or adding the file to `.gitignore` would stop it.
- `nextId` uses the list length plus one, so deleting a todo and then adding one can produce a duplicate ID.
- Consider adding a `CONSTRAINTS.md`.
