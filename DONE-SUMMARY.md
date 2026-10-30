Multiple named lists are working and committed on `fm/multiple-lists-r1` as `11e3f03`, a fast-forward of `main`. I added the `done:` line to the status file. Nothing was pushed and no PR was opened.

**What changed**
- **Lists:** typing a name into the field labelled "New list name" and pressing Enter creates a list and switches to it. Every list appears as a link below the todo card, with the current one highlighted. Each list has its own todos, and the filters and counters work within the current list.
- **URLs:** lists live at `/lists/<id>`, `/lists/<id>/active` and `/lists/<id>/completed`. `/` opens the first list and changes the address to its URL; `/active` and `/completed` still work and do the same for those filters. A link to a list that doesn't exist shows "This list does not exist."
- **Existing todos:** anyone who already has todos sees them as a list called "Todos". They are copied to a new storage key (`todos-nextjs-lists`), and the old `todos-nextjs` key is read but never changed or deleted. Reverting the commit therefore gets the original todos back, without any changes made after the upgrade.
- **Docs:** I updated the README's layout and storage notes.

**Checks:** lint, typecheck and build pass; unit tests 16/16 (9 new), end-to-end tests 4/4 (3 new). In a real browser (chrome-devtools-axi), old-style todos showed up as "Todos" at `/lists/1`, and creating "Work" went to `/lists/2` with its own todos. When I deliberately broke one condition in the storage code, the unit tests still passed, so I added the missing test for an empty saved list; it now fails as it should. The project has no `CONSTRAINTS.md`, so I followed the brief's diff-hygiene rules instead. No doubt cycles were run and no second-model review was done. The best-practices pack was addyosmani/agent-skills 0.6.14.

Before and after screenshots and the full summary, including rollout and rollback notes, are in `home/data/multiple-lists-r1/`.

**Follow-ups I noticed but didn't touch:**
- **Todo ids:** new todo ids are the list length plus one, so adding a todo after deleting one can reuse an id that's still in use.
- **Unlabelled inputs:** Chrome DevTools flags existing form fields, including the "What needs to be done?" input, for having no label and no id/name.
- **List management:** lists can't be renamed or deleted.
- **Constraints:** the project could use a `CONSTRAINTS.md`.
