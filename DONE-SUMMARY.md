The overdue feature is done and committed on `fm/overdue-r1` as `513e194`, one commit on top of `main` that fast-forwards cleanly. Lint, typecheck, 14 unit tests, 3 end-to-end tests and the build all pass, and I've reported `done` to firstmate.

**What changed:**
- **Overdue rule:** a todo is overdue when it isn't completed and its due date is before today, using the viewer's local date. A todo due today is not overdue.
- **Badge:** overdue todos show a red "Overdue" label next to their due date.
- **Filter:** a new Overdue link sits beside All, Active and Completed, and goes to `/overdue`.
- **Footer count:** the footer shows something like "2 overdue". It only appears when at least one todo is overdue. It sits on its own line under "N items left", because on the same line it ran into the filter links. I let the footer grow taller to fit.
- **Existing due-date test:** it now fixes the browser's date. Without that, its Nov 3 todo would be flagged overdue from Nov 4 onward and the test would start failing.
- **README:** updated to mention `/overdue`.

**How I checked it:**
- I ran the repository's own checks after the final change.
- I broke the overdue rule on purpose two ways: counting a todo due today as overdue, and counting completed todos. The tests caught both. A third change survived, but it doesn't change behaviour, since a todo with no date can never be "before today".
- In a real browser I loaded the app with seeded todos and compared `main` with the branch. The screenshots are in `home/data/overdue-r1/`: `before-all.png`, `after-all.png` and `after-overdue.png`.
- I reviewed the diff myself for correctness, readability, design, security and performance. No extra review rounds and no second-model review were run.

**Pack and constraints:** the project follows the `addyosmani/agent-skills` pack, tag `0.6.14`. The repo has no `CONSTRAINTS.md`, so I applied the brief's basic rules: no new suppression comments, no skipped tests, no stubs. The diff is about 150 lines, including tests.

**Follow-ups I noticed but didn't change:**
- Add a `CONSTRAINTS.md` to the repo.
- `nextId` uses the list length plus one, so deleting a todo and then adding one can produce a duplicate id.
- The browser warns that the date input has no `id` or `name`.
- "Today" is worked out each time the page redraws, so a page left open past midnight only updates its overdue flags on the next change.
- The changed date-input test still uses Nov 3, which only works because the clock is now fixed.

The change left no unused code behind.
