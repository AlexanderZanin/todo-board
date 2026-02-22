export type TaskStatus = "completed" | "active";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  isEditing?: boolean;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface BoardState {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
  selectedTaskIds: string[];
  searchQuery: string;
  filter: "all" | "active" | "completed";
}
