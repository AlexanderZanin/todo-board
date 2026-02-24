import type { BoardState } from "../models";
import { boardStore } from "../store/todoBoard.store";
import { subscribe } from "valtio";
import { LocalStorageService } from "../services/todoStorage.service";
import debounce from "lodash-es/debounce";

const storage = new LocalStorageService();

const debouncedSave = debounce((state: BoardState) => {
  storage.save(state);
}, 500);

export async function initBoardStore() {
  const saved = await storage.load();

  if (saved) {
    Object.assign(boardStore, saved);
  }

  subscribe(boardStore, () => {
    debouncedSave(boardStore);
  });
}
