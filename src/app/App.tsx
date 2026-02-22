// import "./App.css";
import { AppLayout, TopBar } from "../components/layout";
import {
  Board,
  Column,
  ColumnHeader,
  ColumnFooter,
  AddColumn,
} from "../components/board";
import { TodoCard } from "../components/card";
import { TaskDropZone } from "../components/board/TaskDropZone";
import { ColumnDropZone } from "../components/board/ColumnDropZone";
import { useBoard } from "../hooks";

export default function App() {
  const { state } = useBoard();

  return (
    <AppLayout>
      <TopBar />

      <Board>
        {state.columnOrder.map((colId, colIndex) => {
          const column = state.columnsWithTasks.find((c) => c.id === colId)!;

          return (
            <div className="flex items-start" key={colId}>
              <ColumnDropZone index={colIndex} />

              <Column>
                <ColumnHeader columnId={colId} />

                {Boolean(column.tasks.length) && (
                  <div className="p-3">
                    {/** Drop before first, between and after tasks */}
                    {Array.from({ length: column.tasks.length + 1 }).map(
                      (_, i) => (
                        <div key={i} className="w-full">
                          <TaskDropZone columnId={colId} index={i} />

                          {i < column.tasks.length && (
                            <div className="py-1">
                              <TodoCard
                                key={column.tasks[i].id}
                                taskId={column.tasks[i].id}
                                columnId={colId}
                                title={column.tasks[i].title}
                                isCompleted={
                                  column.tasks[i].status === "completed"
                                }
                              />
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                )}

                <ColumnFooter columnId={column.id} />
              </Column>
            </div>
          );
        })}

        {/* Drop zone at end for columns */}
        <ColumnDropZone index={state.columnOrder.length} />

        <AddColumn />
      </Board>
    </AppLayout>
  );
}
