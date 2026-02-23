import { useRef, useState } from "react";
import { useDroppable } from "../../hooks/useDragAndDrop";
import { useBoard } from "../../hooks";
import type { ColumnDragMeta } from "../../hooks/useDragAndDrop";

interface Props {
  index: number;
}

export function ColumnDropZone({ index }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { actions } = useBoard();
  const [active, setActive] = useState(false);

  useDroppable(
    ref,
    (data) => {
      setActive(false);
      if (!data) return;
      if (data.type === "column") {
        const d = data as ColumnDragMeta;
        actions.moveColumn({ columnId: d.columnId, toIndex: index });
      }
    },
    () => setActive(true),
    () => setActive(false),
  );

  return (
    <div
      ref={ref}
      className={`w-6 flex-shrink-0 flex items-center justify-center ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-px h-24 bg-blue-500" />
    </div>
  );
}
