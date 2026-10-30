I've added optional due dates and committed the change as `4318c8a` on branch `fm/due-dates-r3`. It sits directly on top of `main`, so it can be merged as a fast-forward. Nothing was pushed and the worktree is clean. Lint, typecheck, unit tests, build and the end-to-end tests all pass, and I've reported done to firstmate. The best-practices pack is `addyosmani/agent-skills` at 0.6.14.

**What the change does**
- A "Due date" field sits next to the "What needs to be done?" input, in the same row. Its label is visible and screen readers announce it as "Due date".
- A todo added with a date shows a smaller grey line under its title, such as "Due Nov 3". Todos without a date show nothing extra.
- The date is saved with the todo, so it survives reloads, and the field clears after each add.
- The date shows as the same day in every time zone. The unit tests pass under UTC, Los Angeles and Kiritimati time.
- Files: `lib/todos.ts`, `components/TodoApp.tsx`, `components/TodoItem.tsx`, `app/layout.tsx`, plus a new `app/due-date.css`.

**Checks**
- `npm run lint`, `npm run typecheck` and `npm run build`: clean.
- `npm test`: 9 passed, including 2 new date-formatting tests.
- `npm run test:e2e`: 2 passed. The new test adds a dated and an undated todo, checks the field clears, reloads, and checks the date is still shown.
- I broke each new condition on purpose: dropping the date, not clearing the field, and getting the month wrong. Each break made at least one test fail, and I restored the code afterwards.

**Manual check in a real browser**
- The field's accessible name is "Due date" and there were no console errors.
- The browser tool's form-fill sets the date without the app noticing, so I relied on Playwright to prove that adding and saving work.
- Screenshots are in `home/data/due-dates-r3/` (inside the run directory, outside the worktree): `before.png`, `after.png`, and `after-320.png` for a narrow screen.

**My review**
- Correctness, readability, design, security and performance: no issues found. Older saved todos without a date still load fine.
- Tests weren't weakened, nothing was skipped or switched off, and nothing was left half-done. The change is 86 lines.
- No doubt-review cycles were run and no second-model review was done.
- The repo has no `CONSTRAINTS.md`, so I just kept the diff tidy.
- The README is still accurate.

**Things I noticed but didn't touch**
- Running `next dev` (Next.js 16) quietly creates an `AGENTS.md` in the repo when it detects an AI agent. The file even tells you to commit it. I deleted it rather than commit it, since my instructions forbid creating that file. Other lanes will hit the same thing; the fix is Next's `agentRules` config option or a `.gitignore` entry.
- The browser console warns that a form field has no id or name. The existing title input already triggered this warning before my change.
- `nextId` uses the list length plus one, so after a deletion a new todo can reuse an existing id.
- The empty `catch` in `loadTodos` and the `eslint-disable` comment in `TodoApp` were already there.
- On very narrow screens the title field gets cramped; the date field keeps a fixed width beside it.

**Follow-ups**
- Add a `CONSTRAINTS.md` quality file.
- There's no way to change or remove a todo's due date after adding it.
