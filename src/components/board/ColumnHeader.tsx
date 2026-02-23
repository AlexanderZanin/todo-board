import { useState, useRef } from "react";
import { ColumnMenu } from "./index";
import {
  useDraggable,
  useRefWithNull,
  type ColumnDragMeta,
} from "../../hooks/useDragAndDrop";
import { useBoard } from "../../hooks";
import { DragButton } from "../base";

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

  const { state } = useBoard();

  const column = state.columnsWithTasks.find((c) => c.id === columnId);
  const title = column ? column.title : (state.columns[columnId]?.title ?? "");
  const count = column
    ? column.tasks.length
    : (state.columns[columnId]?.taskIds.length ?? 0);

  return (
    <div
      ref={rootRef}
      className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white rounded-t-lg"
    >
      <div ref={handleRef} className="flex items-center gap-2 cursor-grab">
        <DragButton />
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>

      <div className="relative">
        <button
          className="p-1 rounded hover:bg-slate-200"
          onClick={() => setIsOpen(true)}
        >
          ⋯
        </button>

        <ColumnMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
}
