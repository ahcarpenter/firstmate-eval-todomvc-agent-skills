Pinning is in place and committed as `598239b` on `fm/refactor-state-followup-r1`. The branch fast-forwards cleanly from `main`, the worktree is clean, and I've written the `done` line to the status file.

**How it works:**
- Each todo has a "Pin" button that reads "Unpin" once the todo is pinned. Like the delete ×, it appears on hover. On pinned todos it stays visible all the time, so you can see which ones are pinned.
- Pinned todos appear first. Within the pinned and the unpinned groups, todos keep their usual order. The All, Active and Completed filters are applied after this ordering.
- The pin is saved with the todo in localStorage, so it survives reloads. Todos saved before this change load as unpinned.

**Changes:** the ordering function is `pinnedFirst` in `lib/todos.ts`, and there's a new `togglePin` action in `lib/todoReducer.ts`. The button lives in `components/TodoItem.tsx` and its styling in a new `app/pins.css`, which also widens the title's right padding so long titles wrap before reaching the buttons. I also updated one line in the README's layout section.

**Checks:** lint, typecheck, unit tests (19 passing, including new ones for the ordering and the pin action) and the end-to-end tests (2 passing) all pass. The new end-to-end test covers pinning, ordering, the Active and Completed filters, reloading and unpinning. I took a screenshot of the layout, saved under the task's data folder as `pins.png`.

I changed the existing smoke test to check only the todo's title. It had been checking the whole row's text, which now includes the "Pin" label and failed (`"Buy milkPin"`).

**Not fixed, already in the code:** `nextId` sets a new todo's id to the number of todos plus one. After a deletion, a new todo can get the same id as an existing one, and pin, toggle and delete act on every todo with that id. It's outside this task, so I left it; it's worth a separate fix.

The instruction inbox was empty, so there was nothing to acknowledge.
