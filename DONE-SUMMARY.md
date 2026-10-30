The duplicate-todo bug is fixed and committed as `c6e3301` on `fm/fix-duplicate-ids-r2`. That branch is a clean fast-forward from `main`. I didn't push, open a PR or merge, and the status line now reads `done: ready in branch fm/fix-duplicate-ids-r2`.

**Cause:** in `lib/todos.ts`, `nextId` gave each new todo the number of todos plus one. After you deleted one, the next todo you added got an id that another todo already had. Checking off or deleting either of them then hit both, which is why it only showed up after a delete.

**Fix:**
- New todos now get the highest existing id plus one.
- If your browser's saved todos already contain duplicate ids from the old code, each repeat gets a fresh id when the app loads (`withUniqueIds`). The first todo with a given id keeps it.

**Reproduction:** before changing any code, I added two tests and both failed:
- An end-to-end test: add three todos, delete the middle one, add a fourth, then check it off. "three" got checked along with "four".
- A unit test showing `nextId` reused the id 3 when the list held ids 1 and 3.

**Checks:**
- `npm test`: 10 tests pass, including 3 new ones.
- `npm run lint` and `npm run typecheck`: clean.
- `npm run test:e2e`: both tests pass. This command builds the app first, so the build passes too.
- To make sure the new tests actually catch the bug, I broke each new line of the fix in turn. Each time a test failed, and then I restored the code.
- Review of the change: it adds 65 lines and removes 3 across three files. It adds no suppression comments and skips no tests. The README is still accurate. The change has no security or performance impact.
- There are no UI changes, so I took no before/after screenshots. The browser check was the Playwright test rather than clicking through by hand.
- I ran no doubt cycles or cross-model review.

**Firstmate notes:**
- Practices pack: `addyosmani/agent-skills`, tag 0.6.14.
- The repo has no `CONSTRAINTS.md`, so I followed the brief's diff-hygiene rules instead.
- I didn't use `source-driven-development`, so there are no sources to cite.

**Follow-ups (noticed, not fixed):**
- Add a `CONSTRAINTS.md` to the repo.
- `components/TodoApp.tsx` has an existing `eslint-disable-next-line react-hooks/set-state-in-effect` that is worth revisiting.
- `loadTodos` accepts whatever JSON is in storage without checking its shape.
- No code was left unused.
