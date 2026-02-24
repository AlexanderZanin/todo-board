import { useState, useRef, useEffect } from "react";
import { useBoard } from "../../hooks";

export function AddColumn() {
  const { actions } = useBoard();
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setValue("");
      }
    }

    if (isOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 0);
  }, [isOpen]);

  function submit() {
    const name = value.trim();
    if (!name) return;
    actions.addColumn(name);
    setIsOpen(false);
    setValue("");
  }

  return (
    <div className="w-80 flex-shrink-0" ref={ref}>
      {!isOpen ? (
        <button
          className="w-full bg-white border border-dashed border-slate-300 rounded-lg py-3 text-sm text-slate-500 hover:bg-slate-100 transition cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          + Add another column
        </button>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") {
                setIsOpen(false);
                setValue("");
              }
            }}
            placeholder="Column name"
            className="w-full px-2 py-1 border border-slate-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={submit}
              disabled={!value.trim()}
            >
              OK
            </button>

            <button
              className="px-3 py-1 rounded text-sm text-slate-600 bg-slate-100 hover:bg-slate-200"
              onClick={() => {
                setIsOpen(false);
                setValue("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
