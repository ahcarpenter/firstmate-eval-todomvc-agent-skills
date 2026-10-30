I added the "Important" star toggle and committed it on `fm/a11y-keyboard-followup-r3` as `ef5d0ce`. The branch fast-forwards cleanly from `main`, the worktree is clean, and I reported `done` in the status file. Lint, typecheck, unit tests (7/7) and Playwright (8/8) all pass.

What the change does:
- **The control:** each todo row has a star button named exactly "Important". It uses `aria-pressed` to announce whether the todo is important, and it works with Enter or Space. It sits between the checkbox and the edit button in the tab order.
- **What you see:** an important todo always shows a filled gold ★. Other todos show an outline ☆ only on hover or keyboard focus, like the edit and delete buttons.
- **Saving:** the mark is stored with the todo in localStorage, so it survives reloads. I made the new `important` field optional, so todos saved before this change still load as not important.
- **Tests:** I updated `e2e/keyboard.spec.ts` to check the control's name and description, toggling from the keyboard, that the mark survives a reload, and the new tab order.

Decision for you: all the star buttons share the name "Important", following the brief to the letter. Edit and delete buttons put the todo's title in their names ("Edit Buy milk"); for the star, the title is only its description. A screen reader still reads the title, but a list of buttons will show several identical "Important" entries. Making the name "Important Buy milk" would match the other buttons; it's a one-line change if you want it.

Existing bug: `nextId` in `lib/todos.ts` sets the ID to the number of todos plus one, so after a delete a new todo can get the same ID as an existing one. Starring either of those todos would then star both, as would toggling, editing or deleting it. I left it alone because it's outside this task, but it's worth a separate follow-up.

The steering inbox was empty, so there were no messages to handle.
