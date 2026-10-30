You can now rename and delete lists. The change is committed as `2f8f8ce` on branch `fm/multiple-lists-followup-r2`, sitting directly on top of `main` so it merges cleanly. Lint, typecheck, the 18 unit tests and all 7 end-to-end tests pass. The status file now says done, and the steering inbox had no messages.

**What it does:**
- Each list's link has a "Rename" and a "Delete" button beside it. Screen readers announce them with the list's name, e.g. "Rename Work" and "Delete Work".
- **Rename:** the link turns into a text field holding the list's name, already focused. Enter saves the new name and Escape cancels.
- **Delete:** the browser asks for confirmation, then the list and its todos are removed. If it was the open list, the app switches to the first remaining list.
- When only one list is left, its Delete button is greyed out and can't be clicked.
- Renames and deletions are saved and survive a reload.

**Choices I made that the request didn't cover:**
- Renaming keeps the list's web address, so after renaming "Work" to "Job" it stays at `/lists/work`. Existing links and bookmarks keep working.
- Clicking away from the rename field also saves, the same way editing a todo works. Saving an empty name keeps the old one.
- Hovering over the disabled Delete button shows "The last list cannot be deleted".

I also updated two lines in `README.md` that describe these files. The new tests are in `e2e/lists.spec.ts` and `lib/lists.test.ts`.
