export function ColumnHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white rounded-t-lg">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold">In Progress</h2>
        <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">3</span>
      </div>

      {/* Three dots */}
      <div className="relative">
        <button className="p-1 rounded hover:bg-slate-200">⋯</button>

        {/* Open dropdown state */}
        <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50">
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100">
            Rename column
          </button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100">
            Select all tasks
          </button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100">
            Clear completed
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">
            Delete column
          </button>
        </div>
      </div>
    </div>
  );
}
