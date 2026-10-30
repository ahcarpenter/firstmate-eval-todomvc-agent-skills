Todos due today now say **"Due today"** and todos due tomorrow say **"Due tomorrow"**, based on the person's own local date. All other dates still read "Due Nov 3". It's committed as `0600f61` on `fm/due-soon-r3`, a clean fast-forward from `main`, nothing pushed. I've reported `done` to firstmate.

**What changed**
- `formatDue(due, today)` in `lib/todos.ts` now takes today's date. "Tomorrow" is worked out from that, so it handles the end of a month and of a year correctly.
- `TodoApp` passes the `today` value it already computes down to `TodoItem`.
- The diff is 5 files, +55/−8.

**Checks**
- **Unit tests:** 23 pass. I wrote 4 new cases first and confirmed 3 of them failed before the code change. They cover today, tomorrow, yesterday, and month/year rollover.
- **Lint and typecheck:** both clean.
- **End-to-end tests:** all 10 pass, including the production build. I added one test with the clock fixed to Nov 30, which checks the list reads "Due today | Due tomorrow | Due Dec 2". I also fixed the clock in the existing `due-date.spec.ts`. Without that, its hard-coded Nov 3 date would read "Due tomorrow" on Nov 2 and "Due today" on Nov 3, and the test would fail.
- **Mutation check:** I broke each new condition in turn (made "tomorrow" mean two days out, then disabled "today"). The tests failed both times, and I restored the file.
- **By hand:** in the running app on the branch I saved todos due today, tomorrow, and Nov 3, and the page showed "Due today / Due tomorrow / Due Nov 3". The screenshot is at `home/data/due-soon-r3/after.png`.
- **No before screenshot:** the dev server for the `main` copy failed with a missing build-manifest error, so I deleted the blank capture. The old code would have shown "Due Oct 30 / Due Oct 31 / Due Nov 3".
- **Review:** I went over correctness, readability, architecture, security, and performance. "Overdue" and "Due today" can't both appear, because overdue means due before today. No tests were weakened, no checks silenced, no stubs left. I didn't run separate doubt cycles or a cross-model review.

**Housekeeping**
- **Isolation check:** this directory is the repo's only checkout rather than a linked worktree. It is the one I was launched in, at a detached HEAD as the brief described, so I went ahead.
- **Stray file removed:** `next dev` wrote an untracked `AGENTS.md` into the worktree. I confirmed git didn't know about it and deleted it, so the tree is clean.
- **Best practices:** I followed the `addyosmani/agent-skills` pack, version 0.6.14.
- **No constraints file:** there's no `CONSTRAINTS.md`, so I applied the brief's diff-hygiene rules instead.

**Follow-ups (noticed, not changed)**
- Add a `CONSTRAINTS.md`.
- Running `next dev` in this Next version writes an untracked `AGENTS.md`. Either set `agentRules: false` in `next.config.ts` or add it to `.gitignore`.
- The `react-hooks/set-state-in-effect` eslint-disable in `TodoApp.tsx` predates this change.
- If the app stays open past midnight, the labels don't update until something re-renders it.
