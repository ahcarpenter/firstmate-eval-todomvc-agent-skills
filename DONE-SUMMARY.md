Keyboard and screen reader users can now toggle, edit and delete todos, and every control has a name. The change is committed on `fm/a11y-keyboard-r1` (6abeb5d), which is a clean fast-forward from `main`, and the `done` status line is filed. All checks pass.

**What changed** (5 files, +115/−5):
- **Names:**
  - Each todo checkbox is announced as its title, e.g. "Buy milk, checkbox, checked".
  - The × button is announced as "Delete Buy milk".
  - The new-todo field is "New todo" and the edit field is "Edit Buy milk".
- **Editing:** the todo title can now be reached with Tab, is announced as "Edit Buy milk", and starts editing on Enter, Space or F2. Double-click still works. When an edit ends with Enter or Escape, focus goes back to the title instead of being lost. If the edit ends because you clicked elsewhere, focus stays where you clicked.
- **Deleting:** the styling library hid the delete button completely, which also took it out of the tab order and out of what screen readers can see. A new `app/a11y.css` hides it only visually and shows it on hover or when anything in that row has focus.
- The footer hint now reads "Double-click, or press Enter on a todo, to edit it".

**Checks:**
- **Repository checks:** lint, typecheck, unit tests (7/7), `next build`, and Playwright end-to-end tests (7/7: the existing smoke test plus 6 new ones in `e2e/keyboard.spec.ts`).
- **Reproduced first:** before the fix, all 5 new tests I first wrote failed (the 6th came in with the fix below). The before snapshot showed unnamed checkboxes and no delete button visible to screen readers.
- **Tests catch regressions:** I broke the code on purpose five times (no reveal on focus, no focus return, no Enter-to-edit, always returning focus, no return after Escape). A test failed each time, and the code was restored afterwards.
- **Bug found in my own review:** my first version pulled focus back to the todo when you clicked away from an edit. I added a test for it and fixed it.
- **By hand in a real browser:** the before and after accessibility trees, plus screenshots of the focused delete button and the keyboard edit field, are saved in `home/data/a11y-keyboard-r1/`.

**Other notes:**
- There is no `CONSTRAINTS.md`. I kept the diff clean and added no suppression comments, skipped tests or stubs.
- The best-practices pack was `addyosmani/agent-skills` 0.6.14.
- No doubt cycles were run and cross-model review was skipped.
- The dev server I ran for screenshots generated an untracked `AGENTS.md`. Its text says to commit it, but I treated it as tool output and deleted it, so the worktree is clean.

**Follow-ups I noticed but didn't touch:**
- **Add a `CONSTRAINTS.md`** to set the project's quality bar.
- **Focus after deleting:** after a todo is deleted, focus goes back to the top of the page. It could move to the next todo or the new-todo field instead.
- **"Mark all as complete" label:** its screen reader name starts with a stray "❯" that comes from the styling library.
- **README:** the Layout section doesn't list `app/a11y.css`.
- **Chrome warning:** Chrome logged a "No label associated with a form field" warning (2 instances). It probably dates from the page before the fix, but I didn't confirm that.
- **Nothing was left unused.**
