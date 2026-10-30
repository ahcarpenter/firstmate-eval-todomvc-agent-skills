# TodoMVC in Next.js

A [TodoMVC](https://todomvc.com/) implementation with the Next.js App Router and TypeScript.

## Develop

```sh
npm install
npm run dev
```

Open http://localhost:3000.

## Checks

```sh
npm run lint
npm run typecheck
npm test          # unit tests (Vitest)
npm run test:e2e  # end-to-end tests (Playwright); builds and starts the app on port 3100
```

## Layout

- `app/[[...filter]]/page.tsx` serves `/`, `/active`, `/completed`, and `/overdue`.
- `components/TodoApp.tsx` holds the list state, persistence, and the page UI.
- `components/TodoItem.tsx` renders one todo and its edit fields for the title and due date.
- `lib/todos.ts` has the `Todo` type, filtering, title search, due-date sorting and overdue helpers, and localStorage helpers.

A todo's due date shows as "Due today" or "Due tomorrow" by the browser's calendar, and as "Due Nov 3" otherwise.

A todo is overdue when it is not completed and its due date is before today in the browser's time zone.

While any todo is overdue, the footer's "Move overdue to today" button sets every overdue todo's due date to today.

The footer's "Sort by date" checkbox shows todos earliest due date first, with undated todos last and ties in their usual order, within every filter.

The "Search" field above the list shows only todos whose title contains the text, ignoring letter case, within the current filter. The items-left count still counts every active todo. Switching filters clears the search.

Todos persist in `localStorage` under the `todos-nextjs` key, and the "Sort by date" choice under `todos-nextjs-sort-by-date`.
