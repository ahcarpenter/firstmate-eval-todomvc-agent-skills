Renaming a todo to the title of another todo that isn't done is now refused. It's committed as `9be2bc5` on `fm/dedupe-active-followup-r2`, which fast-forwards from `main`. Type-check, lint, the unit tests (12) and the end-to-end tests (5) all pass. I didn't push, and I reported `done` in the status file.

How a rename now works:
- **Refused:** if the new title matches another todo that isn't done, ignoring case and surrounding spaces, the same "“X” is already on your list." notice appears. The todo keeps its old title and the edit box closes.
- **Allowed:** renaming to the title of a completed todo, or to the todo's own title with different capitals, still goes through.

The change is a small addition to the existing duplicate check in `lib/todos.ts` so it skips the todo being renamed, plus the refusal in `save` in `components/TodoApp.tsx`. I added one unit test, two end-to-end tests (one for the refused case, one for the allowed case) and updated the README.

The steering inbox had no messages. One thing about setup: this repo is a standalone clone, the only checkout of its repository, not a pool worktree. It's the directory I was launched in, so it passed the isolation check and I went ahead.
