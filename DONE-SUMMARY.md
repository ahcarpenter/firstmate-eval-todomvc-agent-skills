Pinning is done and committed as `58c5b79` on `fm/refactor-state-followup-r3`. The branch is a clean fast-forward of `main`, nothing was pushed, and I've written the `done` line to the status file.

**What it does**
- Each todo has a "Pin" button, which reads "Unpin" on a pinned todo.
- Pinned todos show above the others. Within each group, todos keep the order they were added in.
- Unpinning puts a todo back in its usual place.
- Pins are saved in localStorage, so they survive a reload. Todos saved before this change load as unpinned.
- The All, Active and Completed filters still apply, with pinned todos first in each view.

**Checks:** lint, typecheck and the 20 unit tests pass. Both end-to-end tests pass: the existing smoke test and a new one that pins todos, switches filters, reloads and unpins. I also took a screenshot to check that long titles wrap before they reach the buttons.

**Code changes:**
- `lib/todos.ts`: an optional `pinned` flag and a `pinnedFirst` function that puts pinned todos first.
- `lib/todoReducer.ts`: a `togglePin` action.
- `components/TodoItem.tsx` and `components/TodoApp.tsx`: the button, and the sort applied after filtering.
- `app/pin.css`: button styles.

**One change to an existing test:** the smoke test in `e2e/smoke.spec.ts` read the whole list item's text, which now includes "Pin". It now reads only the todo's title.

**Existing bug I didn't fix:** a new todo's id is the list length plus one (`nextId` in `lib/todos.ts`), so after a delete two todos can end up with the same id. Pin, toggle and delete all find a todo by its id, so in that state they act on both todos at once. It's outside this task, but it's worth a follow-up.
