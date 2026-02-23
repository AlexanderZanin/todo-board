import { useRef, useState } from "react";
import { useDroppable } from "../../hooks/useDragAndDrop";
import { useBoard } from "../../hooks";
import type { TaskDragMeta } from "../../hooks/useDragAndDrop";

interface Props {
  columnId: string;
  index: number;
}

export function TaskDropZone({ columnId, index }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { actions } = useBoard();
  const [active, setActive] = useState(false);

  useDroppable(
    ref,
    (data) => {
      setActive(false);
      if (!data) return;
      if (data.type === "task") {
        const d = data as TaskDragMeta;
        actions.moveTask({
          taskId: d.taskId,
          fromColumnId: d.sourceColumnId,
          toColumnId: columnId,
          toIndex: index,
        });
      }
    },
    () => setActive(true),
    () => setActive(false),
  );

  return (
    <div ref={ref} className="h-3">
      <div
        className={`h-0.5 transition-all bg-blue-500 mx-1 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
