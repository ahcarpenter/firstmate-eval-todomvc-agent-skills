Overdue todos now work: each one shows an "Overdue" badge, there's a new **Overdue** filter at `/overdue` next to All, Active and Completed, and the footer shows "2 overdue" under the items-left count. It's committed as `10fb4f3` on `fm/overdue-r2`, which fast-forwards cleanly onto `main`. The worktree is clean, and I've written `done: ready in branch fm/overdue-r2` to the status file. Nothing is pushed and no PR is open.

**How it behaves**
- A todo is overdue when it isn't completed and its due date is before today in the browser's time zone. A todo due today is not overdue.
- The footer count appears only when at least one todo is overdue. That's my choice, since the request didn't say whether to show "0 overdue"; it matches how "Clear completed" only appears when there's something to clear.
- The stock TodoMVC footer has a fixed height, which cut off the new line. I let it grow to fit; with nothing overdue its height is unchanged (41px in the browser before and after).

**Checks run**
- `npm run lint` and `npm run typecheck` are clean.
- Unit tests: 16 pass, 8 of them new or updated. They cover overdue status, today's date in local time, and the new filter.
- End-to-end tests: 3 pass, including the build. The new `e2e/overdue.spec.ts` fixes the clock and covers the badges, the footer count changing when a todo is completed, the `/overdue` link and route, and a reload.
- I broke the overdue rule three ways on purpose: counting a todo due today, ignoring completion, and skipping date validation. The tests failed each time, and I restored the file.
- I checked the page by hand with `chrome-devtools-axi` on the old and new builds. The first new screenshot showed the clipped footer, which I then fixed.
- My own review covered correctness, readability, design, security and performance. I made one cleanup pass, removing an unused `overdue` CSS class, and re-ran everything. I didn't run a doubt cycle or a review by another model.

**Screenshots** are in `home/data/overdue-r2/`: `before-all.png`, `after-all.png` and `after-overdue.png`.

**Notes**
- The best-practices pack is addyosmani/agent-skills, version 0.6.14.
- There's no `CONSTRAINTS.md`, so I applied the brief's diff-hygiene rules: no new suppressions, stubs or skipped tests. Adding a constraints file is a follow-up.
- The change is about 140 lines across 8 files, including the README update.
- The steering inbox had no messages.

**Follow-ups I noticed but didn't touch**
1. `nextId` returns the list length plus 1, so deleting a todo and adding another can produce a duplicate ID.
2. "Today" is worked out when the page renders, so a tab left open past midnight won't mark new overdue todos until something re-renders.
3. The badge's red, `#b83f45`, works out to about 5.6:1 contrast on white, but nobody has checked it properly.
4. Add a `CONSTRAINTS.md`.
5. The "before" build in `home/data/overdue-r2/before/` contains a copy of `node_modules` and can be deleted.
