import { useState } from "react";
import { ColumnMenu } from "./index";

export function ColumnHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white rounded-t-lg">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold">In Progress</h2>
        <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">3</span>
      </div>

      <div className="relative">
        <button
          className="p-1 rounded hover:bg-slate-200"
          onClick={() => setIsOpen(true)}
        >
          ⋯
        </button>

        <ColumnMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
}
