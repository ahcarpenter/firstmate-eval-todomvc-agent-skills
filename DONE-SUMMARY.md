You can now change a todo's due date while editing it. It's committed as `1a67cbf feat: edit a todo's due date` on `fm/edit-due-date-r3`, and the branch fast-forwards cleanly onto `main`. I haven't pushed it or opened a PR, and the worktree is clean.

**How it works**
- Double-clicking a todo now shows a "Change date" field under the title, filled with the todo's current due date (empty if it has none).
- Pressing Enter in either field saves both the title and the date. Escape cancels both. Clearing the date field and saving removes the date.
- Overdue marking and the overdue count update to match the new date.
- Moving between the title and the date keeps the todo in edit mode. Clicking outside both fields saves, the same way clicking away from the title saved before.

**Changes** (62 lines added, 16 removed, plus a new test file):
- `components/TodoItem.tsx`: the date field and the save/cancel handling.
- `components/TodoApp.tsx`: saving passes the date through.
- `lib/todos.ts`: a small `withDue` helper that sets or removes the date.
- `app/due-date.css`: styling for the new field.
- `README.md`: one line describing the edit fields.

**Checks**
- **New tests first:** I wrote 5 browser tests (`e2e/edit-due-date.spec.ts`) before the code, and all 5 failed. They cover:
  - seeing the current date and saving a new one, including after a reload
  - saving with Enter in the title field
  - adding a date to a todo that had none
  - Escape cancelling both fields
  - clearing the date
- **Mutation check:** reversing the "focus is still inside the edit fields" condition made all 5 tests fail, so they do guard it.
- **Final run:** lint and typecheck pass, unit tests pass (17, including 2 new ones for `withDue`), browser tests pass (8 of 8), and the production build succeeds.
- **Self-review:** I reviewed my own diff for correctness, readability, architecture, security and performance and found no issues. I added no warning suppressions and skipped no tests. I didn't run a doubt cycle or a review by another model.
- **Screenshots:** before and after edit mode are in `home/data/edit-due-date-r3/` (`before.png`, `after.png`). I made the "Change date" label 14px so it matches the "Due date" label in the header.
- **Best-practices pack:** I followed `addyosmani/agent-skills` at tag 0.6.14.
- **Quality bar:** there's no `CONSTRAINTS.md`, so I followed the pack's diff-hygiene rules.

**Follow-ups (noticed but not touched)**
- There's no `CONSTRAINTS.md` to write down the project's quality bar.
- `nextId` uses the list length plus 1, so deleting a todo and then adding one can produce a duplicate id. This bug was already there.
- Escape resets the edit fields even though opening the editor resets them again, so that step is redundant. I kept it for the date to match how the title is already handled.
