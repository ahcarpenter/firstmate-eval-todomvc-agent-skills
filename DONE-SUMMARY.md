The search field is in: one commit, `2b835ea feat: search todos by title`, on branch `fm/search-r3`. The branch fast-forwards onto `main`, nothing was pushed, and I've marked it done in the status file.

**What changed**
- **Search logic:** a new `searchTodos` function in `lib/todos.ts` keeps the todos whose title contains the typed text, ignoring letter case. An empty search shows everything.
- **The field:** `components/TodoApp.tsx` has a "Search" field above the list. It applies the search to whatever the current filter shows, then the date sort if that's on. The item counter still counts every active todo.
- **Styling:** a new `app/search.css`, loaded from `app/layout.tsx`, matching the look of the due date inputs.
- **README:** the layout description now mentions title search.

**Checks**
- **Unit tests:** `npm test` passes (26 tests). I added three for `searchTodos`.
- **End-to-end tests:** `npm run test:e2e` passes (11 tests), including a new `e2e/search.spec.ts`. It covers a mixed-case search, searching within the Active filter, clearing the search, and the counter staying the same. This run also builds the app, and the build passed. After it I only changed one README line, then re-ran the unit tests, lint and typecheck.
- **Lint and types:** `npm run lint` and `npm run typecheck` pass.
- **Breaking it on purpose:** I removed the lowercasing from the search text, then from the titles, one at a time. The second change first left the unit tests passing, so I added a case with an uppercase title and a lowercase search; both changes now fail.
- **In a real browser:** I checked it with `chrome-devtools-axi` against the dev server. Typing "bUY" shows "Buy milk" and "Buy bread", and the counter still says "3 items left". Before and after screenshots are in `home/data/search-r3/` (`before.png`, `after-empty.png`, `after-search.png`).
- **Review:** I went through correctness, readability, architecture, security and performance and found nothing to fix. No tests were skipped or loosened and no check was switched off. I ran no doubt cycles and no review by another model.

**Other notes**
- The best-practices pack is `addyosmani/agent-skills`, tag 0.6.14.
- The repo has no `CONSTRAINTS.md`, so I applied the brief's general rules for a clean diff instead.
- Running the dev server made Next.js generate an `AGENTS.md` in the worktree. I deleted it, and the worktree is clean.

**Follow-ups**
- Add a `CONSTRAINTS.md`.
- Things I noticed but left alone:
  - Running `next dev` writes an `AGENTS.md` unless `agentRules: false` is set in `next.config.ts`.
  - `nextId` uses the list length plus one, so deleting a todo and adding another can reuse an existing id.
- The search text isn't saved, so a reload clears it. Whether it should be saved is a product decision.
- The change left no unused code.
