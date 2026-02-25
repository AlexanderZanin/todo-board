import type { Task } from "../../models";
import { useBoard } from "../../hooks";
import type { JSX } from "react";

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
  const { state } = useBoard();

  const getTitleWithSearchMatches = () => {
    const searchRegex = new RegExp(state.searchQuery, "i");
    const matches = item.title.match(searchRegex);

    const matchedSubstring = matches?.[0];

    if (matchedSubstring) {
      const remainingParts = item.title.split(searchRegex);

      return remainingParts.reduce(
        (acc: (string | JSX.Element)[], part, index) => {
          acc.push(part);

          if (index < remainingParts.length - 1) {
            acc.push(
              <span key={index} className="bg-yellow-200 shadow-sm">
                {matchedSubstring}
              </span>,
            );
          }
          return acc;
        },
        [],
      );
    }

    return item.title;
  };

  return (
    <div className="flex items-start gap-2">
      <input
        type="checkbox"
        checked={isCompleted}
        className="mt-1 accent-indigo-600"
        onChange={onChange}
      />
      <p
        title={item.title}
        className={`${isCompleted ? "line-through text-slate-500 " : ""}min-w-0 overflow-hidden text-ellipsis`}
      >
        {getTitleWithSearchMatches()}
      </p>
    </div>
  );
}
