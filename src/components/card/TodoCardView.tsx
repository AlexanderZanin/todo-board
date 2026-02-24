import type { Task } from "../../models";

interface TodoCardViewProps {
  isCompleted?: boolean;
  onChange?: () => void;
  item: Task;
}
export function TodoCardView({
  isCompleted,
  onChange,
  item,
}: TodoCardViewProps) {
  return (
    <div className="flex items-start gap-2">
      <input
        type="checkbox"
        checked={isCompleted}
        className="mt-1 accent-indigo-600"
        onChange={onChange}
      />
      <p className={`${isCompleted ? "line-through text-slate-500" : ""}`}>
        {item.title}
      </p>
    </div>
  );
}
