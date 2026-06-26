import { Search, SlidersHorizontal } from "lucide-react";
import { Input, Select } from "../ui/Input";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export function SearchFilters({ search, onSearch, children, onClear, resultLabel, placeholder = "Search by name or email" }: { search: string; onSearch: (value: string) => void; children?: React.ReactNode; onClear: () => void; resultLabel?: string; placeholder?: string }) {
  return (
    <div className="rounded-[1.45rem] border border-white/80 bg-white/78 p-2 shadow-card ring-1 ring-forest-900/[0.04]">
      <div className="flex flex-col gap-3 rounded-[1.1rem] bg-white p-3 xl:flex-row xl:items-center">
        <div className="relative min-w-[18rem] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/42" strokeWidth={1.8} />
          <Input className="h-11 rounded-2xl border-sage-200/80 bg-cream/55 pl-10 shadow-none" placeholder={placeholder} value={search} onChange={(e) => onSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-10 items-center gap-2 rounded-xl bg-sage-100 px-3 text-xs font-semibold text-forest-900/58">
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.8} />
            Filters
          </span>
          {children}
        </div>
        <div className="flex items-center justify-between gap-3 xl:justify-end">
          {resultLabel ? <span className="text-xs font-medium text-forest-900/50">{resultLabel}</span> : null}
          <Button variant="ghost" onClick={onClear}>Clear</Button>
        </div>
      </div>
    </div>
  );
}

export function FilterSelect({ value, onChange, options, label, className }: { value: string; onChange: (value: string) => void; label: string; options: string[]; className?: string }) {
  return (
    <Select className={cn("h-10 rounded-xl border-sage-200/80 bg-white shadow-card", className)} aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{label}</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </Select>
  );
}
