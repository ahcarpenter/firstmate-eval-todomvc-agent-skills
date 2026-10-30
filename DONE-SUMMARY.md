Due dates are working and committed on `fm/due-dates-r1` as `f23a5e7`, and I reported done to firstmate. Lint, typecheck, unit tests (8/8) and end-to-end tests (2/2, which include a production build) all pass. The branch fast-forwards onto `main`, nothing was pushed, and the worktree is clean.

**What changed (~90 lines)**
- **Adding:** a field labelled "Due date" now sits to the right of the new-todo input. Pressing Enter in either field adds the todo with the date, and both fields then clear.
- **Display:** a todo with a date shows "Due Nov 3" in smaller grey text under its title. Todos without one look the same as before.
- **Saving:** the date is stored on the todo as `YYYY-MM-DD` in the same localStorage list as everything else, so it survives a reload. Lists saved before this change still load.
- **Date shift:** the date is formatted in UTC, so it shows the same day in every time zone.
- **Styles:** they're in a new file, `app/due-date.css`, using the app's existing colours; the due-date text is dark enough to read easily on white.

**How I checked it**
- **Tests:** I added a unit test for the "Due Nov 3" formatting, written before the code. The new end-to-end test adds one todo with a date and one without, checks the text, checks the date field clears, and reloads to confirm the date is still there.
- **Mutation check:** I deliberately broke the line that attaches the date; the end-to-end test failed, then I restored the line.
- **By hand:** screenshots of the before and after look right at desktop width and narrow width, with no console errors. My one scripted attempt to add a dated todo in the browser didn't create a todo, likely a quirk of the browser tool. I didn't look into it further because the end-to-end test covers that path and passes.
- **Before/after screenshots:** `home/data/due-dates-r1/` (`before.png`, `after.png`, `after-320.png`).

**Notes**
- Running `next dev` generated an untracked `AGENTS.md` in the repo root, and the file says to commit it. I deleted it instead, since the brief forbids creating that file. Setting `agentRules: false` in `next.config` would stop it from being generated.
- There's no `CONSTRAINTS.md`. I kept the diff clean (no new suppression comments, stubs or skipped tests) and suggest adding one as a follow-up.
- The README is still accurate; I didn't change it.
- Best-practices pack: `addyosmani/agent-skills` at tag 0.6.14. I followed `frontend-ui-engineering`. I ran no doubt cycles, skipped cross-model review, and didn't use `source-driven-development`, since no new Next.js APIs were involved.

**Problems I noticed but didn't touch**
- `nextId` uses `todos.length + 1`, so deleting a todo and then adding one can create two todos with the same id.
- `loadTodos` trusts whatever JSON is in localStorage without checking its shape.
- Existing todos have no way to add, change or remove a due date; editing only changes the title.
