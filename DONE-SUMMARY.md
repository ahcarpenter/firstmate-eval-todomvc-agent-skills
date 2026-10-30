The undo feature is committed on `fm/undo-delete-r1` (head `76d44e0`, two commits ahead of `main`, fast-forwardable) and I've reported done. It is not pushed or merged, and the worktree is clean. Lint, typecheck, 13 unit tests, 6 end-to-end tests and the production build all pass.

**What changed:**
- **Undo after delete:** deleting a todo shows a bar at the bottom of the page reading `Deleted "…"  Undo` for 5 seconds. Undo puts the todo back where it was, and the restored list survives a page reload.
  - The countdown pauses while the bar is hovered or has keyboard focus.
  - Screen readers announce the bar when it appears.
  - It still appears after deleting the last todo, when the list and its footer are gone.
  - Clearing a todo's title while editing deletes it, so that also gets undo.
- **Separate fix commit:** new todo IDs were based on the list length, so a deleted todo's ID could be reused while it was still restorable. IDs are now the highest existing ID plus one. If a newer todo has taken the old ID before you undo, the restored todo gets a fresh one.
- **Hover bug found and fixed:** when the pointer moved from a todo's hover-only delete button onto the bar, React's `onMouseEnter` didn't fire, so the countdown kept running. I switched to `onMouseOver`, which a real user would also have needed.
- **README:** the Layout section now lists the new component.

**How it was checked:**
- **Tests:** unit tests for removing and restoring todos, and four new end-to-end tests: undo restores in place and persists, undo after deleting the last todo, the bar disappears after 5 seconds, and it waits while hovered or focused.
- **Mutation checks:** I removed the pause check (both pause tests failed) and the ID-collision guard (its unit test failed), then restored each.
- **By hand:** before/after screenshots at 800px, plus a long title on a narrow screen, where the title is cut off but Undo stays visible. They're in `home/data/undo-delete-r1/`.
- **Review:** I reviewed the change myself against the code-review skill's five axes; no doubt cycles were run and cross-model review was skipped.

**Practices:** the pack is addyosmani/agent-skills at tag `0.6.14`. The project has no `CONSTRAINTS.md`, so I applied the diff-hygiene rules: no new suppressions, no skipped tests, no stubs. The change is about 300 lines including tests. Commits follow the repo's `feat:`/`fix:` style.

**Noticed but not touching:**
- **"Clear completed" has no undo:** it deletes several todos at once with no way back.
- **Second delete can't be undone:** deleting another todo while the bar is up makes the first deletion permanent. Only the latest one can be undone.
- **Console warning:** the "What needs to be done?" field has no `id` or `name`, which the browser flags.

**Follow-ups:**
- Add a `CONSTRAINTS.md` to write down the project's quality bar.
- Decide whether "Clear completed" should get undo too.
- The change leaves no unused code behind.
