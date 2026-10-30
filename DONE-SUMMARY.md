I added the Snooze button to overdue todos and committed it as `1015b48` on branch `fm/overdue-followup-r2`. The branch sits directly on top of `main`, so it can be merged without a rebase. Nothing was pushed, I wrote the `done` status line, and the worktree is clean. Typecheck, lint, the 17 unit tests and all 4 browser tests pass.

- **What it does:** each overdue todo now has a Snooze button. Clicking it changes the due date to tomorrow, using the person's own time zone. The todo then stops being overdue: its Overdue tag and Snooze button go away, and the footer's overdue count drops. The new date is saved, so it's still there after a page reload.
- **Code:** a small helper in `lib/todos.ts` works out tomorrow's date, including across month and year ends. The button and its click handler are in `components/TodoItem.tsx` and `components/TodoApp.tsx`.
- **Look:** the button is outlined in the same red as the Overdue tag and sits next to the delete button. I added space so long titles don't run under it. A screenshot of the layout is in the task's data folder as `snooze.png`.
- **Tests:** I added unit tests for the date helper and a browser test, `e2e/snooze.spec.ts`. I also changed one expected value in the existing `e2e/overdue.spec.ts`: it reads the whole row's text, which now ends with the word "Snooze".

My task inbox was empty, so there were no instructions to acknowledge.
