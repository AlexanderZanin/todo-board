import { Column, ColumnHeader, ColumnFooter, AddColumn } from "../board";
import { TodoCard } from "../card";
import { TaskDropZone } from "../board/TaskDropZone";
import { ColumnDropZone } from "../board/ColumnDropZone";
import { useBoard } from "../../hooks";

export function Board() {
  const { state, getters } = useBoard();

  return (
    <div className="flex gap-6 overflow-x-auto p-6">
      {state.columnsWithTasks.map((column, colIndex) => {
        return (
          <div className="flex items-start" key={column.id}>
            <ColumnDropZone index={colIndex}>
              <Column>
                <ColumnHeader columnId={column.id} />

                {column.tasks.length ? (
                  <div className="px-3 pb-4 max-h-[60vh] overflow-auto">
                    {/** Drop before first, between and after tasks */}
                    {Array.from({ length: column.tasks.length + 1 }).map(
                      (_, i) => (
                        <div key={i} className="w-full relative">
                          <TaskDropZone columnId={column.id} index={i} />

                          {i < column.tasks.length && (
                            <div className="pt-4">
                              <TodoCard
                                key={column.tasks[i].id}
                                columnId={column.id}
                                item={getters.getTaskById(column.tasks[i].id)}
                              />
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="px-3 pb-3 w-full relative">
                    <TaskDropZone columnId={column.id} index={0} />
                  </div>
                )}

                <ColumnFooter columnId={column.id} />
              </Column>
            </ColumnDropZone>
          </div>
        );
      })}

      <AddColumn />
    </div>
  );
}
