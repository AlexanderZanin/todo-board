// import "./App.css";
import AppLayout from "../components/layout/AppLayout";
import TopBar from "../components/layout/TopBar";
import Board from "../components/board/Board";
import Column from "../components/board/Column";
import { ColumnHeader } from "../components/board/ColumnHeader";
import { ColumnFooter } from "../components/board/ColumnFooter";
import { AddColumn } from "../components/board/AddColumn";
import { TodoCard } from "../components/card/TodoCard";

export default function App() {
  return (
    <AppLayout>
      <TopBar />

      <Board>
        <Column>
          <ColumnHeader />
          <div className="p-3 space-y-3">
            <TodoCard title="Design UI" />
            <TodoCard title="Implement store logic" selected />
            <TodoCard title="Persist to localStorage" completed />
            <TodoCard title="Editing state example" editing />
          </div>
          <ColumnFooter />
        </Column>

        <AddColumn />
      </Board>
    </AppLayout>
  );
}
