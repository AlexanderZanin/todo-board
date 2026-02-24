export function BaseLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <svg
          className="animate-spin h-12 w-12 text-indigo-600"
          viewBox="0 0 50 50"
          role="img"
          aria-label="Loading"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            strokeWidth="5"
            fill="none"
            style={{ stroke: "rgba(99,102,241,0.12)" }}
          />
          <path
            d="M25 5 a20 20 0 0 1 0 40"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <span className="text-sm text-slate-600">Loading…</span>
      </div>
    </div>
  );
}
