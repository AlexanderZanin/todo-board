# Kanban Board (React + Valtio + Pragmatic DnD)

A minimal Kanban board demonstrating:

- **React + TypeScript**
- **Valtio** (proxy-based state management)
- **@atlaskit/pragmatic-drag-and-drop**
- **TailwindCSS**

Focus: clean state modeling, derived data via getters, and scalable drag-and-drop architecture.

---

## ✨ Features

- Add / reorder columns
- Add / reorder tasks
- Move tasks between columns
- Filter (all / active / completed)
- Search tasks
- Computed state via Valtio getters

---

## 🏗 State Architecture

### Normalized Model

```ts
tasks: Record<string, Task>
columns: Record<string, Column>
columnOrder: string[]
filter: "all" | "active" | "completed"
searchQuery: string
```
