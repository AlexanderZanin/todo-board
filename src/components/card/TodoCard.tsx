import { useRef, useEffect, useState } from "react";
import {
  useDraggable,
  useRefWithNull,
  type TaskDragMeta,
} from "../../hooks/useDragAndDrop";
import { useBoard } from "../../hooks";

interface Props {
  taskId: string;
  columnId: string;
  title: string;
  isCompleted?: boolean;
  isSelected?: boolean;
  isEditing?: boolean;
}

export function TodoCard({
  taskId,
  columnId,
  title,
  isCompleted,
  isSelected,
  isEditing,
}: Props) {
  const rootRef = useRefWithNull<HTMLDivElement>();
  const handleRef = useRef<HTMLButtonElement | null>(null);

  useDraggable(rootRef, handleRef, {
    type: "task",
    taskId,
    sourceColumnId: columnId,
  } as TaskDragMeta);
  const { actions } = useBoard();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [text, setText] = useState(title);

  useEffect(() => {
    setText(title);
  }, [title]);

  useEffect(() => {
    if (isEditing) {
      // focus input after render
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isEditing]);

  function finishEdit(save = true) {
    if (save) {
      actions.editTask(taskId, text.trim() || "Untitled");
    }
    actions.setTaskEditing(taskId, false);
  }

  return (
    <div
      ref={rootRef}
      className={`group bg-white rounded-md p-3 border text-sm transition-all flex items-start gap-2
        ${isSelected ? "border-indigo-500 ring-2 ring-indigo-200" : "border-slate-200"}
        ${isCompleted ? "opacity-70" : ""}
      `}
    >
      <button
        ref={handleRef}
        aria-label="Drag handle"
        className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-slate-100"
      >
        ≡
      </button>

      <div className="flex-1">
        {isEditing ? (
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
              readOnly
              className="mt-1 accent-indigo-600"
            />
            <p
              className={`${isCompleted ? "line-through text-slate-500" : ""}`}
            >
              {title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
