import { useRef, useEffect, useState } from "react";
import {
  useDraggable,
  useRefWithNull,
  type TaskDragMeta,
} from "../../hooks/useDragAndDrop";
import { useBoard } from "../../hooks";
import { DragButton, BaseMenu, BaseMenuButton } from "../base";
import type { Task } from "../../models";
import { TodoCardView } from "./TodoCardView";

interface Props {
  item: Task;
  columnId: string;
  isSelected?: boolean;
}

export function TodoCard({ item, columnId, isSelected }: Props) {
  const rootRef = useRefWithNull<HTMLDivElement>();
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const { state, actions } = useBoard();

  const computedIsSelected =
    typeof isSelected === "boolean"
      ? isSelected
      : state.selectedTaskIds.includes(item.id);

  useDraggable(rootRef, handleRef, () => {
    return {
      type: "task",
      taskId: item.id,
      sourceColumnId: columnId,
      selectedIds: computedIsSelected ? state.selectedTaskIds : undefined,
    } as TaskDragMeta;
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [text, setText] = useState(item.title);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (item.isEditing) {
      // focus input after render
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [item.isEditing]);

  function finishEdit(save = true) {
    if (save) {
      actions.editTask(item.id, text.trim() || "Untitled");
    }
    actions.setTaskEditing(item.id, false);
  }

  const isCompleted = item.status === "completed";

  return (
    <div
      ref={rootRef}
      className={`group bg-white rounded-md p-3 border text-sm transition-all flex items-center gap-2
        ${computedIsSelected ? "border-indigo-500 ring-2 ring-indigo-200" : "border-slate-200"}
        ${isCompleted ? "opacity-70" : ""}
      `}
    >
      <DragButton ref={handleRef} />

      <div className="flex-1">
        {item.isEditing ? (
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => finishEdit(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                finishEdit(true);
              }
              if (e.key === "Escape") {
                finishEdit(false);
              }
            }}
            className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ) : (
          <TodoCardView
            isCompleted={isCompleted}
            onChange={() => actions.toggleTask(item.id)}
            item={item}
          />
        )}
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition ml-2 relative">
        <button
          className="p-1 rounded hover:bg-slate-200 cursor-pointer"
          onClick={() => setMenuOpen(true)}
        >
          ⋯
        </button>
        <BaseMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
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
              if (computedIsSelected) {
                actions.deselectTask(item.id);
              } else {
                actions.selectTask(item.id);
              }
            }}
          >
            {computedIsSelected ? "Unselect" : "Select"}
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
    </div>
  );
}
