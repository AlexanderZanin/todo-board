# Kanban Board (React + Valtio + Pragmatic DnD)

This is a small demo Kanban board built with React + TypeScript, Valtio for state, and
@atlaskit/pragmatic-drag-and-drop for DnD. It focuses on a clear state model, explicit
actions for mutations, and a lightweight component structure.

## Quick start

Prerequisites: Node.js 16+ and npm or Yarn.

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Notes:

- The project uses Vite as the dev server and build tool.
- If you see lint or type errors, run `npm run check` or your editor's TypeScript service.

## Project structure (short)

- `src/models` — domain types (Task, Column, BoardState).
- `src/store` — single source of truth (`boardStore`) and `boardActions` that mutate it.
- `src/hooks` — domain hooks (notably `useBoard`) and UI helpers (e.g. `useMenuPosition`).
- `src/services` — side-effectful abstractions (LocalStorage persistence, etc.).
- `src/components` — UI components organized by feature (`board`, `card`, `layout`, `base`).
- `src/app` / `src/main.tsx` — app bootstrap and top-level layout.

Key rules to follow when working in this codebase:

- All state reads and mutations flow through `useBoard()` and `boardActions` — components
  must not import or mutate the store directly.
- The state is normalized: tasks and columns are stored in maps and referenced by id.
- DnD metadata is typed and evaluated at drag start; droppable handlers receive payloads
  and must call `boardActions` to make changes.

---
