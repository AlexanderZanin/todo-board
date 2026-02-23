import classNames from "classnames";

interface ColumnMenuProps {
  children?: React.ReactNode;
  isDanger?: boolean;

  onClick?: () => void;
}

export function BaseMenuButton({ children, isDanger, onClick }: ColumnMenuProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "w-full text-left px-3 py-2 text-sm",
        isDanger ? "text-red-600 hover:bg-red-50" : "hover:bg-slate-100",
      )}
    >
      {children}
    </button>
  );
}
