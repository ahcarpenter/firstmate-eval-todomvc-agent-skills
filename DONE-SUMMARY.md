Toggling, editing and deleting todos now all work from the keyboard, and every control has a name a screen reader announces. The change is committed as `93b17b3` on `fm/a11y-keyboard-r2`. It's a clean fast-forward from `main`, nothing was pushed, and the worktree is clean.

**What changed**
- **Names:** each todo's checkbox is announced as "Toggle Buy milk", its delete button as "Delete Buy milk", and the edit field as "Edit Buy milk". The new-todo field is named "New todo", and the current filter link is marked as the current page (`aria-current="page"`).
- **Editing:** each todo has a new Edit button (✎) next to Delete, so editing no longer needs a double-click; double-click still works. Enter saves, Escape cancels, and both put focus back on the Edit button. After a delete, focus moves to the new-todo field.
- **Hidden buttons:** the stock TodoMVC CSS hid Edit and Delete with `display: none` until hover, which also removed them from the screen reader's view. They're now hidden only visually, and appear when the row is hovered or holds keyboard focus (new `app/globals.css`).
- **Bug fixed along the way:** pressing Enter to save reopened the editor, because Chrome passed the same keypress to the Edit button once focus moved there. The new tests caught it.

**Checks**
- **Repository checks:** lint and typecheck are clean, 7/7 unit tests pass, and 7/7 Playwright tests pass, including a production build.
- **New tests:** I wrote 6 keyboard tests in `e2e/a11y.spec.ts` first; all failed on the old code, and all pass now.
- **Mutation check:** removing the delete focus handoff makes the delete test fail, and removing the Enter fix makes the edit test fail.
- **By hand in the browser:** Tab now goes checkbox → Edit → Delete, with all three named. On the old code the checkboxes had no name and Tab skipped Delete entirely.
- **Screenshots:** `before-three-tabs.png` and `after-edit-button-focused.png`, in `home/data/a11y-keyboard-r2/`.
- **Visibility gap:** the tests can't confirm that the buttons visually appear on focus, because Playwright treats clipped elements as visible. The screenshot is the evidence for that.

**Process**
- **Best-practices pack:** `addyosmani/agent-skills` 0.6.14. I followed `frontend-ui-engineering`.
- **Constraints file:** the repo has no `CONSTRAINTS.md`, so I applied the brief's diff-hygiene rules instead: no new suppressions, stubs or skipped tests.
- **Review:** I reviewed the change against the five-axis checklist myself; no doubt cycles or cross-model review were run.
- **Docs:** the README and the footer hint ("Double-click or press the edit button…") now mention the new behaviour.
- **Size:** about 120 lines of code plus about 70 lines of tests.

**Noticed but not changed**
- `nextId` uses `todos.length + 1`, so deleting a todo and adding another can create duplicate ids.
- `loadTodos` doesn't check the shape of what it reads from `localStorage`.
- The browser console reports a 404 (probably a missing favicon) and a form field with no `id`/`name`.
- When an edit field loses focus, it can save twice. This was already the case and is harmless.

**Follow-ups**
- Add a `CONSTRAINTS.md`.
- Add an automated accessibility scan (axe-core) to the Playwright tests.
