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

  return {
    state: snap,
    filtersSelection,
    getters: {
      getTaskById,
    },
    actions: { ...boardActions, addNewTask },
  };
}
