Todos due today now show "Due today", todos due tomorrow show "Due tomorrow", and other dates still show "Due Nov 3". It's committed as `6c92691` on `fm/due-soon-r2`, which fast-forwards from `main`. The worktree is clean, the done line is in the status file, and nothing was pushed.

**What changed**
- **Formatting:** `formatDueDate` in `lib/todos.ts` now also takes today's date. `TodoApp` already works that out from the browser's time zone for the overdue check, and passes it down to each `TodoItem`. So "today" and "tomorrow" follow the person's own calendar, the same way overdue does. Moving from one month or year to the next, including leap days, is handled.
- **Tests:** I added unit cases for today, tomorrow, and month, year and leap-day boundaries. A new e2e spec, `e2e/due-soon.spec.ts`, runs with the browser set to Auckland time. There it is already Oct 31 while UTC is still Oct 30, so the test proves the labels use the local calendar, not UTC.
- **Existing tests:** `due-date.spec.ts` and `sort-by-date.spec.ts` used the real clock. With this change they would have failed in the days just before their test dates, so I fixed their clock to Oct 30, as the other specs already do.
- **README:** one line describing the new labels.

**Checks:** lint, typecheck, the unit tests (25), the build, and the end-to-end tests (7) all pass.
- **Mutation test:** I turned off the "today" check and changed the "tomorrow" gap to two days, one at a time. The unit tests failed both times, and I restored the file.
- **Browser check:** I loaded the same four todos (due Oct 29, Oct 30, Oct 31 and Nov 3) on the old build and the new one. Before, they showed "Due Oct 30" and "Due Oct 31". After, they show "Due today" and "Due tomorrow", while Oct 29 stays "Overdue" and Nov 3 is unchanged.

**Review:**
- **Five-axis review:** the change is a pure function plus one new prop. No input-handling, security or performance concerns.
- **Constraint check:** no tests were weakened or skipped, no checks were silenced, and nothing is left as a stub. The two clock changes make those tests fixed rather than looser.
- **Other:** no doubt cycles were run and cross-model review was skipped. The project has no `CONSTRAINTS.md`, so I followed the brief's diff-hygiene rules instead. The skills pack was `addyosmani/agent-skills`, tag 0.6.14.

**Noticed but not touched:**
- `nextId` uses `todos.length + 1`, so after a deletion it can hand out an id that's already in use.
- `loadTodos` doesn't check the shape of what it reads from storage.

**Follow-ups:**
- Add a `CONSTRAINTS.md` to the project.
- Nothing was left unused by this change.

Files are in `home/data/due-soon-r2/`:
- `before.png`
- `after.png`
- `shot.sh` (the screenshot script)
