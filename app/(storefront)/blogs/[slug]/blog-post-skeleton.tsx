export function BlogPostSkeleton() {
  return (
    <main className="bg-paper px-5 pb-20 pt-28 sm:pt-32 lg:px-10 lg:pb-28">
      <div className="mx-auto max-w-3xl">
        <div className="h-3 w-24 animate-pulse rounded bg-ink/10" />
        <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-ink/10" />
        <div className="mt-8 aspect-video w-full animate-pulse rounded bg-ink/10" />
        <div className="mt-10 flex flex-col gap-3">
          <div className="h-4 w-full animate-pulse rounded bg-ink/10" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-ink/10" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-ink/10" />
        </div>
      </div>
    </main>
  );
}
