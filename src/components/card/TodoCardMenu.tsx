import { useState, useRef } from "react";
import { BaseMenu, BaseMenuButton } from "../base";
import { useBoard } from "../../hooks";
import type { Task } from "../../models";

interface TodoCardMenuProps {
  item: Task;
  columnId: string;
  isSelected?: boolean;
}

export function TodoCardMenu({
  item,
  columnId,
  isSelected,
}: TodoCardMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { actions } = useBoard();

  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="opacity-0 group-hover:opacity-100 transition ml-2 relative">
      <button
        ref={triggerRef}
        className="p-1 rounded hover:bg-slate-200 cursor-pointer"
        onClick={() => setMenuOpen(true)}
      >
        ⋯
      </button>
      <BaseMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} anchorRef={triggerRef}>
        <BaseMenuButton
          onClick={() => {
            setMenuOpen(false);
            actions.setTaskEditing(item.id, true);
          }}
        >
          Edit
        </BaseMenuButton>

        <BaseMenuButton
          onClick={() => {
            setMenuOpen(false);
            if (isSelected) {
              actions.deselectTask(item.id);
            } else {
              actions.selectTask(item.id);
            }
          }}
        >
          {isSelected ? "Unselect" : "Select"}
        </BaseMenuButton>

        <BaseMenuButton
          isDanger
          onClick={() => {
            setMenuOpen(false);
            actions.deleteTask(item.id, columnId);
          }}
        >
          Delete
        </BaseMenuButton>
      </BaseMenu>
    </div>
  );
}
