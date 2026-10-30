Todos can now be pinned to the top of the list. The change is committed on `fm/refactor-state-followup-r2` as `36bec78`. It's a clean fast-forward onto `main`, and I've reported `done` to firstmate. Nothing was pushed and no PR was opened. Lint, typecheck, the 19 unit tests and both Playwright tests pass.

**What changed:**
- **Data and order:** a todo can now be marked `pinned`. A new `pinnedFirst` step puts pinned todos above the rest and keeps each group in its usual order. It runs after the All/Active/Completed filter, so the filters still apply.
- **Saving:** the pin is saved in localStorage along with the todo, so it survives a reload. Todos saved before this change load as unpinned.
- **Button:** each row has a "Pin" button that reads "Unpin" on a pinned todo and is highlighted. It sits just left of the delete button, styled in a new `app/globals.css`.
- **Tests:** I added unit tests for pinning and the ordering, and an end-to-end test that pins a todo, reloads, checks all three filters, then unpins it.
- I updated the existing "adds a todo" test to read just the todo's text, because the whole row now also contains "Pin". I also updated the README's layout notes.

**Things to know:**
- I didn't look at the button in a browser. The end-to-end test checks the behaviour, not how the row looks.
- Existing bug, not fixed: a new todo's id is the list length plus one, so after deleting a todo, a new one can get the same id as one still in the list. Pin, toggle and delete act on every todo with that id, so pinning one of the pair pins both. A fix would be to use the highest existing id plus one; that's a separate task.
- I didn't touch the message in the operational inbox, because the brief only says to move messages in the task's own steering inbox.
