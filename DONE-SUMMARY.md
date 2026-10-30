I've split `components/TodoApp.tsx` up, and the app behaves the same as before. It's committed on branch `fm/refactor-state-r1` as `fe8fe46`, a clean fast-forward from `main`. Nothing was pushed and no PR was opened. I reported `done`, and the worktree is clean.

**What changed**
- **`lib/todoReducer.ts` (new):** all the list state changes as one plain function (add, toggle, toggle all, delete, save edit, clear completed, load), with no React or browser code. A save with a blank title still deletes the todo.
- **`lib/todoReducer.test.ts` (new):** 9 unit tests for it.
- **`components/usePersistedTodos.ts` (new):** a hook that loads the list from the browser after the page mounts and saves it whenever it changes. The existing lint-suppression comment moved here with the code it covers. It's still needed: lint fails without it.
- **`components/TodoApp.tsx`:** now only renders the page and keeps the new-todo text and which todo is being edited.
- **`README.md`:** updated the Layout section to match.

The diff is +125/−45 across 5 files, about 170 changed lines, within the pack's ~300-line limit for one logical change.

**Checks**
- The repository's own checks all passed: `npm run lint`, `npm run typecheck`, `npm test` (16 tests, up from 7), and `npm run test:e2e`, which also runs the production build.
- **Behavior parity:** I wrote a throwaway end-to-end test covering every feature: blank input ignored, title trimming, toggle, toggle all, the three filters, editing with Enter, Escape and click-away, blank edit deleting the todo, clear completed, delete, and saving across reloads. It passed on the original code and on the branch. It lives outside the repo under `home/data/refactor-state-r1/`.
- **Mutation check:** I reversed the blank-title checks in the new reducer one at a time. Each time 2 tests failed, so the tests do catch those changes.
- **Review:** I went through correctness, readability, architecture, security and performance, and nothing turned up. There's one theoretical difference: the old handlers read the list as it was at the last render, while the reducer always gets the latest list. Every action now produces the same result even if it runs twice, so nothing visible changes.
- **Diff hygiene:** no new suppression comments, no tests skipped or weakened, no stubs, no new dependencies.
- I didn't take before/after screenshots because the page looks identical; the parity test stands in for them. I ran no doubt cycles or cross-model review.
- The `addyosmani/agent-skills` best-practices pack was loaded at tag `0.6.14`.
- The repo has no `CONSTRAINTS.md`, so I applied the pack's diff-hygiene rules instead.

**Noticed but not touching**
- `nextId` uses `todos.length + 1`, so it can create duplicate IDs. With [a, b, c], deleting a and then adding gives a new todo with id 3, the same as c. That causes React key clashes, and toggling one todo toggles both. It's an existing bug and the brief said behavior must not change, so I left it.
- Vitest has no `@/` path alias, so test-covered `lib/` code has to use relative imports.

**Follow-ups**
- Fix the `nextId` bug in a separate change.
- Add a `CONSTRAINTS.md`.
- Consider adding a React testing setup so `usePersistedTodos` can be unit tested; for now it's only covered end to end.
- The refactor left no unused code.
