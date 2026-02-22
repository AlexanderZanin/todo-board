import type { BoardState } from "../../models";

export interface TodoStorage {
  load(): Promise<BoardState | null>;
  save(state: BoardState): Promise<void>;
}
