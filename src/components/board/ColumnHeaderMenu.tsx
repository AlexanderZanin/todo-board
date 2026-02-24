import { useState } from "react";
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

  const selectedInColumn = getters.getSelectedTasksInColumn(columnId);
  const hasSelectedInColumn = selectedInColumn.length > 0;

  return (
    <div className="relative">
      <button
        className="p-1 rounded hover:bg-slate-200 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        ⋯
      </button>
      <BaseMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BaseMenuButton
          onClick={() => {
            setIsOpen(false);
            if (getters.areAllColumnTasksSelected(columnId)) {
              actions.clearSelection();
              return;
            }
            actions.selectTask(getters.getAllColumnTasks(columnId));
          }}
        >
          {getters.areAllColumnTasksSelected(columnId)
            ? "Deselect all tasks"
            : "Select all tasks"}
        </BaseMenuButton>

        {Boolean(hasSelectedInColumn) && (
          <>
            <div className="border-t border-slate-200 my-1" />

            <BaseMenuButton
              onClick={() => {
                setIsOpen(false);
                if (!hasSelectedInColumn) return;
                actions.setTasksStatus(selectedInColumn, "completed");
                actions.clearSelection();
              }}
            >
              Complete selected
            </BaseMenuButton>

            <BaseMenuButton
              onClick={() => {
                setIsOpen(false);
                if (!hasSelectedInColumn) return;
                actions.setTasksStatus(selectedInColumn, "active");
                actions.clearSelection();
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
