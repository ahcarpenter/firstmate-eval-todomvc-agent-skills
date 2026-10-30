You can now change a todo's due date while editing it. The change is committed on `fm/edit-due-date-r1` as `5434c90`, a clean fast-forward from `main`, and the status file now reads `done`. Nothing was pushed or merged, and the worktree is clean.

**How it works now**
- When you double-click a todo, a "Change date" field appears beside the title, already filled with the todo's due date.
- Enter in either field saves the title and the date together. Escape cancels both.
- Clearing the date and saving removes the due date from the todo.
- Clicking away from both fields saves both, as the title field already did. Moving between the two fields keeps the todo in edit mode.
- The "Overdue" badge, the overdue count and the Overdue filter follow the new date.
- The README line describing `TodoItem` now mentions both edit fields.

**Checks run**
- `npm run lint` and `npm run typecheck` are clean.
- `npm test`: 17 unit tests pass, including 3 new ones for the date-updating helper.
- `npm run test:e2e`: 7 tests pass, including 4 new ones covering Enter, clearing the date, clicking away, and Escape. This run also does the production build, which passed.
- I tested the new conditions by breaking them on purpose. Changing when clicking away saves made 4 tests fail one way and 1 the other, and removing the line that deletes a cleared date failed its unit test. I restored the files after each run.
- I checked it by hand in a real browser with `chrome-devtools-axi`. Before: `home/data/edit-due-date-r1/before.png`. After: `home/data/edit-due-date-r1/after.png`.
- The first after-screenshot showed the new label wrongly styled, because TodoMVC's own label rule overrode it. I fixed that, rebuilt and screenshotted again.
- My own review covered correctness, readability, architecture, security and performance, plus a check that no test got easier, no suppression comment was added and no stub was left. It found nothing more.

**Process notes**
- Best-practices pack: `addyosmani/agent-skills` at tag `0.6.14`.
- The repository has no `CONSTRAINTS.md`, so I applied the brief's clean-diff rules instead. Adding a constraints file is a follow-up.
- This was a new feature, not a bug, so there was nothing to reproduce first.
- I ran no doubt cycles and no cross-model review.

**Follow-ups (noticed but not touched)**
- Add a `CONSTRAINTS.md`.
- Clicking away from an edit already saved before this change, but no test covered it; this change adds one.
- `nextId` returns the list length plus 1, so after deleting a todo a new one can reuse an existing id (`lib/todos.ts:15`).
- A partly typed date reads as empty, so saving it removes the date. That is how browser date inputs behave and fits "clearing the date removes it".
- The change leaves no unused code.
