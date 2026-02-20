export default function Board({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-6 overflow-x-auto p-6">{children}</div>;
}
