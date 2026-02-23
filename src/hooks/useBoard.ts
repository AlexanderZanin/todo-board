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

  return {
    state: snap,
    filtersSelection,
    actions: { ...boardActions, addNewTask },
  };
}
