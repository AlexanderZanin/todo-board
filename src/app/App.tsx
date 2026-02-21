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
import { useBoard } from "../hooks";

export default function App() {
  const { state } = useBoard();

  return (
    <AppLayout>
      <TopBar />

      <Board>
        <Column>
          <ColumnHeader />
          <div className="p-3 space-y-3">
            <TodoCard title="Design UI" />
            <TodoCard title="Implement store logic" isSelected />
            <TodoCard title="Persist to localStorage" isCompleted />
            <TodoCard title="Editing state example" isEditing />
          </div>
          <ColumnFooter columnId="1" />
        </Column>
        {state.columnsWithTasks.map((column) => (
          <Column key={column.id}>
            <ColumnHeader />
            {Boolean(column.tasks.length) && (
              <div className="p-3 space-y-3">
                {column.tasks.map((task) => (
                  <TodoCard key={task.id} title={task.title} />
                ))}
              </div>
            )}
            <ColumnFooter columnId={column.id} />
          </Column>
        ))}

        <AddColumn />
      </Board>
    </AppLayout>
  );
}
