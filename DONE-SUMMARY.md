The todo list logic is now in its own unit-tested module, and the app behaves exactly as before. It's committed on `fm/refactor-state-r3` as `dfb7221`, a clean fast-forward on `main`, and the status file shows `done`. Nothing was pushed and the worktree is clean.

**What changed** (5 files, +139/−46):
- **`lib/todoReducer.ts`** (new): all the list changes as one pure reducer function — load, add, toggle, toggle all, delete, save an edit, clear completed. It also exports `countActive`.
- **`lib/todoReducer.test.ts`** (new): 10 unit tests for the reducer and `countActive`.
- **`components/useTodos.ts`** (new): a hook that loads the list from the browser's localStorage after the page mounts and saves it on every change. The existing `react-hooks/set-state-in-effect` lint suppression moved here with the load code; I added no new suppressions.
- **`components/TodoApp.tsx`**: now holds only page state (the new-todo text and which item is being edited) and renders the page.
- **`README.md`**: updated the file layout section, which the change made out of date.

**Checks:**
- **Project checks:** `npm run lint`, `typecheck`, `test` (17/17, 7 of them existing), `build` and `test:e2e` (1/1) all pass.
- **Test strength:** I broke three conditions in the reducer one at a time (the empty-title-deletes rule, toggle, clear completed). The tests failed each time, and I restored the file after each run.
- **Same behavior in a real browser:** I wrote a Playwright script outside the repo that covers:
  - adding (trimmed, blank titles ignored, input cleared)
  - toggling, toggle all and the item count
  - the All/Active/Completed filter pages
  - editing (Enter saves, Escape cancels, clicking away saves, a blank title deletes)
  - clear completed and delete
  - what is stored in localStorage after a page reload

  It passed on the build from before the change and on the new build. Screenshots `before.png` and `after.png` are in `home/data/refactor-state-r3/`.

**My review:**
- Correctness: one difference — the old code worked from the list as of the last render, while the reducer always works from the current state. That only matters if two actions happen in the same render, which no single click or keypress does.
- Readability: the actions are typed, and each component or file does one job.
- Architecture: the reducer has no React or browser dependencies.
- Security and performance: no change.
- One duplicated check stays on purpose: TodoApp also skips blank titles, because otherwise it would clear the input on a blank Enter, which the old app didn't do.
- I made one simplification pass over my own diff, then reran all checks.

**Process:** I followed the best-practices pack `addyosmani/agent-skills` at 0.6.14. There is no `CONSTRAINTS.md`, so I applied the pack's diff-hygiene rules instead. I ran no doubt cycles and skipped cross-model review. This is a local-only refactor, so no rollout or rollback plan is needed.

**Noticed but not touching / follow-ups:**
1. **Duplicate IDs (existing bug):** `nextId` in `lib/todos.ts` uses list length + 1. Delete item 1 from [1, 2], add a new todo, and it also gets ID 2. Two items with the same ID can toggle, edit or delete together. I left it alone because this change had to keep behavior identical; it's now easy to fix with a test.
2. **No check on stored data:** `loadTodos` trusts whatever JSON is in localStorage without checking its shape.
3. **Project setup:** Vitest doesn't understand the `@/` import paths, so code under `lib/` that tests import has to use relative imports. Worth adding the alias to `vitest.config.ts`.
4. **Thin end-to-end coverage:** the end-to-end suite only tests adding a todo. My parity script could become proper end-to-end tests.
5. **Constraints file:** add a `CONSTRAINTS.md`.
6. No code was left unused by this change.
