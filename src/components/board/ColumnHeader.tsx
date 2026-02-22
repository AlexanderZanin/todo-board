import { useState, useRef } from "react";
import { ColumnMenu } from "./index";
import {
  useDraggable,
  useRefWithNull,
  type ColumnDragMeta,
} from "../../hooks/useDragAndDrop";

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

  return (
    <div
      ref={rootRef}
      className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white rounded-t-lg"
    >
      <div ref={handleRef} className="flex items-center gap-2 cursor-grab">
        <h2 className="text-sm font-semibold">In Progress</h2>
        <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">3</span>
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
