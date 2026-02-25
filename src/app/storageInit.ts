import type { BoardState } from "../models";
import { boardStore, boardActions } from "../store/todoBoard.store";
import { subscribe } from "valtio";
import { LocalStorageService } from "../services/todoStorage.service";
import debounce from "lodash-es/debounce";

const storage = new LocalStorageService();

const debouncedSave = debounce((state: BoardState) => {
  storage.save(state);
}, 500);

export async function initToDoStorage() {
  const saved = await storage.load();

  if (saved) {
    boardActions.initialize(saved);
  }

  subscribe(boardStore, () => {
    debouncedSave(boardStore);
  });
}
