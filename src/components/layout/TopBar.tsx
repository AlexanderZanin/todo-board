export function TopBar() {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
      <h1 className="text-2xl font-semibold tracking-tight">Todo Board</h1>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <input
          placeholder="Search tasks..."
          className="w-full sm:w-64 px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex gap-2">
          <button className="px-3 py-2 text-sm rounded-md bg-indigo-600 text-white">
            All
          </button>
          <button className="px-3 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-100">
            Active
          </button>
          <button className="px-3 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-100">
            Completed
          </button>
        </div>
      </div>
    </div>
  );
}
