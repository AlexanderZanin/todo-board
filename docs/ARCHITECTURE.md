# Architecture

## Overview

This project follows a **strict layered architecture** with strong separation of concerns.

The goal is:

- Predictable state management
- Scalable structure
- Clear responsibility boundaries
- Safe extension by AI agents
- No architectural drift over time

This document is a **contract**.
All new code must respect these rules.

---

## Core Principles

1. Separation of concerns is mandatory.
2. Each layer has a single responsibility.
3. The **model layer is the source of truth** for domain structure.
4. UI must not know about the store implementation.
5. State mutations must only happen through actions.
6. Derived state must not be computed inside components.
7. No business logic inside UI.

---

## File Structure

```
src/
├── model/
│   └── models.ts              # All domain interfaces and types
├── store/
│   └── todoBoard.store.ts     # Valtio proxy store + all actions (boardStore, boardActions)
├── hooks/
│   └── useBoard.ts            # Domain hook — the ONLY gateway to state for components
└── components/
    ├── Column/
    │   └── Column.tsx
    ├── Task/
    │   └── Task.tsx
    └── ...
```

---

## Architecture Layers

### 0️⃣ Model Layer — Domain Contracts

**Location:** `src/model/models.ts`

This is the most important layer conceptually. It defines all domain entities and is
the canonical source of truth for data shapes across the entire application.

#### Current domain types

```ts
// src/model/models.ts

export type TaskStatus = "completed" | "active";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[]; // ordered list of task IDs belonging to this column
}

export interface BoardState {
  tasks: Record<string, Task>; // normalized task map, keyed by id
  columns: Record<string, Column>; // normalized column map, keyed by id
  columnOrder: string[]; // defines left-to-right column order
  selectedTaskIds: string[]; // IDs of currently selected tasks (multi-select)
  searchQuery: string; // current search input
  filter: "all" | "active" | "completed";
}
```

#### Rules

- The model depends on **nothing** — no React, no Valtio, no business logic
- All other layers depend on the model
- If a new field is needed on a domain entity, it **must** be added here first,
  then propagated to the store, actions, and hook in that order
- Never introduce ad-hoc fields in the store, actions, or components

#### Critical extension flow

```
1. Add/change field in src/model/models.ts
2. Update store initial state in src/store/todoBoard.store.ts
3. Update or add actions if the field requires mutation logic
4. Expose via useBoard hook if components need access
```

---

### 1️⃣ Store Layer — Valtio State

**Location:** `src/store/todoBoard.store.ts`

Holds the normalized application state as a Valtio proxy. Exports `boardStore`.

#### Shape (mirrors BoardState)

```ts
export const boardStore = proxy<BoardState>({
  tasks: {},
  columns: {},
  columnOrder: [],
  selectedTaskIds: [],
  searchQuery: "",
  filter: "all",
});
```

#### Computed/derived state

Getters may be defined on the store for derived state. Components must never
recompute this themselves.

```ts
// Example getter — derive ordered columns with their resolved tasks
get columnsWithTasks() {
  return boardStore.columnOrder.map((colId) => ({
    ...boardStore.columns[colId],
    tasks: boardStore.columns[colId].taskIds.map((id) => boardStore.tasks[id]),
  }));
}
```

#### Rules

- MUST NOT import React
- MUST NOT contain UI logic or DOM access
- MUST NOT contain drag-and-drop logic
- MUST NOT be mutated outside of `boardActions`
- State MUST remain normalized (entities indexed by id, order stored separately)

---

### 2️⃣ Actions Layer — State Mutations

**Location:** `src/store/todoBoard.store.ts` (exported as `boardActions`)

All state mutations live here. This is the only place allowed to write to `boardStore`.

#### Current action signatures (extend as needed)

```ts
export const boardActions = {
  // --- Tasks ---
  addTask: (columnId: string, title: string) => void,
  deleteTask: (taskId: string) => void,
  editTask: (taskId: string, title: string) => void,
  setTaskStatus: (taskId: string, status: TaskStatus) => void,

  // --- Bulk task operations ---
  deleteSelectedTasks: () => void,
  setSelectedTasksStatus: (status: TaskStatus) => void,
  moveSelectedTasksToColumn: (targetColumnId: string) => void,

  // --- Selection ---
  selectTask: (taskId: string) => void,
  deselectTask: (taskId: string) => void,
  selectAllInColumn: (columnId: string) => void,
  clearSelection: () => void,

  // --- Columns ---
  addColumn: (title: string) => void,
  deleteColumn: (columnId: string) => void,
  renameColumn: (columnId: string, title: string) => void,

  // --- Reordering (called by DnD layer after drop) ---
  moveTask: (taskId: string, fromColumnId: string, toColumnId: string, targetIndex: number) => void,
  moveColumn: (fromIndex: number, toIndex: number) => void,

  // --- Search & filter ---
  setSearchQuery: (query: string) => void,
  setFilter: (filter: BoardState["filter"]) => void,
};
```

#### Rules

- Only actions may modify `boardStore`
- No React imports
- No UI logic, no DOM access
- No drag-and-drop logic — DnD calls actions, not the other way around
- Each action must be a pure, focused mutation or orchestration of mutations

---

### 3️⃣ Domain Hook Layer — React Adapter

**Location:** `src/hooks/useBoard.ts`

The `useBoard` hook is the **only** gateway between the domain and the UI. Components
must import nothing from the store or actions directly — only from this hook.

#### Current implementation

```ts
import { useSnapshot } from "valtio";
import { boardStore, boardActions } from "../store/todoBoard.store";

export function useBoard() {
  const snap = useSnapshot(boardStore);

  return {
    state: snap,
    actions: boardActions,
  };
}
```

#### The hook is allowed to grow

The hook is intentionally thin right now but is **allowed to contain intermediate logic**
that doesn't belong in actions or components. Appropriate things to add here include:

- Generating IDs before passing to actions (e.g. `nanoid()`)
- Transforming raw UI input into the shape actions expect
- Deriving UI-specific computed values from snapshot (e.g. `filteredColumns`)
- Wrapping multiple action calls that always go together in the UI context

#### What the hook exposes

```ts
{
  state: {                          // readonly Valtio snapshot of BoardState
    tasks: Record<string, Task>,
    columns: Record<string, Column>,
    columnOrder: string[],
    selectedTaskIds: string[],
    searchQuery: string,
    filter: "all" | "active" | "completed",
  },
  actions: boardActions,            // all domain mutations (see Actions layer above)
}
```

#### Rules

- Components MUST NOT import `boardStore` or `boardActions` directly
- Components MUST NOT import `useSnapshot` directly
- ALL state access from components goes through `useBoard()`
- The hook MUST NOT contain rendering logic or JSX

---

### 4️⃣ UI Layer — Components

**Location:** `src/components/`

Components are responsible for rendering UI and forwarding user interactions to actions
via `useBoard`. They must remain declarative and dumb.

#### Rules

- No direct store imports
- No business logic
- No data reshaping or derived state computation
- No state mutation — only call `actions.*`
- Styling via Tailwind CSS only — no UI libraries, no inline styles

#### Correct component pattern

```tsx
// ✅ CORRECT
function TaskCard({ taskId }: { taskId: string }) {
  const { state, actions } = useBoard();
  const task = state.tasks[taskId];

  return (
    <div>
      <span>{task.title}</span>
      <button onClick={() => actions.toggleTask(taskId)}>Complete</button>
    </div>
  );
}
```

---

## 5️⃣ Persistence layer

**Location:** `src/services/`

### Files

- `types.ts` — `TodoStorage` interface (`load` / `save` typed against `BoardState`)
- `todoStorage.service.ts` — `LocalStorageService` implements `TodoStorage`
- `storageInit.ts` — wires persistence to the store (lives next to `App.tsx` in `src/app/`)

### Responsibilities

- `LocalStorageService` — reads and writes `BoardState` to localStorage under the key `todo-board-data`
- `storageInit.ts` — on app init, loads persisted state and hydrates the store; then subscribes to store changes and saves with debounce
- `App.tsx` calls `initToDoStorage()` inside `useEffect` to kick this off

### Rules

- The store must not import or know about the persistence layer
- The persistence layer must not import or know about the store directly — `storageInit.ts` is the only place that references both
- Never access `localStorage` directly outside of `LocalStorageService`
- Components must never interact with the persistence layer

---

### 6️⃣ Drag and Drop Layer

**Library:** `@atlaskit/pragmatic-drag-and-drop` (no other DnD library allowed)

DnD is a UI-level concern. Its only job is to interpret drag events and call the
appropriate action. It must not contain business logic or mutate state directly.

#### Key primitives used

- `draggable()` — makes an element draggable, attaches drag metadata
- `dropTargetForElements()` — defines a valid drop zone
- `monitorForElements()` — listens globally to drag events (useful for column reordering)

#### Drag metadata shape

Each draggable element must attach typed metadata so drop targets know what was dropped:

```ts
// Task drag metadata
{ type: "task", taskId: string, sourceColumnId: string }

// Column drag metadata
{ type: "column", columnId: string }
```

#### Correct DnD flow

```
User drags → draggable() attaches metadata
           → dropTargetForElements() receives drop event
           → Handler reads metadata, determines intent
           → Calls actions.moveTask() or actions.moveColumn()
           → Store updates → UI re-renders
```

#### Where DnD logic lives

DnD wiring (attaching `draggable()`, `dropTargetForElements()`) should live in a
**dedicated custom hook** or directly inside the component that owns the draggable
element — not in actions, not in `useBoard`.

Suggested location: `src/hooks/useDragAndDrop.ts`

#### Rules

- Must not mutate `boardStore` directly
- Must not contain task reordering logic — that belongs in `actions.moveTask`
- Must only call `boardActions` after interpreting the drop event
- Drag metadata must be typed (no `any`)

---

## ❌ Anti-Patterns — Never Do These

```ts
// ❌ Mutating store directly inside a component
const snap = useSnapshot(boardStore);
snap.tasks[id].status = "completed";         // NEVER

// ❌ Importing the store directly in a component
import { boardStore } from "../store/todoBoard.store";  // NEVER in components

// ❌ Importing actions directly in a component
import { boardActions } from "../store/todoBoard.store"; // NEVER — use useBoard()

// ❌ Computing derived state inside JSX
const completed = Object.values(snap.tasks).filter(t => t.status === "completed"); // NEVER in component body

// ❌ Adding a new field to a task ad-hoc in the store without updating the model
boardStore.tasks[id].priority = "high";      // NEVER — update model first

// ❌ Putting business logic in a component
function Column() {
  const newId = Math.random().toString();    // NEVER — ID generation belongs in the hook
  const reordered = [...tasks].sort(...);   // NEVER — belongs in actions or hook
}
```

---

## Extension Guidelines for AI Agents

When adding any new feature, follow this strict sequence:

| What you need                | Where to make the change                             |
| ---------------------------- | ---------------------------------------------------- |
| New field on a domain entity | `src/model/models.ts` first, then propagate          |
| New state value              | `src/store/todoBoard.store.ts` (store shape)         |
| New mutation                 | `src/store/todoBoard.store.ts` (boardActions)        |
| New derived/computed value   | Store getter or `useBoard` hook                      |
| New UI access point          | Expose via `useBoard` return value                   |
| New component                | `src/components/` — consume via `useBoard` only      |
| New DnD behavior             | `src/hooks/useDragAndDrop.ts` — call actions on drop |

**When in doubt:** default to the most restrictive interpretation of these rules.
If a requirement doesn't clearly fit an existing layer, add a new action or extend
the hook — do not bend the component to absorb logic it shouldn't own.

All domain evolution flows top-down through:

```
Model → Store → Actions → Hook → UI
```
