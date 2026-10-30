Each todo now has a Duplicate button next to its delete button, committed on `fm/fix-duplicate-ids-followup-r3` as `949f5b9`. The branch fast-forwards from `main`, and I've reported `done`.

**What the button does:** it puts a copy right below the todo, with the same title and not completed. The copy gets its own new id, so it can be ticked, edited and deleted without touching the original. It's saved to localStorage like any other todo, so it's still there after a reload.

**Changes:**
- `lib/todos.ts`: a new `duplicateTodo` function that adds the copy.
- `components/TodoItem.tsx` and `components/TodoApp.tsx`: the button and its handler. Both buttons now have accessible names, "Duplicate" and "Delete".
- `app/todos.css`: a new stylesheet. The duplicate button shows on hover like delete, and long titles get extra right padding so they don't run under the buttons.
- `e2e/ids.spec.ts`: those tests clicked "the button" in a todo, which matched two buttons once Duplicate existed. They now pick the delete button by name.
- Tests: two unit tests for `duplicateTodo`, and an end-to-end test (`e2e/duplicate.spec.ts`). It checks where the copy appears, that it isn't completed and toggles separately, that it survives a reload, and that deleting the original leaves the copy.

**Checks:** lint, typecheck, unit tests (12) and Playwright (4) all pass. A screenshot with a long title shows the two buttons side by side and the text wrapping before them.

No messages were waiting in the inbox, and the worktree is clean. The screenshot and test output are in the task's data folder.
