import { useState, useRef, useEffect } from "react";
import {
  useDraggable,
  useRefWithNull,
  type ColumnDragMeta,
} from "../../hooks/useDragAndDrop";
import { useBoard } from "../../hooks";
import { DragButton, BaseMenu, BaseMenuButton } from "../base";

interface Props {
  columnId: string;
}

export function ColumnHeader({ columnId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRefWithNull<HTMLDivElement>();
  const handleRef = useRef<HTMLDivElement | null>(null);

  useDraggable(rootRef, handleRef, {
    type: "column",
    columnId,
  } as ColumnDragMeta);

  const { state, actions, getters } = useBoard();

  const column = state.columnsWithTasks.find((c) => c.id === columnId);
  const titleFromState = column
    ? column.title
    : (state.columns[columnId]?.title ?? "");
  const count = column
    ? column.tasks.length
    : (state.columns[columnId]?.taskIds.length ?? 0);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(titleFromState);
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTitleInput(titleFromState);
  }, [titleFromState]);

  useEffect(() => {
    if (isEditingTitle) {
      setTimeout(() => titleRef.current?.focus(), 0);
    }
  }, [isEditingTitle]);

  function finishRename(save = true) {
    if (save) {
      actions.renameColumn(columnId, titleInput.trim() || "Untitled");
    }
    setIsEditingTitle(false);
  }

  return (
    <div
      ref={rootRef}
      className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white rounded-t-lg"
    >
      <div ref={handleRef} className="flex items-center gap-2 cursor-grab">
        {isEditingTitle ? (
          <input
            ref={titleRef}
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={() => finishRename(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") finishRename(true);
              if (e.key === "Escape") finishRename(false);
            }}
            className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold"
          />
        ) : (
          <>
            <DragButton />
            <h2 className="text-sm font-semibold">{titleFromState}</h2>
            <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">
              {count}
            </span>
          </>
        )}
      </div>

      <div className="relative">
        <button
          className="p-1 rounded hover:bg-slate-200"
          onClick={() => setIsOpen(true)}
        >
          ⋯
        </button>
        <BaseMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <BaseMenuButton
            onClick={() => {
              setIsOpen(false);
              setIsEditingTitle(true);
            }}
          >
            Rename column
          </BaseMenuButton>
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
          <BaseMenuButton>Clear completed</BaseMenuButton>
          <div className="border-t border-slate-200 my-1" />
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
    </div>
  );
}
