import { Button } from "../ui/Button";
import type { PaginationMeta } from "../../types/api";

export function Pagination({ pagination, page, setPage }: { pagination?: PaginationMeta; page: number; setPage: (page: number) => void }) {
  const totalPages = pagination?.totalPages || 1;
  return (
    <div className="flex flex-col gap-3 border-t border-sage-200/70 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="text-forest-900/62">Page <span className="font-semibold tabular text-forest-950">{page}</span> of <span className="font-semibold tabular text-forest-950">{totalPages}</span>{pagination?.totalItems != null ? <span className="ml-2 text-forest-900/45">({pagination.totalItems} records)</span> : null}</span>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
        <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
      </div>
    </div>
  );
}
