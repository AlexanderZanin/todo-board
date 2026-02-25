/**
 * LocalStorageService
 *
 * Simple abstraction around `localStorage` for persisting the board state.
 * The implementation intentionally exposes async methods so callers can treat
 * storage as an asynchronous operation (and because some environments may
 * later replace this with an async remote store).
 *
 * Behaviour notes:
 * - `load()` returns `BoardState | null` and tolerates JSON parse errors.
 * - `save()` serializes the full state and writes it to `localStorage`.
 * - The implementation is minimal: no schema migrations or size checks are
 *   performed here. Those responsibilities belong to a higher-level migration
 *   utility if needed.
 */
import type { TodoStorage } from "./types";
import type { BoardState } from "../models";

const EDITOR_STORAGE_KEY = "todo-board-data";

export class LocalStorageService implements TodoStorage {
  /**
   * Load persisted board state from localStorage.
   * Returns `null` when no data exists or on parse errors.
   */
  async load() {
    const raw = localStorage.getItem(EDITOR_STORAGE_KEY);

    try {
      return raw ? (JSON.parse(raw) as BoardState) : null;
    } catch (error) {
      // Parsing failures should not crash the app — log and return null.
      // Higher-level code can choose to reset storage or surface an error.
      console.error("Failed to parse JSON:", error);
      return null;
    }
  }

  /**
   * Persist the provided board state to localStorage.
   * Note: `localStorage` operations are synchronous; callers may debounce
   * calls to `save()` to avoid blocking the main thread during heavy updates.
   */
  async save(state: BoardState) {
    localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(state));
  }
}
