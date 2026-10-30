Each todo now has a Duplicate button next to its delete button. It's committed as `f65fa2d` on `fm/fix-duplicate-ids-followup-r1`, a clean fast-forward from `main`, and I've reported `done` to firstmate. Lint, typecheck, the 12 unit tests and the 4 end-to-end tests all pass.

- **What it does:** clicking Duplicate puts a copy right below the todo, with the same title and not completed.
- **Separate todo:** the copy gets its own id, built on the duplicate-id fix in `799c308`. Toggling or deleting the copy doesn't touch the original, and the other way round.
- **Kept across reloads:** the copy is saved to localStorage like any other todo.
- **Display:** the button shows on hover, like the delete button, and is hidden while you're editing that todo. The "Duplicate" label comes from CSS, so it isn't part of the todo's text and existing tests that check todo text still pass; screen readers still announce the button as "Duplicate".
- **Layout:** I widened the right padding on todo titles so long titles don't run under the two buttons. A screenshot showing this is at `home/data/fix-duplicate-ids-followup-r1/duplicate.png`.

The new logic is a `duplicateTodo` function in `lib/todos.ts`, used by `components/TodoApp.tsx` and `components/TodoItem.tsx`; the styles are in a new `app/todos.css`. I added unit tests for it and an end-to-end test covering duplicate, delete-the-copy and reload, and added the new CSS file to the README's file list. Nothing was pushed, and the steering inbox was empty.
