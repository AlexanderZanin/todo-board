interface Props {
  title: string;
  isCompleted?: boolean;
  isSelected?: boolean;
  isEditing?: boolean;
}

export function TodoCard({ title, isCompleted, isSelected, isEditing }: Props) {
  return (
    <div
      className={`bg-white rounded-md p-3 border text-sm transition-all
        ${isSelected ? "border-indigo-500 ring-2 ring-indigo-200" : "border-slate-200"}
        ${isCompleted ? "opacity-70" : ""}
      `}
    >
      {isEditing ? (
        <input
          defaultValue={title}
          className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={isCompleted}
            readOnly
            className="mt-1 accent-indigo-600"
          />
          <p className={`${isCompleted ? "line-through text-slate-500" : ""}`}>
            {title}
          </p>
        </div>
      )}
    </div>
  );
}
