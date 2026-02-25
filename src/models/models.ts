/**
 * TaskStatus
 * - 'active' : task is incomplete / pending
 * - 'completed' : task has been finished by the user
 */
export type TaskStatus = "completed" | "active";

/**
 * Task
 * - `id`: stable unique identifier for lookup and normalization
 * - `title`: user-facing text
 * - `status`: current completion state
 * - `isEditing`: optional UI-only flag used to indicate inline edit mode
 *
 * Notes:
 * - Tasks are stored in a normalized `tasks` map on `BoardState` and referenced
 *   from `Column.taskIds` to keep ordering information separate from task data.
 */
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  isEditing?: boolean;
}

/**
 * Column
 * - Represents a single column (lane) on the board.
 * - `taskIds` is an ordered array of task ids that belong to this column.
 *
 * Invariants:
 * - Every id in `taskIds` should exist as a key in `BoardState.tasks`.
 */
export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

/**
 * BoardState
 * - Normalized root of app state used by the Valtio store.
 * - `tasks` and `columns` are maps keyed by `id` to allow O(1) access.
 * - `columnOrder` determines the visual ordering of columns on the board.
 * - `selectedTaskIds` tracks the currently selected tasks (for multi-select
 *   operations like bulk move/delete).
 * - `searchQuery` and `filter` are UI-driven derived fields used for filtering
 *   and highlighting tasks in the UI; they are intentionally stored here so
 *   multiple components can access the same view state.
 */
export interface BoardState {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
  selectedTaskIds: string[];
  searchQuery: string;
  filter: "all" | "active" | "completed";
}
