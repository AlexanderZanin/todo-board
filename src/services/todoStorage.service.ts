import type { TodoStorage } from "./types";
import type { BoardState } from "../models";

const EDITOR_STORAGE_KEY = "todo-board-data";

export class LocalStorageService implements TodoStorage {
  async load() {
    const raw = localStorage.getItem(EDITOR_STORAGE_KEY);

    try {
      return raw ? (JSON.parse(raw) as BoardState) : null;
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return null;
    }
  }

  async save(state: BoardState) {
    localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(state));
  }
}
