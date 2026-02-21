import { useSnapshot } from "valtio";
import { boardStore, boardActions } from "../store/todoBoard.store";

export function useBoard() {
  const snap = useSnapshot(boardStore);

  return {
    state: snap,
    actions: boardActions,
  };
}
