import { useEffect } from "react";
import { AppLayout, TopBar } from "../components/layout";
import { Board } from "../components/board";
import { initBoardStore } from "./store-init";

export default function App() {
  useEffect(() => {
    initBoardStore();
  }, []);

  return (
    <AppLayout>
      <TopBar />
      <Board />
    </AppLayout>
  );
}
