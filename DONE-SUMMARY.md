The completed count is done and committed on `fm/completed-count-r1` (commit `2a098dd`), a fast-forward from `main`. I didn't push. I added the `done` line to the status file.

**What changed:** once at least one todo is checked off, the footer reads "1 item left · 2 completed". The count updates as todos are checked and disappears after "Clear completed". The change adds 8 lines to `components/TodoApp.tsx` and one new end-to-end test in `e2e/smoke.spec.ts`.

**One choice to confirm:** the count is hidden when nothing is completed, the same rule the existing "Clear completed" button follows. This kept the existing "1 item left" test unchanged. Showing "0 completed" all the time would be a one-line change if you'd rather have that.

**Checks I ran:**
- **Tests:** lint, typecheck, the 7 unit tests and both end-to-end tests pass. The end-to-end run includes a full production build, which passed.
- **Test first:** I wrote the new test before the code and confirmed it failed.
- **Does the test catch mistakes:** I deliberately changed the "show only when above 0" rule to "always show". Both end-to-end tests failed, then I put the file back.
- **Browser screenshots:** taken with `chrome-devtools-axi`, saved in `home/data/completed-count-r1/`. `before.png` shows "1 item left" and `after.png` shows "1 item left · 2 completed". The new text fits on the left of the footer and doesn't overlap the filters at 800px wide.

**Own review:**
- The completed count was already worked out in the code; I only display it.
- Nothing is silenced and no test was skipped or made easier.
- No dependency changes, and the README didn't need updating.
- I ran no doubt cycles or cross-model review.

**Rules followed:** the `addyosmani/agent-skills` best-practices pack, version 0.6.14, was loaded. The repo has no `CONSTRAINTS.md`, so I kept to the brief's rules for a clean diff instead.

**Follow-ups (noticed, not touched):**
- **Duplicate IDs bug:** `nextId` in `lib/todos.ts` gives a new todo the number of todos plus one. After a delete, a new todo can get the same ID as an existing one.
- **Saved data isn't checked:** `loadTodos` reads saved todos from browser storage without checking their shape.
- **No standards file:** consider adding a `CONSTRAINTS.md` to write down the project's quality bar.

Nothing is left unused by this change.
