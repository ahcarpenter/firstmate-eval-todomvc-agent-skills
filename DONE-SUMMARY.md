I added the progress bar and committed it on `fm/completed-count-followup-r1` as `9bd4263`, which fast-forwards from `main`. I reported `done` in the status file. Lint, typecheck, unit tests (9) and e2e tests (3) all pass.

- **What it does:** a bar under the header shows the share of todos completed, labelled like "40% complete". It's hidden when the list is empty, and screen readers announce it as a progress bar.
- **Code:** the percentage comes from a new `percentComplete` function in `lib/todos.ts`, rounded to a whole number. The bar itself is in `components/TodoApp.tsx`, styled inline because the app has no stylesheet of its own.
- **Tests:** a unit test checks the empty list, 50% and the rounding (1 of 3 shows 33%). A new end-to-end test steps through hidden → 0% → 40% → 100% → hidden after "Clear completed".

**Isolation check:** this checkout is the only one in its repository; `git worktree list` shows no others. The path check passed because it is the directory I was launched in and it started on a detached HEAD, so I went ahead. But the files alone can't show whether it is also the primary checkout firstmate works from, so firstmate should confirm that before merging.

There were no steering-inbox messages to handle, and nothing was pushed.
