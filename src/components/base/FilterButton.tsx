import type { Ref } from "react";
import classNames from "classnames";

interface Props {
  ref?: Ref<HTMLButtonElement>;
  className?: string;
  isActive?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function FilterButton({
  ref,
  className,
  isActive,
  children,
  onClick,
}: Props) {
  return (
    <button
      ref={ref}
      className={classNames(
        "px-3 py-2 text-sm rounded-md cursor-pointer",
        isActive
          ? "bg-indigo-600 text-white"
          : "border border-slate-300 hover:bg-slate-100",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
