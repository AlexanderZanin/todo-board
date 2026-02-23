import { useRef, useEffect, useState } from "react";
import {
  useDraggable,
  useRefWithNull,
  type TaskDragMeta,
} from "../../hooks/useDragAndDrop";
import { useBoard } from "../../hooks";
import { DragButton } from "../base";
import type { Task } from "../../models";

interface Props {
  item: Task;
  columnId: string;
  isSelected?: boolean;
}

export function TodoCard({
  item,
  columnId,
  isSelected,
}: Props) {
  const rootRef = useRefWithNull<HTMLDivElement>();
  const handleRef = useRef<HTMLButtonElement | null>(null);

  useDraggable(rootRef, handleRef, {
    type: "task",
    taskId: item.id,
    sourceColumnId: columnId,
  } as TaskDragMeta);
  const { actions } = useBoard();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [text, setText] = useState(item.title);

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
        ${isSelected ? "border-indigo-500 ring-2 ring-indigo-200" : "border-slate-200"}
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
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={isCompleted}
              className="mt-1 accent-indigo-600"
              onChange={() => actions.toggleTask(item.id)}
            />
            <p
              className={`${isCompleted ? "line-through text-slate-500" : ""}`}
            >
              {item.title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
