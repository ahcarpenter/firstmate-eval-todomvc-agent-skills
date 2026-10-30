I split `components/TodoApp.tsx` so the list logic can be unit tested on its own, and the app behaves the same as before. It's one commit, `2eb14e7`, on branch `fm/refactor-state-r2`. That branch fast-forwards cleanly onto `main`, the worktree is clean, nothing was pushed, and I've written the done line to the status file.

**What changed** (+126 / −45 lines, 5 files)
- **`lib/todoReducer.ts`** (new): a pure function that handles every change to the list: load, add, toggle, mark all, delete, save an edit (a blank title deletes the todo) and clear completed.
- **`components/useTodos.ts`** (new): a hook that holds the list and does the localStorage loading and saving, which used to live in `TodoApp`.
- **`components/TodoApp.tsx`**: now only draws the page and keeps the input text and which todo is being edited.
- **`lib/todoReducer.test.ts`** (new): 9 tests, one per kind of change plus the blank-input cases.
- **`README.md`**: the Layout section now lists the new files.

**Checks**
- **Repository checks:** `npm run lint`, `npm run typecheck`, `npm test` (16/16 pass, up from 7) and `npm run test:e2e` (1/1) all pass, before and after the change. The e2e run includes a production build, which also passed.
- **Same behaviour, checked by hand:** I built the original commit separately and ran a scripted 15-step browser walkthrough against both versions. It covers adding (including surrounding spaces and blank input), toggling, editing by Enter, Escape and clicking away, saving a blank title, the three filter pages, mark all and unmark all, reload, clear completed and delete. The visible list, the item count and the saved localStorage data were identical at every step. Proof is in `home/data/refactor-state-r2/`: `before.txt`, `after.txt` and the screenshots `before.png` / `after.png`.
- **Do the tests catch mistakes?** I broke two conditions in the new code one at a time; each made a test fail, and I restored the file both times.
- **My own review:** I went through correctness, readability, architecture, security and performance. Correctness is covered by the identical walkthrough. Security and performance are unchanged: no new inputs or storage. There are no new suppression comments; the existing `react-hooks/set-state-in-effect` one moved into the hook with the code it covers, and lint confirms it's still needed. No stubs or empty catch blocks, and no tests were skipped or deleted.
- **Not done:** no doubt cycles and no cross-model review. My simplification pass found nothing more to change.

**Process notes**
- The best-practices pack is `addyosmani/agent-skills`, version `0.6.14`.
- The project has no `CONSTRAINTS.md`, so I applied the diff-hygiene rules instead.
- The isolation check passed: the working directory and the git top-level are both the directory I was launched in. It's the repo's only checkout, though, not a pool worktree.

**Noticed but not touched** (follow-ups)
1. Todo ids can repeat: new ids are the list length + 1, so after deleting one todo the next one added can reuse an id that's still in the list. That's an existing bug, which I left alone because this change had to keep behaviour identical.
2. Saved data is read back from localStorage without checking its shape.
3. Add a `CONSTRAINTS.md` that writes down the quality bar.
4. Unit tests only run on `lib/**/*.test.ts`, so the `useTodos` hook has no tests; that would need a React test setup.

The change left no unused code behind.
