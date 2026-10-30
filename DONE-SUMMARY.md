If you add a todo that's already on your list and not done yet, it's no longer added again. The app now says it's already there instead. The change is committed as `f89a56c` on branch `fm/dedupe-active-r2`, a clean fast-forward from `main`. Nothing was pushed, and I've reported it as ready.

**How it behaves**
- **What counts as the same:** titles match regardless of upper/lower case and spaces at either end, so "buy milk " matches "Buy milk". This was my call, since the request didn't say.
- **What you see:** pressing Enter on a duplicate leaves the text in the box and shows "“Buy milk” is already on your list." just under the input. Screen readers announce the message. It disappears as soon as you type again.
- **Done items don't count:** if the earlier "Buy milk" is marked done, you can add a new one.
- **Where the code is:** the matching rule is a new function, `findActiveDuplicate`, in `lib/todos.ts`. The app uses it in `components/TodoApp.tsx`, and I added a short note to the README.

**Checks**
- The project's own lint, type check and unit tests pass (11 unit tests). The end-to-end tests also pass (3), including two new ones: a duplicate is refused, and a done item can be added again.
- I broke each new rule on purpose (stopped ignoring done items, then turned off the case and spacing handling), and the tests failed both times. I then put the code back.
- I checked it in a browser. My first version put the message in a spot that misaligned the "mark all complete" arrow, so I moved it into the list area. The screenshot of the fixed version is at `home/data/dedupe-active-r2/after.png`. I didn't take a "before" screenshot.
- I reviewed the change myself for correctness, readability, structure, security and performance. No second reviewer looked at it.
- The project has no `CONSTRAINTS.md`; adding one would make sense. I added no new suppression comments and didn't skip or weaken any tests. The agent-skills pack version was 0.6.14.

**Noticed but not changed**
- **ID bug:** new todos get their ID from the list length plus one, so after deleting an item, a new todo can get the same ID as an existing one.
- **Editing gap:** renaming a todo to match another active one isn't blocked; this change only covers adding.
- **Existing code:** `TodoApp.tsx` already had an `eslint-disable-next-line` comment before this change; I left it alone.
