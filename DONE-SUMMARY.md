I added the "Move overdue to today" button. It's committed as `bc92806` on branch `fm/reschedule-overdue-r2`, sits directly on top of `main`, hasn't been pushed, and is reported as done.

**What changed**
- **`lib/todos.ts`:** a new helper, `rescheduleOverdue(todos, today)`, sets every overdue todo's due date to today. It uses the existing overdue check, so completed todos, undated todos, and todos due today or later keep their dates.
- **`components/TodoApp.tsx`:** the footer shows the button on its own centred row under the filters, only while something is overdue. It disappears once nothing is.
- **`app/globals.css`:** styles for the button, in the same red as the overdue count.
- **`README.md`:** one line describing the new button.
- **Tests:** three new unit tests and a new end-to-end test, `e2e/move-overdue.spec.ts`. The end-to-end test checks that the button is hidden with nothing overdue, leaves completed and future todos alone, and that the change survives a page reload.

**Checks**
- Lint, typecheck, 32 unit tests and 9 end-to-end tests all pass, and the build succeeded as part of the end-to-end run.
- **Mutation check:** I made the button always show, and separately made the helper move every active todo. The tests failed both times, and I restored the files afterwards.
- **Screenshots:** before, after, and after clicking, saved in `home/data/reschedule-overdue-r2/`. They show the button between the filters and "Sort by date", and that clicking it turns both overdue todos into "Due today" and removes the overdue count.

**Review:** I went through correctness, readability, design, security and performance. The change is about 120 lines including tests, adds no suppression comments, and weakens no tests. I didn't run any separate review passes, and no review by a second model was done. A simplification pass found nothing to change.

**Process notes**
- The best-practices pack was `addyosmani/agent-skills`, version 0.6.14.
- The repo has no `CONSTRAINTS.md`, so I followed the diff-hygiene rules from the brief instead.

**Follow-ups**
- Add a `CONSTRAINTS.md`.
- Noticed but not touched: `nextId` uses `todos.length + 1`, so deleting a todo and adding another can produce duplicate ids.
- The change left no unused code.
