The bug is fixed and committed on `fm/fix-duplicate-ids-r3` as `305780d`. The branch fast-forwards onto `main`, and I appended the `done` line to the status file.

**Root cause:** each new todo got its ID from the list length plus one (`nextId` in `lib/todos.ts`). After a delete, that number could already belong to a todo still on the list. Two todos then shared an ID, so checking off or deleting one also hit the other. That's why it only started after something had been deleted.

**Fix** (in `lib/todos.ts`, about 40 lines including tests):
- New todos now get the highest existing ID plus one, so IDs are never reused.
- A new helper, `withUniqueIds`, runs when the list loads from localStorage and gives a fresh ID to any duplicate. Without this, the captain's saved list would keep its already-linked pairs even after the fix.

**Reproduced first:** a new e2e test, `e2e/ids.spec.ts`, follows the captain's steps: add three todos, delete one, add another, then check it. Before the fix it failed because the previously added "three" was checked along with "four". I also added a unit test that failed on the old `nextId`.

**Checks:** all of the repo's own checks pass: `npm test` (10 unit tests), `npm run lint`, `npm run typecheck`, and Playwright (3 tests; its startup runs `npm run build`, so the build passed too).
- **Mutation check:** I broke each new condition in turn: the max-ID rule, the duplicate check, and the repair call on load. A test failed every time. The repair call wasn't covered at first, so I added an e2e test that starts with duplicate IDs already in storage.
- **By hand:** I didn't click through the app myself; the Playwright tests drove it in a real browser. There are no before/after screenshots because the page looks the same; the failing e2e test is the "before" evidence.

**Review:** I went through the five axes (correctness, readability, architecture, security, performance) and found nothing to change. My diff adds no suppression comments, skipped tests, stubs or empty catch blocks. No doubt cycles were run and cross-model review was skipped. The README is still accurate.

**Best practices:** I followed `addyosmani/agent-skills` at version 0.6.14. The repo has no `CONSTRAINTS.md`, so I applied the brief's diff-hygiene rules instead.

**Noticed but not touching:**
- `loadTodos` trusts whatever JSON is in storage and doesn't check its shape.
- Handlers like `toggle` and `destroy` build the new list from the current render's `todos` rather than using functional `setTodos` updates. That's fine today, but fragile.

**Follow-ups:** add a `CONSTRAINTS.md`. The change leaves no unused code behind.
