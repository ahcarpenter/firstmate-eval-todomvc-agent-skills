The app now shows how many todos are completed. It's committed on `fm/completed-count-r2` as `b0fb02c` (`feat: show how many todos are completed`) and the done line is in the status file. The branch is a clean fast-forward from `main` and the worktree is clean. Lint, typecheck, unit tests and e2e tests (including the production build) all pass.

**Change** (`components/TodoApp.tsx`, 5 lines added; `e2e/smoke.spec.ts`, 16 lines added)
- Whenever the list has any todos, a line reading "2 of 3 completed" appears at the top of the small grey text below the card. Screen readers announce it when it changes.
- I put it below the card because the footer row has no room. Next to "N items left" it fits only for short counts and would overlap the filters once numbers get bigger.
- The catch is that the line is small and grey, so it's easy to miss. If you'd rather have it inside the card, that needs CSS changes to the footer row.

**Verification**
- **Repo checks:** `npm run lint` and `npm run typecheck` are clean. `npm test` passes 7/7. `npm run test:e2e` passes 2/2; it builds and starts the app.
- **New e2e test:** checks the line is hidden when the list is empty, then "0 of 2", "1 of 2" after ticking a todo, and "0 of 1" after "Clear completed".
- **Mutation check:** showing the active count instead of the completed count made the new test fail. I restored the file afterwards.
- **By hand in Chrome:** the line rendered correctly at desktop width and at 320px, with no console errors.
- **Screenshots** (`home/data/completed-count-r2/`): `before.png`, `after.png`, `after-320.png`.
- **Own review:**
  - Correctness, readability, architecture, security, performance: no issues found.
  - Diff hygiene: no new suppressions, stubs or weakened tests.
  - Simplification pass: nothing to simplify.
  - README: still accurate.

**Process notes**
- I followed the `addyosmani/agent-skills` best-practices pack at tag 0.6.14, including `frontend-ui-engineering`.
- I ran no doubt cycles and skipped cross-model review.
- There's no `CONSTRAINTS.md`, so I applied the brief's diff-hygiene rules instead.
- `next dev` created an untracked `AGENTS.md` in the worktree. The brief doesn't allow creating that file, so I deleted it rather than committing it. It will come back whenever someone runs `next dev` here.

**Noticed but not touched / follow-ups**
- Add a `CONSTRAINTS.md`.
- `nextId` uses `todos.length + 1`, which can create duplicate ids after a todo is deleted.
- `loadTodos` doesn't check the shape of what it reads from storage.
- Decide whether to commit or gitignore the `AGENTS.md` that `next dev` generates.
- Decide whether the completed count should be more visible.
- No code was left unused.
