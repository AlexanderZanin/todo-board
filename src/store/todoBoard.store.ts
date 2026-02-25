import { proxy } from "valtio";
import { devtools } from "valtio/utils";
import type { BoardState, TaskStatus, Task } from "../models";

export const generateId = () => crypto.randomUUID();

type ComputedProperties = {
  readonly columnsWithTasks: {
    id: string;
    title: string;
    tasks: Task[];
  }[];
};

export const boardStore = proxy<BoardState & ComputedProperties>({
  tasks: {},
  columns: {},
  columnOrder: [],
  selectedTaskIds: [],
  searchQuery: "",
  filter: "all",

  get columnsWithTasks() {
    return this.columnOrder.map((columnId: string) => {
      const column = this.columns[columnId];

      const tasks = column.taskIds
        .map((taskId) => this.tasks[taskId])
        .filter(Boolean)
        .filter((task) => {
          if (this.filter === "active") {
            return task.status === "active";
          }

          if (this.filter === "completed") {
            return task.status === "completed";
          }

          return true;
        })
        .filter((task) => {
          if (!this.searchQuery) return true;

          return task.title
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        });

      return {
        id: column.id,
        title: column.title,
        tasks,
      };
    });
  },
});

devtools(boardStore, { name: "Editor Test App", enabled: true });

export const boardActions = {
  // -------------------------
  // COLUMN ACTIONS
  // -------------------------
  addColumn(title: string) {
    const id = generateId();

    boardStore.columns[id] = {
      id,
      title,
      taskIds: [],
    };

    boardStore.columnOrder.push(id);
  },

  deleteColumn(columnId: string) {
    const column = boardStore.columns[columnId];
    if (!column) return;

    // Remove tasks belonging to column
    column.taskIds.forEach((taskId) => {
      delete boardStore.tasks[taskId];
    });

    delete boardStore.columns[columnId];
    boardStore.columnOrder = boardStore.columnOrder.filter(
      (id) => id !== columnId,
    );
  },

  renameColumn(columnId: string, title: string) {
    const column = boardStore.columns[columnId];
    if (!column) return;

    column.title = title;
  },

  moveColumn(params: { columnId: string; toIndex: number }) {
    const { columnId, toIndex } = params;

    const currentIndex = boardStore.columnOrder.findIndex(
      (id) => id === columnId,
    );

    if (currentIndex === -1) return;

    if (currentIndex === toIndex) return;

    const updated = [...boardStore.columnOrder];
    updated.splice(currentIndex, 1);
    updated.splice(toIndex, 0, columnId);

    boardStore.columnOrder = updated;
  },

  // -------------------------
  // TASK ACTIONS
  // -------------------------

  addTask(columnId: string, title: string) {
    const id = generateId();

    boardStore.tasks[id] = {
      id,
      title,
      status: "active",
    };

    // mark new task as editing so UI can focus it
    boardStore.tasks[id].isEditing = true;

    boardStore.columns[columnId].taskIds.push(id);
    return id;
  },

  deleteTask(taskId: string, columnId: string) {
    delete boardStore.tasks[taskId];

    boardStore.columns[columnId].taskIds = boardStore.columns[
      columnId
    ].taskIds.filter((id) => id !== taskId);

    boardStore.selectedTaskIds = boardStore.selectedTaskIds.filter(
      (id) => id !== taskId,
    );
  },

  editTask(taskId: string, title: string) {
    const task = boardStore.tasks[taskId];
    if (!task) return;

    task.title = title;
  },

  setTaskEditing(taskId: string, isEditing: boolean) {
    const task = boardStore.tasks[taskId];
    if (!task) return;

    task.isEditing = isEditing;
  },

  toggleTask(taskId: string) {
    const task = boardStore.tasks[taskId];
    if (!task) return;

    task.status = task.status === "active" ? "completed" : "active";
  },

  moveTask(params: {
    taskId: string;
    fromColumnId: string;
    toColumnId: string;
    toIndex: number;
  }) {
    const { taskId, fromColumnId, toColumnId, toIndex } = params;

    const fromColumn = boardStore.columns[fromColumnId];
    const toColumn = boardStore.columns[toColumnId];

    if (!fromColumn || !toColumn) return;

    // remove from old column
    fromColumn.taskIds = fromColumn.taskIds.filter((id) => id !== taskId);

    // insert into new column
    const updated = [...toColumn.taskIds];
    updated.splice(toIndex, 0, taskId);

    toColumn.taskIds = updated;
  },

  moveTasks(params: {
    taskIds: string[];
    toColumnId: string;
    toIndex: number;
  }) {
    const { taskIds, toColumnId, toIndex } = params;

    const toColumn = boardStore.columns[toColumnId];
    if (!toColumn) return;

    // Remove each task from its current column(s)
    Object.values(boardStore.columns).forEach((column) => {
      column.taskIds = column.taskIds.filter((id) => !taskIds.includes(id));
    });

    // Insert tasks preserving provided order
    const updated = [...toColumn.taskIds];
    updated.splice(toIndex, 0, ...taskIds);
    toColumn.taskIds = updated;
  },

  // -------------------------
  // SELECTION ACTIONS
  // -------------------------

  selectTask(taskId: string | string[]) {
    const taskIds = Array.isArray(taskId) ? taskId : [taskId];
    taskIds.forEach((id) => {
      if (!boardStore.selectedTaskIds.includes(id)) {
        boardStore.selectedTaskIds.push(id);
      }
    });
  },

  deselectTask(taskId: string) {
    boardStore.selectedTaskIds = boardStore.selectedTaskIds.filter(
      (id) => id !== taskId,
    );
  },

  clearSelection(columnId?: string) {
    if (columnId) {
      const column = boardStore.columns[columnId];
      if (!column) return;
      boardStore.selectedTaskIds = boardStore.selectedTaskIds.filter(
        (id) => !column.taskIds.includes(id),
      );
      return;
    }

    boardStore.selectedTaskIds = [];
  },

  selectAllInColumn(columnId: string) {
    const column = boardStore.columns[columnId];
    if (!column) return;

    boardStore.selectedTaskIds = [...column.taskIds];
  },

  setSelectedTasksStatus(status: TaskStatus) {
    boardStore.selectedTaskIds.forEach((taskId) => {
      const task = boardStore.tasks[taskId];
      if (task) task.status = status;
    });
  },

  deleteTasks(taskIds: string[]) {
    taskIds.forEach((taskId) => {
      delete boardStore.tasks[taskId];

      Object.values(boardStore.columns).forEach((column) => {
        column.taskIds = column.taskIds.filter((id) => id !== taskId);
      });
    });

    boardStore.selectedTaskIds = boardStore.selectedTaskIds.filter(
      (id) => !taskIds.includes(id),
    );
  },

  setTasksStatus(taskIds: string[], status: TaskStatus) {
    taskIds.forEach((taskId) => {
      const task = boardStore.tasks[taskId];
      if (task) task.status = status;
    });
  },

  // -------------------------
  // SEARCH & FILTER
  // -------------------------

  setSearchQuery(query: string) {
    boardStore.searchQuery = query;
  },

  setFilter(filter: "all" | "active" | "completed") {
    boardStore.filter = filter;
  },

  // -------------------------
  // RESET / INIT
  // -------------------------

  initialize(state: Partial<typeof boardStore>) {
    Object.assign(boardStore, state);
  },
};
