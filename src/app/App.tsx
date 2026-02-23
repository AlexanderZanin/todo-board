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
        {state.columnsWithTasks.map((column, colIndex) => {
          return (
            <div className="flex items-start" key={column.id}>
              <ColumnDropZone index={colIndex} />

              <Column>
                <ColumnHeader columnId={column.id} />

                {Boolean(column.tasks.length) && (
                  <div className="p-3">
                    {/** Drop before first, between and after tasks */}
                    {Array.from({ length: column.tasks.length + 1 }).map(
                      (_, i) => (
                        <div key={i} className="w-full">
                          <TaskDropZone columnId={column.id} index={i} />

                          {i < column.tasks.length && (
                            <div className="py-1">
                              <TodoCard
                                key={column.tasks[i].id}
                                columnId={column.id}
                                taskId={column.tasks[i].id}
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
