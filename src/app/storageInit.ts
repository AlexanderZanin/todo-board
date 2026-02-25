/**
 * storageInit.ts
 *
 * Responsibilities:
 * - Load persisted board state from storage on app startup and initialize the store.
 * - Subscribe to store changes and persist them back to storage with debouncing.
 *
 * Rationale:
 * - All reads/writes to localStorage are abstracted behind `LocalStorageService` so
 *   the store and components remain decoupled from persistence implementation.
 * - Writes are debounced to avoid excessive synchronous localStorage operations
 *   while the user is actively interacting with the board.
 *
 * Usage:
 * - Call `initToDoStorage()` during app bootstrap (before or shortly after rendering
 *   the main app) so existing data is loaded and subsequent mutations are persisted.
 */

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

  // If we have a saved board state, initialize the store with it.
  if (saved) {
    boardActions.initialize(saved);
  }

  // Persist store changes back to storage. We subscribe to the Valtio proxy and
  // call the debounced save function so writes are coalesced.
  subscribe(boardStore, () => {
    debouncedSave(boardStore);
  });
}
