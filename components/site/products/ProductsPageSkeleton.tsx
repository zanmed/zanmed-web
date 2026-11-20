export function ProductPageSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-lg bg-ink/5" />
      ))}
    </div>
  );
}
