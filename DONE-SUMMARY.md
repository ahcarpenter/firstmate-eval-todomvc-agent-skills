The progress bar is in and committed on `fm/completed-count-followup-r3` (69cc0df). The branch fast-forwards cleanly onto `main`, and I've written the `done:` line to the status file. Nothing was pushed and no PR was opened.

**What changed**
- **Bar (`components/TodoApp.tsx`):** a progress bar now sits right under the header. It's labelled with the percentage, for example "40% complete", and it's hidden when the list is empty. It uses the browser's built-in `<progress>` element with a little inline styling, since the app has no stylesheet of its own.
- **Percentage (`lib/todos.ts`):** a new helper, `completedPercent`, works out the share of completed todos rounded to the nearest whole number, and returns 0 for an empty list.
- **Tests:** unit tests for the helper, plus a browser test that walks through 0%, 40%, 100%, and the bar disappearing once the list is empty.
- **`README.md`:** I added "completion percentage" to the description of `lib/todos.ts`.

**Checks:** lint, typecheck, the 9 unit tests and the 3 browser tests all pass. My first version of the new browser test failed because it deleted todos by clicking a hidden delete button. I changed it to empty the list with "Mark all as complete" and then "Clear completed", and it passes now.

The worktree is clean, and the task inbox had no messages.
