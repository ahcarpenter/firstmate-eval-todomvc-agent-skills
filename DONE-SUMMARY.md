Every overdue todo now has a **Snooze** button that moves its due date to tomorrow. It's committed on branch `fm/overdue-followup-r1` (commit `188081b`), one commit ahead of `main`, so it will fast-forward. Lint, typecheck, the 15 unit tests and the 4 end-to-end tests all pass. I didn't look at the button in a real browser, so its placement next to long titles hasn't been checked by eye.

- **How it works:** "Tomorrow" means the next calendar day in the viewer's own time zone, and it rolls over correctly at the end of a month or year. A snoozed todo stops being overdue, so it drops out of the Overdue filter and the overdue count. The new date is saved and survives a reload.
- **Placement:** The button only shows on overdue rows. It sits just left of the delete "×", the title text is padded so the two don't overlap, and it's hidden while you're editing a todo.
- **Files changed:** `lib/todos.ts` (new `localTomorrow` helper), `components/TodoApp.tsx`, `components/TodoItem.tsx`, `app/due-date.css` and the README's layout notes.
- **New tests:** a unit test for the date rollover in `lib/todos.test.ts`, and an end-to-end test in `e2e/smoke.spec.ts` that snoozes a todo, checks it's no longer overdue and checks it after a reload.

I marked the task `done` in its status file. Nothing was pushed and no PR was opened, as the brief required. The task's message inbox was empty.
