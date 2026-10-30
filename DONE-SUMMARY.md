Overdue todos now work: they're labelled "Overdue", there's an Overdue filter at `/overdue`, and the footer shows a count like "2 overdue". It's committed on `fm/overdue-r3` as `9cf7323`, which fast-forwards from `main`. Nothing was pushed and no PR was opened, and I've added the `done` line to the status file.

**What changed**
- **Rule:** a todo is overdue when it isn't completed and its due date is before today's date in the user's time zone. A todo due today doesn't count. The new `isOverdue` and `todayISO` helpers are in `lib/todos.ts`, and the new filter is wired into the existing filter list.
- **Label:** each overdue todo shows a red "Overdue" next to its due date.
- **Filter:** the Overdue link sits beside All, Active and Completed, and the page is built along with the others.
- **Footer count:** it sits on its own line under "N items left". Placed beside it, it overlapped the filter links (seen in a screenshot), so I moved it.
- **Decision for you:** the count always shows when the list has todos, including "0 overdue", matching how "items left" behaves. Say if you'd rather hide it at zero.
- The README is updated, and there's a new end-to-end test in `e2e/overdue.spec.ts`.

**Checks**
- Lint, typecheck, unit tests (15 pass, 7 new), production build and end-to-end tests (3 pass) all pass.
- I changed two conditions in the overdue rule on purpose (counting "due today" as overdue, and ignoring completion), and the unit tests failed both times. Then I put the code back.
- I checked it by hand in Chrome against a build of `main`. Screenshots are in `home/data/overdue-r3/`: `before-all.png`, `after-all.png` and `after-overdue.png`.
- I went through the five review areas (correctness, readability, architecture, security, performance) and found nothing else to fix. No checks were silenced and no tests were skipped or made easier. The diff is about 110 lines across 7 files, plus the new test.
- I didn't run a separate doubt cycle or a review by a different model.

**Process notes**
- Best-practices pack: `addyosmani/agent-skills` at version `0.6.14`.
- The repo has no `CONSTRAINTS.md`, so I applied the basic diff-hygiene rules instead. Adding one is a follow-up.
- The task inbox was empty throughout.

**Follow-ups (noticed but not touched)**
- Add a `CONSTRAINTS.md`.
- `nextId` uses `todos.length + 1`, so deleting a todo and then adding one can produce a duplicate id.
- "Today" is only worked out when the page redraws, so a page left open past midnight won't update the overdue state until the user does something.
- The red footer count uses the thin font weight of the existing footer text. It's worth checking that it reads well enough.

Nothing from this change is left unused.
