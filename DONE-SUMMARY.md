Renaming a todo to the title of another todo that's still on the list and not done is now refused. The todo keeps its old title and the same "“Buy milk” is already on your list." message appears. Typecheck, lint, 12 unit tests and 5 end-to-end tests all pass.

It's committed as `329b53c` on `fm/dedupe-active-followup-r1`, which is a fast-forward of `main`. I haven't pushed or merged anything, and I've appended `done` to the status file.

**Inbox:** the one message, `001.msg`, said "Use your best judgement, note your assumptions in your done summary, and carry on." I moved it to `handled/` and logged a `resolved` line that closes my earlier blocker.

**What changed:**
- **Duplicate check** (`lib/todos.ts`): it now takes an optional id to leave out, so a todo is never counted as a duplicate of itself.
- **Saving an edit** (`components/TodoApp.tsx`): the edit is refused if the new title matches another todo that isn't done. Renaming to a completed todo's title still works.
- **Tests:** one new unit test, plus two end-to-end tests for the refused rename and the allowed rename to a completed title.

**Assumptions:**
- **Checkout:** I worked in the checkout I was launched in, even though it looked like the main repo copy rather than a separate worktree. I took "carry on" as permission to do that. I only worked on my own branch and never touched `main`.
- **Matching:** I used the same rule as when adding: case and surrounding spaces are ignored.
- **Changing only the case of a todo's own title** (e.g. "buy milk" → "Buy milk") is allowed, since it doesn't match another todo.
- **After a refused rename,** edit mode closes and the old title shows, the same as pressing Escape. Pressing Enter or clicking away both work this way.
- **Clearing the message:** it now also clears when you start editing a todo, not only when you type in the new-todo box.
