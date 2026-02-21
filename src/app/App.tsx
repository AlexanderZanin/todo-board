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

export default function App() {
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
          <ColumnFooter />
        </Column>

        <AddColumn />
      </Board>
    </AppLayout>
  );
}
