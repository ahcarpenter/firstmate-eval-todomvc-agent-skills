The "Sort by date" checkbox is in, committed as `01134d9` on `fm/sort-by-due-r2`. The branch is one commit ahead of `main`, the worktree is clean, and I've added the `done` status line. Lint, typecheck, unit tests (23 passed) and e2e tests (6 passed, which includes the production build) all pass.

**What it does**
- A "Sort by date" checkbox sits on its own row under the filters.
- When checked, todos show earliest due date first, then undated todos (and any with an invalid stored date), with ties in their usual order. Unchecked shows the usual order.
- The sort applies within All, Active, Completed and Overdue.
- The choice is saved in `localStorage` under `todos-nextjs-sort-by-date`, so it survives reloads.
- Changes: a `sortByDueDate` helper in `lib/todos.ts` that returns a new list, the checkbox in `components/TodoApp.tsx`, CSS, and a README update. 91 lines added, 4 removed.

**Fixed during testing:** the new e2e test caught that the checkbox couldn't be clicked: the footer's decorative shadow layer from the base TodoMVC CSS was covering it. Giving it `position: relative`, the same way the base CSS keeps the filter links clickable, fixed it.

**Review**
- **Tests:** 4 new unit tests (order, ties, invalid dates, input list unchanged) and `e2e/sort-by-date.spec.ts`, which covers checking, reloading, the Active and Completed filters, and unchecking.
- **Mutation check:** I flipped each condition in the sort one at a time:
  - Two mutants failed the tests, as they should.
  - A third mutant passed at first: the invalid-date test used `"not a date"`, which sorts last as a string anyway. I added an empty-date case, and the mutant now fails.
  - One mutant still passes: returning 1 instead of 0 for equal dates gives the same order with this JavaScript engine's sort, so no test can catch it.
- **By hand:** in Chrome, the checkbox has the accessible name "Sort by date" and the layout holds at 800px and 320px wide.
- **Screenshots:** `before.png`, `after-unchecked.png`, `after-checked.png` and `after-checked-320.png`, under `home/data/sort-by-due-r2/`.
- **Diff hygiene:** no new suppression comments, no skipped tests, no stubs. The one empty-looking `catch` returns `false`, matching the existing `loadTodos`.
- **Process:** I ran no doubt cycles and skipped cross-model review. The repo has no `CONSTRAINTS.md`, so I applied the brief's diff-hygiene rules instead. Best-practices pack: addyosmani/agent-skills, tag 0.6.14.

**Noticed but not touching**
- `nextId` uses `todos.length + 1`, so deleting a todo and then adding one can create duplicate ids.
- Chrome's console reports form fields with no `id` or `name` (count: 2): the existing date inputs, and possibly the new checkbox.
- Follow-up: add a `CONSTRAINTS.md`.

The operational-inbox message isn't in the task inbox, so I left it where it was; the task inbox itself was empty.
