The progress bar is in and committed on `fm/completed-count-followup-r2` as `5519e9c`. Nothing was pushed, and I've told firstmate the branch is ready to merge.

**What it does:** under the header there's now a progress bar for the share of todos completed, labelled "N% complete" (for example "40% complete"). The percentage is rounded to a whole number. The bar disappears when the list is empty. Screen readers announce it as a progress bar named "Todos completed".

**One placement detail:** I put the bar at the top of the todo list instead of between the header and the list. Visually it still sits directly under the input. The reason is that the TodoMVC stylesheet positions the "mark all complete" arrow 65px above the top of the list, so a bar placed above the list would have pushed that arrow out of position. The styling is written directly in `components/TodoApp.tsx`, since the app has no stylesheet of its own.

**Checks:**
- Lint, typecheck and the 9 unit tests pass, including new ones for the percentage calculation in `lib/todos.ts`.
- All 3 Playwright browser tests pass. The new one walks through 0%, 40%, 100%, then hidden after clearing the completed todos.
- In a screenshot with 2 of 5 todos done, the bar fill measured 207 of 518px, which is 40%.

The worktree is clean. The screenshot and test output are in `home/data/completed-count-followup-r2/`.
