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
        if (d.selectedIds && d.selectedIds.length > 1) {
          actions.moveTasks({
            taskIds: d.selectedIds,
            toColumnId: columnId,
            toIndex: index,
          });
          actions.clearSelection();
        } else {
          actions.moveTask({
            taskId: d.taskId,
            fromColumnId: d.sourceColumnId,
            toColumnId: columnId,
            toIndex: index,
          });
        }
      }
    },
    () => setActive(true),
    () => setActive(false),
  );

  return (
    <div
      ref={ref}
      className="transition-all duration-150 ease-out flex items-center absolute w-full top-0 left-0 right-0 z-10 h-4"
    >
      <div
        className={`mx-1 bg-blue-500 transition-all duration-150 ease-out rounded-full h-4 w-full ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
