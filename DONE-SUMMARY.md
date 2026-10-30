Multiple named lists are done and committed as `a476555` on `fm/multiple-lists-r3`, and I've marked it done in the status file. The branch fast-forwards cleanly onto `main`, nothing was pushed, and the worktree is clean. Lint, typecheck, 15 unit tests, all 6 end-to-end tests and the production build all pass.

**What it does**
- **Creating lists:** a "New list name" field sits below the todo box. Pressing Enter creates the list, switches to it at `/lists/<id>`, and clears the field.
- **Switching lists:** every list appears as a link, and the current one is highlighted.
- **Per-list todos:** each list has its own todos. The Active/Completed filters, the "items left" counter and "Clear completed" apply only to the current list.
- **URLs:** `/lists/<id>`, `/lists/<id>/active` and `/lists/<id>/completed`. `/` opens the first list. The old `/active` and `/completed` URLs still work and show the first list.
- **Existing todos:** if no lists have been saved yet, todos stored under the old `todos-nextjs` key load as a list called "Todos". The old key is read but never changed or deleted.
- **New users** start with one empty "Todos" list, so `/` always has something to show.
- **Unknown list:** an id that doesn't exist, like `/lists/42`, shows "This list does not exist."

**Checks and review**
- **New tests:** 7 unit tests cover list ids, list URLs, and loading the old todos, including when the saved lists are unreadable. `e2e/lists.spec.ts` covers creating, switching, keeping todos separate, the filter URLs, an unknown list, and moving the old todos into "Todos".
- **Testing the tests:** I deliberately broke the code twice to make sure the tests notice. When every list's todos were overwritten together, 2 end-to-end tests failed. When every new list got the same id, a unit test failed. I restored both changes.
- **Hand check in a real browser:** with old-style todos stored, both appeared in the "Todos" list with "1 item left". Creating "Groceries" went to `/lists/2` and highlighted it.
- **Screenshots:** before, after, and after creating a list, saved in `home/data/multiple-lists-r3/`.
- **Constraints:** the repo has no `CONSTRAINTS.md`, so I applied the diff-hygiene rules instead. No new suppressions, skipped tests, stubs or empty catch blocks.
- **Size:** the change is 363 lines added, about 140 of them tests. That's a bit over the ~300-line guide, but it's one logical change.
- **Review:** I reviewed it against the five axes myself and made a formatting pass with the repo's 120-column width. I ran no doubt cycles, and cross-model review was skipped.
- **Best-practices pack:** addyosmani/agent-skills, tag 0.6.14.

**Rollback:** reverting the commit restores the old app, which reads the untouched `todos-nextjs` key. Todos added or changed after the switch would be lost from the old view. The new `todos-nextjs-lists` key would simply be ignored.

**Noticed but not touched**
- `nextId` uses `todos.length + 1`. After deleting a todo, a new one can get the same id as an existing one, which could make toggling or editing hit the wrong todo.
- The old `/active` and `/completed` routes still exist. They could redirect to their `/lists/<id>` versions instead.
- There's no way to rename or delete a list. The spec didn't ask for it.

**Follow-ups:** add a `CONSTRAINTS.md`; fix `nextId`. The change left no unused code behind.
