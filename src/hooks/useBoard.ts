import { useSnapshot } from "valtio";
import { boardStore, boardActions } from "../store/todoBoard.store";

export function useBoard() {
  const snap = useSnapshot(boardStore);

  const filtersSelection = {
    isAll: snap.filter === "all",
    isActive: snap.filter === "active",
    isCompleted: snap.filter === "completed",
  };

  function addNewTask(columnId: string) {
    boardActions.addTask(columnId, "");
    boardActions.setSearchQuery("");
  }

  const getTaskById = (id: string) => snap.tasks[id];

  const getAllColumnTasks = (columnId?: string) =>
    columnId ? snap.columns[columnId]?.taskIds || [] : [];

  const areAllColumnTasksSelected = (columnId: string) => {
    const all = getAllColumnTasks(columnId);
    if (all.length === 0) return false;
    return all.every((id) => snap.selectedTaskIds.includes(id));
  };

  const getSelectedTasksInColumn = (columnId: string) =>
    getAllColumnTasks(columnId).filter((id) =>
      snap.selectedTaskIds.includes(id),
    );

  return {
    state: snap,
    filtersSelection,
    getters: {
      getTaskById,
      getAllColumnTasks,
      areAllColumnTasksSelected,
      getSelectedTasksInColumn,
    },
    actions: { ...boardActions, addNewTask },
  };
}
