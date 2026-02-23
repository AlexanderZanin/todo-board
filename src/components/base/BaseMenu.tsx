import { useEffect, useRef } from "react";

interface ColumnMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function BaseMenu({ isOpen, onClose, children }: ColumnMenuProps) {
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
      {children}
    </div>
  );
}
