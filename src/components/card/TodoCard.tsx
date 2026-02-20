interface Props {
  title: string;
  completed?: boolean;
  selected?: boolean;
  editing?: boolean;
}

export function TodoCard({ title, completed, selected, editing }: Props) {
  return (
    <div
      className={`bg-white rounded-md p-3 border text-sm transition-all
        ${selected ? "border-indigo-500 ring-2 ring-indigo-200" : "border-slate-200"}
        ${completed ? "opacity-70" : ""}
      `}
    >
      {editing ? (
        <input
          defaultValue={title}
          className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={completed}
            readOnly
            className="mt-1 accent-indigo-600"
          />
          <p className={`${completed ? "line-through text-slate-500" : ""}`}>
            {title}
          </p>
        </div>
      )}
    </div>
  );
}
