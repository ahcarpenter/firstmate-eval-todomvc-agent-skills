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

- `app/[[...filter]]/page.tsx` serves `/`, `/active`, and `/completed`.
- `components/TodoApp.tsx` holds the list state, persistence, and the page UI.
- `components/TodoItem.tsx` renders one todo and its edit field.
- `lib/todos.ts` has the `Todo` type, filtering, duplicate detection, and localStorage helpers.

Adding a todo, or renaming one, to a title (ignoring case and surrounding spaces) that matches another todo that is not done yet is refused with a notice instead; a refused rename keeps the old title.

Todos persist in `localStorage` under the `todos-nextjs` key.
