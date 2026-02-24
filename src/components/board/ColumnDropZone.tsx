import { useRef, useState } from "react";
import { useDroppable } from "../../hooks/useDragAndDrop";
import { useBoard } from "../../hooks";
import type { ColumnDragMeta } from "../../hooks/useDragAndDrop";

interface Props {
  index: number;
  children?: React.ReactNode;
}

export function ColumnDropZone({ index, children }: Props) {
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
    (data) => {
      // only activate column overlay for column drags
      if (data && data.type === "column") {
        setActive(true);
      } else {
        setActive(false);
      }
    },
    () => setActive(false),
  );

  return (
    <div ref={ref} className="relative">
      {active && (
        <div className="bg-blue-500/40 rounded-lg inset-0 absolute z-50 pointer-events-none" />
      )}
      {children}
    </div>
  );
}
