The app now shows how many todos have been completed, as a line reading **"2 of 3 completed"**. It's committed as `5e556ee` on `fm/completed-count-r3`, a fast-forward from `main`, and I've reported done to Firstmate. Lint, typecheck, the 7 unit tests and both e2e tests all pass, and the e2e run includes a production build.

**What changed:** 5 lines in `components/TodoApp.tsx` add the count, and 17 lines in `e2e/smoke.spec.ts` add a test for it. The line sits just under the todo card, above "Double-click to edit a todo", and only appears when the list has todos.

**Decision for you:** the line is small and grey, matching the text under the card, so it's easy to miss. I didn't put it in the card's bottom bar next to "N items left" because there's about 165px there before the filter links. With two-digit counts the text would overlap them, and the existing test also expects that label to read exactly "1 item left". If you want it more visible, it needs its own styling.

**Checks:**
- The new test adds two todos, ticks one, reloads the page and clicks "Clear completed", checking the count at each step.
- I made sure the test can fail: with the line deliberately wired to the wrong count, it failed, and I restored the file.
- I checked it by hand in a browser with three saved todos, two of them done. Screenshots are in `home/data/completed-count-r3/`: `before.png` and `after.png`.
- I reviewed my own change for correctness, readability, design, security and performance, and found nothing to fix. It adds no warning-suppression comments, skips no tests and adds no dependencies.
- I didn't run any extra review rounds or a review by a second model.
- The repo has no `CONSTRAINTS.md`, so I followed the brief's general rules for keeping the change clean. Adding one is a follow-up.
- The README didn't need updating.
- The best-practices pack loaded was version 0.6.14.

**Housekeeping:** running the dev server made Next.js create an `AGENTS.md` file in the repo, which I deleted. The worktree is clean, and the dev server and browser session are stopped.

**Problems I noticed but didn't touch:**
- `nextId` in `lib/todos.ts` numbers new todos as list length + 1. After deleting a todo, a new one can get the same id as an existing one, so toggling or deleting may hit both.
- `loadTodos` trusts whatever is saved in the browser without checking its shape.
