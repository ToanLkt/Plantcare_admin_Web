import { EmptyState } from "../ui/State";
import { cn } from "../../lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
};

export function DataTable<T>({ columns, rows, loading, emptyTitle, emptyDescription, emptyAction }: { columns: Column<T>[]; rows?: T[]; loading?: boolean; emptyTitle: string; emptyDescription?: string; emptyAction?: React.ReactNode }) {
  if (loading) return <TableSkeleton columns={columns.length} />;
  if (!rows?.length) return <EmptyState title={emptyTitle} description={emptyDescription || "Adjust filters or refresh the page."} action={emptyAction} />;
  return (
    <div className="overflow-x-auto rounded-[1.05rem]">
      <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
        <thead className="bg-sage-100/70">
          <tr className="text-[11px] font-semibold uppercase tracking-[0.12em] text-forest-900/48">
            {columns.map((column) => <th className={cn("border-b border-sage-200/80 px-5 py-3.5", column.className)} key={column.key}>{column.header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="group transition duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-sage-100/45">
              {columns.map((column) => <td className={cn("border-b border-sage-200/65 px-5 py-4 align-middle text-forest-950", column.className)} key={column.key}>{column.render(row)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="overflow-hidden rounded-[1.05rem] border border-sage-200/70 bg-white">
      <div className="grid gap-3 bg-sage-100/70 p-4" style={{ gridTemplateColumns: `repeat(${Math.max(columns, 1)}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }).map((_, index) => <div key={index} className="h-3 animate-pulse rounded-full bg-sage-200/80" />)}
      </div>
      <div className="divide-y divide-sage-200/70 p-2">
        {Array.from({ length: 7 }).map((_, row) => (
          <div key={row} className="grid gap-3 px-3 py-4" style={{ gridTemplateColumns: `repeat(${Math.max(columns, 1)}, minmax(0, 1fr))` }}>
            {Array.from({ length: columns }).map((_, col) => <div key={col} className="h-4 animate-pulse rounded-full bg-sage-100" />)}
          </div>
        ))}
      </div>
    </div>
  );
}
