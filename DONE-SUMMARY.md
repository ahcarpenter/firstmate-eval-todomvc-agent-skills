The fix is committed on `fm/fix-duplicate-ids-r1` as `799c308` (`fix: stop reusing todo ids after a delete`). The branch fast-forwards onto `main`, the worktree is clean, and I've written the `done` line to the status file.

**Cause:** `nextId` in `lib/todos.ts` gave each new todo the id `todos.length + 1`. After a delete, that number could already belong to a todo still in the list, so two todos shared an id. Checking or deleting one of them then hit both, which is why it only started after a delete.

**Fix** (59 lines added, 3 removed, in `lib/todos.ts` and the tests):
1. `nextId` now uses the highest existing id + 1.
2. A new `dedupeIds` runs when the list loads from localStorage and gives a fresh id to any repeat. Without it, users who already hit the bug would keep their broken saved list.

**Checks**
- **Reproduced first:** a new unit test failed (it returned 2 instead of 3). A new end-to-end test followed the user's steps (add three, delete one, add one, check the new one) and failed because another todo got checked too.
- **After the fix:** lint, typecheck, unit tests (10/10) and end-to-end tests (3/3) all pass. The build passed, since the end-to-end setup builds the app before starting it.
- **Mutation experiment:** I flipped each condition the change adds and confirmed a test goes red. Removing the `dedupeIds` call from `loadTodos` left every test green at first, so I added an end-to-end test that seeds storage with duplicate ids. It fails without that call and passes with it.
- **Five-axis review:** I found no issues. Repaired ids are numbered above the current highest, so they can't clash, and the cost is one pass over the list on load. The simplification pass changed nothing because the diff was already minimal.
- **Constraints guard:** no tests skipped or weakened, no new suppression comments, no stubs or empty catch blocks.
- **Docs:** the README is still accurate.
- I tested in a real browser through Playwright, not by hand. There are no before/after screenshots because the UI didn't change.
- I ran no doubt cycles and skipped cross-model review.

**Best-practices pack:** I followed `addyosmani/agent-skills` at version 0.6.14. The project has no `CONSTRAINTS.md`, so I applied the brief's diff-hygiene rules instead.

**Noticed but not touching:**
- If saved data is corrupt in other ways (missing or non-numeric ids, or not an array), `loadTodos` trusts it as-is.
- `TodoApp.tsx` builds each update from the current render's `todos` rather than the latest state. That works today, but it can drop updates if two happen close together.

**Follow-ups:** add a `CONSTRAINTS.md` that sets the project's quality bar. The change leaves no code unused.
