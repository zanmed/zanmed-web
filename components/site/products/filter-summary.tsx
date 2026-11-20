import { SlidersHorizontal, Check } from "lucide-react";

export function FilterSummary({ count }: { count: number }) {
  return (
    <div className="filter-summary">
      <SlidersHorizontal size={17} /> Showing <b>{count}</b> products{" "}
      <Check size={15} />
    </div>
  );
}
