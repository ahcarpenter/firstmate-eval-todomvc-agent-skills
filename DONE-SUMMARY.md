The "Sort by date" checkbox is in the footer and committed on `fm/sort-by-due-r1` as commit `6b8c202`, which fast-forwards from `main`. Lint, typecheck, the production build, the 20 unit tests and the 8 end-to-end tests all pass. The worktree is clean and the done line is in the status file.

**What it does:** when checked, the list is ordered by due date, earliest first, with undated todos last and ties kept in their usual order. Unchecked shows the usual order. It works within every filter, and the choice survives a reload.

**What changed:**
- **`lib/todos.ts`:** a `sortByDue` helper, plus save/load for the choice under a new localStorage key, `todos-nextjs-sort-by-due`.
- **`components/TodoApp.tsx`:** the checkbox in the footer, which sorts whatever the current filter shows.
- **`app/due-date.css`:** puts the checkbox on its own line under the filters.
- **`README.md`:** mentions the new storage key.

**Problem found during testing:** the first end-to-end run failed because the footer's stacked-paper shadow, part of the TodoMVC stylesheet, sat on top of the checkbox and swallowed clicks. I fixed it the way that stylesheet already handles its own "Clear completed" button (`position: relative`), and the test now clicks the checkbox for real.

**How I checked it:**
- **Tests added:** 3 unit tests for the sort, and 1 end-to-end test covering sorting, tie order, reload persistence, the Active filter and unchecking.
- **Mutation check:** I broke three things on purpose, one at a time: undated todos going first, ties reversed, and the box defaulting to checked. A test failed each time, and I restored the code.
- **In the browser:** I checked it with `chrome-devtools-axi`. The order was correct, the choice persisted on `/active`, and there were no console errors.
- **Review:** I went over correctness, readability, design, security and performance myself. No suppressions, skipped tests or unfinished code were added, and the diff is 131 lines added and 4 removed. No doubt cycles ran, and no review by another model was done.

**Process notes:**
- I followed the best-practices pack `addyosmani/agent-skills`, version 0.6.14.
- There is no `CONSTRAINTS.md`, so I applied the diff-hygiene rules instead. Adding a constraints file is a follow-up.
- This was a new feature, not a bug fix, so there was nothing to reproduce first.

**Noticed but not touched:**
- `nextId` uses the list length plus one, so after deleting a todo a new one can get an ID that is already taken.
- Chrome warns that some form fields have no id or name attribute.
- Nothing was left unused by this change.

Files are in `home/data/sort-by-due-r1/`:
- before-main.png
- after-unchecked.png
- after-checked.png
- build.log
