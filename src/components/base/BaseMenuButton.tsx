import classNames from "classnames";

interface ColumnMenuProps {
  children?: React.ReactNode;
  isDanger?: boolean;
  isDisabled?: boolean;

  onClick?: () => void;
}

export function BaseMenuButton({
  children,
  isDanger,
  isDisabled,
  onClick,
}: ColumnMenuProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={classNames(
        "w-full text-left px-3 py-2 text-sm",
        { "cursor-pointer": !isDisabled },
        isDanger ? "text-red-600 hover:bg-red-50" : "hover:bg-slate-100",
        isDisabled ? "opacity-50 cursor-not-allowed" : "",
      )}
    >
      {children}
    </button>
  );
}
