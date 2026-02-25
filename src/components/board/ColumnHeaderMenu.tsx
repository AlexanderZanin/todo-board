import { useState, useRef } from "react";
import { BaseMenu, BaseMenuButton } from "../base";
import { useBoard } from "../../hooks";

interface ColumnHeaderMenuProps {
  columnId: string;
  onColumRename?: () => void;
}
export function ColumnHeaderMenu({
  columnId,
  onColumRename,
}: ColumnHeaderMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { actions, getters } = useBoard();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const selectedInColumn = getters.getSelectedTasksInColumn(columnId);
  const hasSelectedInColumn = selectedInColumn.length > 0;
  const areAllSelected = getters.areAllColumnTasksSelected(columnId);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="p-1 rounded hover:bg-slate-200 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        ⋯
      </button>
      <BaseMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        anchorRef={buttonRef}
      >
        <BaseMenuButton
          onClick={() => {
            setIsOpen(false);
            if (areAllSelected) {
              actions.clearSelection(columnId);
              return;
            }
            actions.selectTask(getters.getAllColumnTasks(columnId) as string[]);
          }}
        >
          {areAllSelected ? "Deselect all tasks" : "Select all tasks"}
        </BaseMenuButton>

        {Boolean(hasSelectedInColumn) && (
          <>
            <div className="border-t border-slate-200 my-1" />

            <BaseMenuButton
              onClick={() => {
                setIsOpen(false);
                if (!hasSelectedInColumn) return;
                actions.setTasksStatus(selectedInColumn, "completed");
                actions.clearSelection(columnId);
              }}
            >
              Complete selected
            </BaseMenuButton>

            <BaseMenuButton
              onClick={() => {
                setIsOpen(false);
                if (!hasSelectedInColumn) return;
                actions.setTasksStatus(selectedInColumn, "active");
                actions.clearSelection(columnId);
              }}
            >
              Incomplete selected
            </BaseMenuButton>

            <BaseMenuButton
              isDanger
              onClick={() => {
                setIsOpen(false);
                if (!hasSelectedInColumn) return;
                actions.deleteTasks(selectedInColumn);
                actions.clearSelection(columnId);
              }}
            >
              Delete selected
            </BaseMenuButton>
          </>
        )}

        <div className="border-t border-slate-200 my-1" />
        <BaseMenuButton
          onClick={() => {
            setIsOpen(false);
            onColumRename?.();
          }}
        >
          Rename column
        </BaseMenuButton>
        <BaseMenuButton
          isDanger
          onClick={() => {
            setIsOpen(false);
            actions.deleteColumn(columnId);
          }}
        >
          Delete column
        </BaseMenuButton>
      </BaseMenu>
    </div>
  );
}
