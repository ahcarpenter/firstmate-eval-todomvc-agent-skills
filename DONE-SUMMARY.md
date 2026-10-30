I added a "Search" field above the list and committed it on branch `fm/search-r1` (commit `a0a85d8`). It's not pushed, the worktree is clean, and the branch is a fast-forward onto `main`. Lint, typecheck, 25 unit tests and all 10 end-to-end tests pass; the e2e run also builds the app, so the build passes too.

**What it does:** typing in the field shows only todos whose title contains the text, ignoring letter case, within the current filter and sort. Clearing it shows them all again. The "items left" counter still counts every active todo.

Two choices I made that the request didn't specify:
- Spaces before and after the search text are ignored, so a search of only spaces shows everything.
- The search empties when you switch filter or reload. Each filter is its own page, so the page restarts on a switch. Keeping the text across filters would need the search stored in the URL or a shared layout, which I left out to keep the change small.

**Change:** 6 files, 81 lines added and 3 removed:
- a `searchTodos` helper in `lib/todos.ts`, with unit tests;
- the field in `components/TodoApp.tsx`;
- styling in `app/due-date.css`;
- an end-to-end test covering mixed-case matching, the unchanged counter, the Active filter and clearing;
- a README note.

**Testing:**
- **Tests catch breakage:** I broke the helper twice on purpose (made matching case-sensitive, then stopped ignoring outer spaces). The unit tests failed each time, and I restored the file.
- **By hand:** I ran it in a real browser with four todos. Searching "dOg" showed "Walk the dog" and "Buy DOG food", and the counter stayed at "3 items left". The "mark all complete" arrow stays in place.
- **Screenshots** are saved outside the worktree in `home/data/search-r1/`: `before.png`, `after-empty.png` and `after-search.png`.
- **Review:** I went through correctness, readability, design, security and performance myself and found nothing to fix. No checks were silenced and no tests were weakened. I didn't run a separate review by another model or reviewer.

**Practices pack:** I followed `addyosmani/agent-skills` at version 0.6.14. The project has no `CONSTRAINTS.md`, so I applied the brief's clean-diff rules instead.

**Noticed but not touching:**
- `next dev` creates an untracked `AGENTS.md` whenever it runs, and the file's text asks to be committed. I deleted it rather than commit it. Setting `agentRules: false` in `next.config` would stop it.
- `nextId` uses the number of todos plus one, so deleting a todo and then adding one can produce a duplicate ID.

**Follow-ups:**
- Add a `CONSTRAINTS.md` to write down the project's quality bar.
- Decide whether the search should carry across filters. That would mean storing it in the URL or a shared layout.

No code was left unused.
