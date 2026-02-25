import { useRef, useState } from "react";
import { useDroppable, type TaskDragMeta } from "../../hooks";
import { useBoard } from "../../hooks";

interface Props {
  columnId: string;
  index: number;
}

export function TaskDropZone({ columnId, index }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { actions } = useBoard();
  const [activeType, setActiveType] = useState<string | null>(null);

  useDroppable(
    ref,
    (data) => {
      setActiveType(null);
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
    (data) => {
      // set active type so we can differentiate visuals
      if (!data) {
        setActiveType(null);
      } else if (data.type === "task") {
        setActiveType("task");
      } else if (data.type === "column") {
        setActiveType("column");
      }
    },
    () => setActiveType(null),
  );

  return (
    <div
      ref={ref}
      className={`transition-all duration-150 ease-out flex items-center absolute w-full top-0 left-0 right-0 z-10 h-4`}
    >
      <div
        className={`mx-1 bg-blue-500 transition-all duration-150 ease-out rounded-full w-full  ${
          activeType === "task" ? "h-4 opacity-100" : "h-2 opacity-0"
        }`}
      />
    </div>
  );
}
