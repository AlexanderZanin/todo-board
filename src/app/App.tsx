import { useEffect } from "react";
import { AppLayout, TopBar } from "../components/layout";
import { Board } from "../components/board";
import { initToDoStorage } from "./storageInit";

export default function App() {
  useEffect(() => {
    initToDoStorage();
  }, []);

  return (
    <AppLayout>
      <TopBar />
      <Board />
    </AppLayout>
  );
}
