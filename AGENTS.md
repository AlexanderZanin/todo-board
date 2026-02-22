# Project Agent Guide

Read this file first before writing any code.
Then read `docs/ARCHITECTURE.md` before making any structural decisions.

---

## Stack

| Tool                                | Purpose                                      |
| ----------------------------------- | -------------------------------------------- |
| React + TypeScript                  | UI framework                                 |
| Tailwind CSS                        | Styling — utility classes only               |
| Valtio                              | State management                             |
| `@atlaskit/pragmatic-drag-and-drop` | Drag and drop — no other DnD library allowed |

---

## Project Structure

```
src/
├── models/
│   └── models.ts              # All domain types (Task, Column, BoardState, etc.)
├── store/
│   └── todoBoard.store.ts     # Valtio proxy store + boardActions
├── hooks/
│   └── useBoard.ts            # Domain hook — ONLY way components access state
├── services/
│   ├── todoStorage.service.ts # LocalStorageService implementation
├── components/                # All UI components (PascalCase folders)
└── app/                       # Main app orchestration
```

---

## Mandatory Rules

### TypeScript

- No `any` — always type explicitly
- All new domain types go in `src/models.ts` first, before touching any other file
- Follow the extension flow: `models.ts` → store → actions → hook → component

### Styling

- Tailwind CSS utility classes only
- No UI or component libraries
- No inline styles (`style={{...}}`)
- No CSS modules

### State

- Components MUST NOT import `boardStore` or `boardActions` directly
- Components MUST NOT call `useSnapshot` directly
- All state access goes through `useBoard()` — no exceptions
- All mutations go through `boardActions` — no exceptions
- Never mutate the store directly (no `snap.tasks[id].title = "..."`)

### Persistence

- Never access `localStorage` directly in components or the store
- All localStorage access goes through `LocalStorageService` in `src/services/`
- `storageInit.ts` is the only place that wires the store subscription to persistence
- The store does not know about localStorage; localStorage does not know about the store

### Drag and Drop

- Use `@atlaskit/pragmatic-drag-and-drop` only
- DnD logic must not mutate the store directly — it must call `boardActions`
- Drag metadata must be explicitly typed (no `any`)
- DnD wiring belongs in `src/hooks/useDragAndDrop.ts` or co-located with the draggable component

### Components

- All new components go in `src/components/` in a PascalCase folder
- No business logic inside components
- No derived state computation inside components
- Components call `actions.*` from `useBoard()` for all mutations

---

## Key Docs

| Doc                    | When to read it                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `docs/REQUIREMENTS.md` | To understand what the app must do                                                  |
| `docs/ARCHITECTURE.md` | Before writing any new file or layer — explains every layer in detail with examples |

---

## When in Doubt

- Default to the most restrictive interpretation of the rules above
- If a new requirement doesn't fit an existing layer, extend `boardActions` or `useBoard` — do not absorb logic into a component
- If a new domain field is needed, start in `src/models.ts` and propagate downward
