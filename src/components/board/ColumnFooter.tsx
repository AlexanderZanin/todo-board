import { useBoard } from "../../hooks";

interface Props {
  columnId: string;
}

export function ColumnFooter({ columnId }: Props) {
  const { actions } = useBoard();

  return (
    <div className="p-3">
      <button
        className="w-full text-sm text-indigo-600 hover:bg-indigo-50 rounded-md py-2 transition cursor-pointer"
        onClick={() => actions.addNewTask(columnId)}
      >
        + Add a card
      </button>
    </div>
  );
}
