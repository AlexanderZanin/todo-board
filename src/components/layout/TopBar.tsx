import { useBoard } from "../../hooks";
import { FilterButton } from "../base";

export function TopBar() {
  const { state, filtersSelection, actions } = useBoard();

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
      <h1 className="text-2xl font-semibold tracking-tight">Todo Board</h1>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <input
          value={state.searchQuery}
          placeholder="Search tasks..."
          className="w-full sm:w-64 px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => actions.setSearchQuery(e.target.value)}
        />

        <div className="flex gap-2">
          <FilterButton
            isActive={filtersSelection.isAll}
            onClick={() => actions.setFilter("all")}
          >
            All
          </FilterButton>
          <FilterButton
            isActive={filtersSelection.isActive}
            onClick={() => actions.setFilter("active")}
          >
            Active
          </FilterButton>
          <FilterButton
            isActive={filtersSelection.isCompleted}
            onClick={() => actions.setFilter("completed")}
          >
            Completed
          </FilterButton>
        </div>
      </div>
    </div>
  );
}
