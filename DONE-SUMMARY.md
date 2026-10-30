Toggling, editing and deleting todos now all work from the keyboard, and every control announces a name. It's committed as `06af18b` on `fm/a11y-keyboard-r3`, one commit on top of `main` (a clean fast-forward). Nothing was pushed, and I reported `done` in the status file.

**What changed**
- **Names:**
  - The new-todo field is announced as "New todo".
  - Each todo's checkbox is announced as the todo's text, e.g. "Buy milk".
  - Each row now has an "Edit Buy milk" button and a "Delete Buy milk" button.
  - The edit field is announced as "Edit Buy milk".
- **Editing:** each row has a new ✎ edit button, so a double-click is no longer the only way in. Enter saves, Escape cancels, and both put focus back on the edit button. Getting this right needed `preventDefault` on Enter. Without it, the Enter that closed the field also pressed the edit button and reopened the field.
- **Deleting:** the edit and delete buttons stay in the Tab order and show when the row is hovered or has focus. Before, the CSS hid the delete button until hover, so Tab skipped it. After a delete, focus moves to the new-todo field so it isn't lost.
- **Footer hint:** changed to "Double-click a todo, or use its edit button, to edit it".
- **Files:** `components/TodoItem.tsx`, `components/TodoApp.tsx`, and a new `app/globals.css` loaded in `app/layout.tsx`.

**Checks**
- `npm run lint`, `npm run typecheck`, `npm test` (7 unit tests) and `npm run build` all pass.
- Playwright: 7 of 7 pass. Before the fix, all 6 new keyboard tests failed; only the existing smoke test passed.
- Mutation check: putting `display: none` back makes the delete and Tab-order tests fail. Removing the Enter `preventDefault` makes the edit test fail.
- In a real browser (chrome-devtools-axi), the accessibility trees confirm it:
  - Before: unnamed checkboxes, and Tab jumped from one checkbox straight to the next.
  - After: every control is named, and Tab reaches checkbox → Edit → Delete in each row.
- Screenshots, accessibility trees and test logs are in `home/data/a11y-keyboard-r3/` (`before-tabbed.png`, `after-tabbed.png`). In the after screenshot, the focused row shows the ✎ and × buttons with a visible focus ring.

**Review**
- I went through correctness, readability, architecture, security and performance; nothing else came up.
- No tests were weakened and no lint or type checks were switched off. The only existing suppression comment is unchanged.
- No doubt cycles were run, and I skipped a review by a second model.
- The diff is 154 lines added and 7 removed, inside the ~300-line limit for one change.
- The repo has no `CONSTRAINTS.md`, so I applied the brief's diff-hygiene rules instead.
- Best-practices pack: addyosmani/agent-skills, tag 0.6.14.

**Follow-ups (seen but not changed)**
- Add a `CONSTRAINTS.md`.
- The "Mark all as complete" checkbox is announced as "❯ Mark all as complete". The arrow comes from the stylesheet's `::before` content, and this predates my change.
- `README.md`'s Layout section doesn't mention `app/globals.css`. Nothing in it is wrong, so I left it alone.
- Clicking outside an edit field saves the edit, but focus isn't restored afterwards. That's on purpose: focus stays where you clicked.
