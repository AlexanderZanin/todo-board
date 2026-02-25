import { useRef, useEffect, useState } from "react";
import classNames from "classnames";
import { useDraggable, useRefWithNull, type TaskDragMeta } from "../../hooks";
import { useBoard } from "../../hooks";
import { DragButton } from "../base";
import type { Task } from "../../models";
import { TodoCardView } from "./TodoCardView";
import { TodoCardMenu } from "./TodoCardMenu";

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
      className={`group rounded-md p-3 border text-sm transition-all flex items-start gap-2
        ${computedIsSelected ? "border-indigo-500 ring-2 ring-indigo-200" : "border-slate-200"}
        ${isCompleted ? "bg-white/50" : "bg-white"}
      `}
    >
      <DragButton ref={handleRef} />

      <div
        className={classNames("flex-1 min-w-0", { "py-1": !item.isEditing })}
      >
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
      <TodoCardMenu
        item={item}
        columnId={columnId}
        isSelected={computedIsSelected}
      />
    </div>
  );
}
