If you try to add a todo that's already on your list and not done yet, it isn't added again. A message under the input box says "“Buy milk” is already on your list." The change is committed on `fm/dedupe-active-r3` as `ddea087`; it hasn't been pushed or merged, and the branch fast-forwards onto `main`. I've logged it as done in the status file.

**How it behaves**
- **What counts as the same:** a title matches if it differs only in capital letters or spaces at the start or end, so " buy MILK " matches "Buy milk". That rule is my call; the request didn't say.
- **Done todos don't count:** once a todo is checked off, you can add the same title again.
- **What you typed stays in the box** so you can change it. The message goes away as soon as you type again.
- **Where the code is:** a new helper, `findActiveDuplicate`, in `lib/todos.ts`, used in `components/TodoApp.tsx`. The diff adds 63 lines and removes 3.

**Checks**
- Lint, type check, 11 unit tests and 3 end-to-end tests all pass. The end-to-end run builds the app first, so the build passes too.
- I wrote the 4 new unit tests and 2 new end-to-end tests before the code, and they failed until it was in.
- I broke each new condition on purpose (counting done todos, and ignoring capital letters). The tests failed each time, and I put the file back.
- I reviewed the change for correctness, readability, design, security and speed and found nothing to fix. No checks were switched off, no tests skipped, no stubs left.

**Not done**
- No before/after screenshots and no manual browser check. The end-to-end tests drive the real app in a browser instead.
- No second review by a different model.

The project has no `CONSTRAINTS.md`, so I followed the brief's rules for keeping the diff clean. The best-practices pack `addyosmani/agent-skills` is loaded at tag 0.6.14.

**Follow-ups (noticed, not fixed)**
- **ID bug:** `nextId` gives a new todo the list length plus one. After a deletion, a new todo can get the same ID as an existing one. Generating IDs from the highest existing ID would fix it.
- **Editing isn't checked:** renaming a todo to match another active one is still allowed. The request only covered adding.
- **Inline style:** the message's styling sits inline in the component because the project has no stylesheet of its own.
- **Constraints file:** add a `CONSTRAINTS.md` so the project's quality bar is written down.
