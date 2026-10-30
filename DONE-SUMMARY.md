The "Move overdue to today" button is in the footer and committed as `e775e51` on `fm/reschedule-overdue-r1`, a clean fast-forward from `main`. The worktree is clean and the `done` status line is recorded. Nothing was pushed and no PR was opened.

**What it does**
- The button shows in the footer only while at least one todo is overdue.
- Clicking it sets each overdue todo's due date to today, using the same local "today" the overdue checks use. Those todos then read "Due today".
- Completed todos, undated todos, and todos due today or later are not changed.
- The button disappears once nothing is overdue, and the new dates survive a reload.
- The logic is a new function, `moveOverdueToToday`, in `lib/todos.ts`. `TodoApp.tsx` has the button, `due-date.css` styles it, and one line of the README was updated.
- The change adds 73 lines across 5 files.

**Checks**
- **Repo checks:** `npm run lint`, `npm run typecheck`, `npm test` (27 tests) and `npm run test:e2e` (11 tests, which includes the production build) all passed.
- **New tests:** two unit tests, plus one end-to-end test covering the button appearing, the click, the button hiding, and persistence after a reload.
- **Test strength:** I changed the function to also move non-overdue todos and the unit test failed, so it catches that. The file is restored.
- **By hand:** before and after screenshots are in `home/data/reschedule-overdue-r1/` (`before.png`, `after.png`). Before shows two "Overdue" tags and the button; after shows "Due today", no tags, and no button.
- **My review:**
  - **Correctness:** it reuses `isOverdue` and doesn't change the original list.
  - **Security:** nothing new.
  - **Performance:** one pass over the list.
  - **Quality bar:** no new suppression comments, no tests skipped or deleted, no stubs.

**Process notes**
- I followed best-practices pack `addyosmani/agent-skills` at version 0.6.14.
- No `CONSTRAINTS.md` exists, so I applied the brief's diff-hygiene rules instead. Adding a constraints file is a follow-up.
- I ran no doubt cycles and no cross-model review.
- I took the screenshots with a local Playwright script rather than `chrome-devtools-axi`.

**Follow-ups**
- Add a `CONSTRAINTS.md`.
- Unrelated issue, not fixed here: `nextId` returns `todos.length + 1`, so it can reuse an ID that's already taken after a todo is deleted.
