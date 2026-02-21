import { useBoard } from "../../hooks";

export function AddColumn() {
  const { actions } = useBoard();

  return (
    <div className="w-80 flex-shrink-0">
      <button
        className="w-full bg-white border border-dashed border-slate-300 rounded-lg py-3 text-sm text-slate-500 hover:bg-slate-100 transition"
        onClick={() => actions.addColumn("New Column")}
      >
        + Add another column
      </button>
    </div>
  );
}
