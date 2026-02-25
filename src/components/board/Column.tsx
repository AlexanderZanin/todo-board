export function Column({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-56 sm:w-64 md:w-80 shrink-0 bg-slate-100 rounded-lg flex flex-col">
      {children}
    </div>
  );
}
