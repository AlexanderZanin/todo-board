import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { RefObject } from "react";
import { useMenuPosition } from "../../hooks";

interface ColumnMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  // optional anchor ref to position menu relative to trigger; when provided
  // the menu will render into a portal so it won't be clipped by overflow.
  anchorRef?: RefObject<HTMLElement | null>;
}

export function BaseMenu({
  isOpen,
  onClose,
  children,
  anchorRef,
}: ColumnMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const pos = useMenuPosition(isOpen, anchorRef);

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

  const menu = (
    <div
      ref={ref}
      style={
        pos ? { position: "fixed", top: pos.top, left: pos.left } : undefined
      }
      className="w-44 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50"
    >
      {children}
    </div>
  );

  // if anchorRef provided render in portal to escape clipping; otherwise render inline
  if (anchorRef) {
    return createPortal(menu, document.body);
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50"
    >
      {children}
    </div>
  );
}
