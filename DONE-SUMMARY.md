The search field is in and committed on `fm/search-r2` as `34b95a9` ("feat: filter the list with a search field"). It's a fast-forward onto `main`, nothing was pushed, and the worktree is clean. I appended `done` to the status file.

**What changed** (6 files, +97/−3):
- **Search field:** a field labelled "Search" now sits between the input row and the list.
- **Matching:** the list shows only todos whose title contains the typed text, ignoring letter case. It applies within the current filter and still works with "Sort by date". Clearing the field shows everything again.
- **Counter:** "items left" still counts every active todo, whatever the search.
- **Helper:** the matching lives in a new `searchTodos` function in `lib/todos.ts`. It also ignores spaces around the text, so a blank search shows everything.
- **Docs:** the README now describes the field.

**Decision for you:** each filter (All / Active / Completed / Overdue) is its own page, and switching filters reloads the app. So the search text clears when you switch filters. The intent didn't ask for it to carry over, so I kept it simple, documented it, and wrote a test for it. Keeping it across filters would need something extra, such as browser storage or putting the text in the URL.

**Checks:** lint, typecheck and the build all pass. Unit tests: 29/29, including 4 new ones. End-to-end tests: 8/8, including a new `e2e/search.spec.ts`. That test covers mixed letter case, searching within Active and Completed, the counter staying at 3 while searching, no matches, and clearing the field.
- To check that the tests can actually fail, I broke the case handling and then the space trimming. 1 and 2 unit tests failed respectively, and I restored the file.
- I tried it in the browser with `chrome-devtools-axi`; layout and counter looked right. Screenshots are in `home/data/search-r2/`: `before.png`, `after-empty.png` and `after-search.png`.
- I reviewed the diff for correctness, readability, structure, security and performance. It adds no suppression comments, stubs or skipped tests. No doubt cycles were run and no cross-model review was done.

**Process notes:**
- The best-practices pack `addyosmani/agent-skills` was loaded at version 0.6.14.
- There's no `CONSTRAINTS.md`, so I kept the diff tidy by hand. Adding a constraints file is a follow-up.
- The isolation check passed: the repo's top level was the directory I was launched in. That directory is the repo's only checkout, not a pool worktree.
- My first `working` status line didn't call the fleet-ledger script. The `done` line did.

**Noticed but not touched:**
- "Mark all as complete" still changes every todo, including ones the search hides. That's how it already worked before this change.
- An empty search result shows a blank list with no "no matches" message.
- Running `next dev` creates an `AGENTS.md` file in the repo root. I deleted it rather than commit it, since the brief says not to create that file. Setting `agentRules: false` in `next.config.ts` would stop it.
- `nextId` uses the number of todos plus one, so it can repeat an id after a delete.

**Follow-ups:**
- Decide whether the search should carry across filter switches.
- Add a `CONSTRAINTS.md`.
- Turn off the generated `AGENTS.md`.
- The change leaves no unused code.
