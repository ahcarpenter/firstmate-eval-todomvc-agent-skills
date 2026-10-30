Todos due today now read "Due today" and todos due tomorrow read "Due tomorrow", using the viewer's own calendar. All other dates still read "Due Nov 3". The change is committed on `fm/due-soon-r1` (commit 5254166), one fast-forward commit on top of `main`. The worktree is clean, nothing was pushed, and the done line is in the status file.

**What changed**
- `lib/todos.ts`: `formatDue(due, today)` now takes the viewer's local date. That's the same `localToday()` value the Overdue checks use. It works out "tomorrow" with plain calendar arithmetic, so month ends, year ends and leap days are handled.
- `TodoApp` passes `today` down to `TodoItem`.
- Tests:
  - New unit tests cover today, tomorrow, yesterday, the day after tomorrow, and tomorrow at month end, year end and Feb 28/29.
  - A new end-to-end test sets the browser to Los Angeles at 23:30 on Oct 29, when UTC is already Oct 30. It confirms the labels read "Due today", "Due tomorrow" and "Due Oct 31".
- Size: 5 files, +48/−5 lines. The README needed no change.

**Checks run**
- Lint, type check and unit tests (22) pass. The end-to-end suite passes 9 of 9, and it runs the production build first, so the build passes too.
- I broke the code on purpose twice: shifting "tomorrow" by an extra day, and turning off "today". The unit tests failed both times. I then restored the file.
- My own review against the five-point checklist found nothing to fix. The diff adds no suppressions, stubs, skipped tests or new dependencies.
- I didn't do a separate simplification pass, a doubt cycle or a cross-model review.

**Not done**
- I didn't take before/after screenshots or check the change by hand in a browser. The end-to-end test asserts the rendered text in a real browser, but there are no screenshots for this UI change.

**Context**
- Best-practices pack: `addyosmani/agent-skills` at 0.6.14.
- There is no `CONSTRAINTS.md`, so I followed the brief's rules on keeping the diff clean. Adding a constraints file is a follow-up.
- The steering inbox was empty throughout.

**Noticed but not touched**
- An overdue todo due yesterday shows "Due Oct 28 · Overdue", not "Due yesterday". That fits the request as written, but it's a possible follow-up.
- `nextId` returns `todos.length + 1`. Deleting a todo and then adding one can therefore reuse an id that's still in the list, which breaks React keys and toggling.

Follow-ups: a `CONSTRAINTS.md` file, and the two items above. The change leaves no unused code.
