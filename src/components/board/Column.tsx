export function Column({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-80 flex-shrink-0 bg-slate-100 rounded-lg flex flex-col">
      {children}
    </div>
  );
}
