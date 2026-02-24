import { useEffect, useState } from "react";
import { AppLayout, TopBar } from "../components/layout";
import { Board } from "../components/board";
import { initToDoStorage } from "./storageInit";

export default function App() {
  const [isStorageInitialized, setIsStorageInitialized] = useState(false);

  useEffect(() => {
    initToDoStorage().then(() => {
      setIsStorageInitialized(true);
    });
  }, []);

  return (
    <AppLayout>
      <TopBar />
      {isStorageInitialized && <Board />}
    </AppLayout>
  );
}
