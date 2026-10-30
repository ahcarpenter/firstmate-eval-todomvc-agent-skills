You can now rename and delete lists. The change is committed as `7292679` on `fm/multiple-lists-followup-r3`, which fast-forwards from `main`. Lint, typecheck, the unit tests (18) and the end-to-end tests (10) all pass, and I've reported `done` to firstmate.

- **Buttons:** each list in the nav now has buttons named "Rename Work" and "Delete Work" (for a list called Work). On screen they just say "Rename" and "Delete".
- **Rename:** clicking Rename swaps the list's link for a field holding its name, already focused. Enter saves the new name and Escape cancels. Two cases the spec didn't cover: an empty name keeps the old one, and clicking away from the field also cancels.
- **Delete:** the browser's confirm dialog asks first. Confirming removes the list and its todos, and if it was the open list the app goes to the first remaining list. Deleting a list you're not viewing leaves you where you are.
- **Last list:** its Delete button is disabled, and the delete function refuses as well. That matters because with no lists saved, the app would reload the todos saved before lists existed.
- **Reloads:** renames and deletions are saved like other list changes and survive a reload.

The code is mainly in `components/ListNav.tsx` and `components/TodoApp.tsx`, with two helpers (`renameList` and `deleteList`) in `lib/todos.ts`. I also updated the README line describing the nav.

Two problems from the earlier lists change, not fixed here:
- **Todo in the wrong list:** creating a list and typing a todo before its page has loaded puts the todo in the previous list. One of my tests hit this, so it now waits for the new list's page first.
- **List numbers reused:** new lists get the highest existing number plus one. Delete the newest list and the next one you create takes its number, so an old link to the deleted list opens the new one.
