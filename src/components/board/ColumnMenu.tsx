import { useEffect, useRef } from "react";

interface ColumnMenuProps {
  isOpen: boolean;
  onClose: () => void;

  onRename?: () => void;
  onSelectAll?: () => void;
  onClearCompleted?: () => void;
  onDelete?: () => void;
}

export function ColumnMenu({
  isOpen,
  onClose,
  onRename,
  onSelectAll,
  onClearCompleted,
  onDelete,
}: ColumnMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50"
    >
      <button
        onClick={onRename}
        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100"
      >
        Rename column
      </button>

      <button
        onClick={onSelectAll}
        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100"
      >
        Select all tasks
      </button>

      <button
        onClick={onClearCompleted}
        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100"
      >
        Clear completed
      </button>

      <div className="border-t border-slate-200 my-1" />

      <button
        onClick={onDelete}
        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        Delete column
      </button>
    </div>
  );
}
