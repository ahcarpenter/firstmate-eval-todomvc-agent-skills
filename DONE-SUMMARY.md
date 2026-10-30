The change is committed on `fm/dedupe-active-r1` as `94f47b3`. If you add a todo whose title matches one that's still active, the list stays the same and a message says "“Buy milk” is already on your list." I've appended `done: ready in branch fm/dedupe-active-r1` to the status file. The branch is a fast-forward onto `main` and the worktree is clean. Nothing was pushed and no PR was opened.

**How it behaves**
- **Matching:** case and leading or trailing spaces are ignored, so "  buy MILK " counts as "Buy milk". I picked this rule myself; your request didn't specify it.
- **Completed todos don't count:** once "Buy milk" is done, you can add it again.
- **The notice:** it shows in a highlighted bar just under the input and clears when you start typing again. It's also announced to screen readers. Your typed text stays in the box so you can change it.
- **Code:** the check is `findActiveDuplicate` in `lib/todos.ts`, used in `components/TodoApp.tsx`. I also updated one line in the README.

**Checks**
- **Tests written first:** I added unit and browser tests before writing the code, and the 4 new unit tests failed as expected.
- **Repo checks:** `npm run lint`, `npm run typecheck`, `npm test` (11/11) and `npm run test:e2e` (3/3, including a production build) all pass.
- **Do the tests catch breakage?** I made two deliberate breaks: letting completed todos block re-adding, and not clearing the notice while typing. A test failed each time, and I restored both.
- **Tried in a real browser:** the old code added a second "buy milk"; the new code keeps the list as is and shows the notice. My first placement of the notice pushed the list down, so the "mark all complete" arrow sat on top of the message. I moved the notice inside the list section and re-checked it.
- **Screenshots** are outside the repo in `home/data/dedupe-active-r1/` (`before.png`, `after.png`).
- **Review:** I reviewed the change against the five-axis checklist (correctness, readability, architecture, security, performance) myself. I didn't run a doubt cycle or a review by a different model.
- **Guidelines:** the best-practices pack (`addyosmani/agent-skills`) was loaded at version 0.6.14. The project has no `CONSTRAINTS.md`, so I followed the basic diff-hygiene rules. The change adds no new suppressions and skips no tests.

**Noticed but not touched**
- `nextId` gives a new todo the list length + 1 as its id, so after a delete two todos can end up with the same id.
- Renaming a todo can still create a duplicate, because the check only runs when adding.
- `TodoApp.tsx` already had an `eslint-disable` comment before this change.
- The notice uses inline styles because the project has no stylesheet of its own.

**Follow-ups**
- Add a `CONSTRAINTS.md` for the project.
- Decide whether renaming a todo should also be blocked from creating a duplicate.
- Fix the `nextId` collision.

The change left no unused code.
