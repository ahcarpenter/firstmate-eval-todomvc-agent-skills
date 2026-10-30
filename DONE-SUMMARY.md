The footer now has a "Sort by date" checkbox. It's committed on `fm/sort-by-due-r3` as `4950dc1` and all the repo's checks pass.

**How it works**
- **Order:** checked, todos show earliest due date first, undated todos last, and ties keep their usual order. Unchecked shows the usual order.
- **Filters:** the sort applies within All, Active, Completed and Overdue.
- **Reloads:** the choice is saved in localStorage under its own key, `todos-nextjs-sort-by-due`.
- **Placement:** the checkbox sits at the right of the footer, under Clear completed. The README now mentions the new key.

**Bug found while testing:** the e2e test first failed because the checkbox couldn't be clicked. The `todomvc-app-css` stylesheet puts an invisible layer over the bottom of the footer that blocks clicks. I fixed it by giving the label `position: relative`.

**Checks run**
- `npm run lint`, `npm run typecheck` and `npm run build` pass.
- `npm test`: 19 unit tests pass, 2 of them new.
- `npm run test:e2e`: 9 tests pass. The new one covers sort order, persistence across reloads, the Active and Completed filters, and unchecking.
- **By hand in the browser:** checking the box sorts the list and saves the choice. The only console message is a minor pre-existing note that some form fields lack an id or name.
- **Screenshots:** in `home/data/sort-by-due-r3/`: `before.png` (built from `main`), `after-unchecked.png` and `after-checked.png`.

**My review**
- I broke the "undated last" rule on purpose and the tests caught it.
- I also broke the tie rule, and the tests stayed green. With Chrome's sort engine that broken version still returns ties in their original order, so no test can tell them apart. The tie test still pins the required order.
- The diff adds no suppression comments and leaves no stubs; no tests were skipped or weakened.
- No doubt cycles were run and cross-model review was skipped.
- I used plain `[...todos].sort` rather than `toSorted`, which is newer than the project's ES2022 target.

**Pack and constraints:** addyosmani/agent-skills, version 0.6.14. The repo has no `CONSTRAINTS.md`, so I applied the brief's diff-hygiene rules instead.

**Noticed but not touched**
- `nextId` uses the list length plus one, so after a delete a new todo can get an id another todo already has.
- The "Due date" and "Change date" inputs have no `id` or `name`, which the browser flags.
- The overdue count also sits under the invisible footer layer. It's harmless today because nothing there is clickable.

**Follow-ups**
- Add a `CONSTRAINTS.md`.
- Fix the duplicate-id bug in `nextId`.
- The change leaves no unused code behind.
