import type { Ref } from "react";
import classNames from "classnames";

interface Props {
  ref?: Ref<HTMLButtonElement>;
  className?: string;
}

export function DragButton({ ref, className }: Props) {
  return (
    <button
      ref={ref}
      aria-label="Drag handle"
      className={classNames(
        "transition p-1 rounded hover:bg-slate-100 cursor-grab",
        className,
      )}
    >
      ≡
    </button>
  );
}
