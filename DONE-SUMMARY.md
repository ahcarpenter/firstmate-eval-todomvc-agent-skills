Multiple named lists are working and committed as `2795aee` on `fm/multiple-lists-r2`, which fast-forwards from `main`. Lint, typecheck, unit tests (15) and Playwright (4) all pass, and I checked the flow by hand in a real browser. Nothing was pushed and no PR was opened. Firstmate inbox was empty.

**What it does**
- **Creating a list:** typing a name into the "New list name" field and pressing Enter creates the list and switches to it.
- **Switching lists:** every list appears as a link in a bar at the top of the app; the current one is highlighted and marked as the current page for screen readers.
- **Separate todos:** each list keeps its own todos, and the filters and "items left" count work within the current list.
- **URLs:** `/lists/<id>`, `/lists/<id>/active` and `/lists/<id>/completed` work. `/` opens the first list. The old `/active` and `/completed` still work and show the first list.
- **List ids** come from the name: "Work" becomes `work`. A repeated name gets `work-2`, and a name with no usable characters gets `list`.
- **Existing todos** become a list called "Todos". The old saved data is left untouched, so going back to the previous version is safe.
- **Unknown list URLs** show "This list does not exist. Pick a list or create one."

**One problem found and fixed:** I first put the list bar between the new-todo field and the todos. TodoMVC's "Mark all as complete" toggle sits on top of whatever comes there, so it covered the first list link and clicking it did nothing. An end-to-end test caught it, and I moved the bar above the new-todo field.

**Checks and review**
- **Unit tests** cover moving old todos into "Todos", making ids, and creating lists.
- **End-to-end tests** cover the migration, creating and switching lists, todos staying separate, filter URLs, and an unknown list.
- **Mutation check:** removing the empty-storage fallback made 2 tests fail. I also added a test for empty saved lists.
- **Browser check:** before and after screenshots at desktop width and a narrow mobile width. No new console errors.
- **Own review:** went through correctness, readability, structure, security and performance, and checked the diff for weakened tests or new suppression comments. None were added.
- **Not done:** no doubt cycles and no cross-model review.
- **Size:** 9 files, +325/−15, slightly over the ~300-line guideline but one logical change.
- **Constraints file:** the repo has no `CONSTRAINTS.md`, so I applied the brief's diff-hygiene rules.
- **Docs:** README updated.
- **Best-practices pack:** `addyosmani/agent-skills` 0.6.14.

Screenshots are in `home/data/multiple-lists-r2/`: `before.png`, `after-migrated.png`, `after-new-list.png` and `after-320.png`.

**Follow-ups (noticed but not touched)**
- `loadTodos` and `saveTodos` in `lib/todos.ts` are no longer used.
- `nextId` uses the list length plus 1, so deleting a todo and adding another can produce a duplicate id. This existed before the change and now applies within each list.
- Lists can't be renamed or deleted.
- The new-todo field has no id or name, which the browser flags as a minor issue. This existed before.
- Add a `CONSTRAINTS.md`.
