import { Skeleton } from "@heroui/react";

// Mirrors the portfolio shell so the layout doesn't jump when data arrives.
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-10" aria-busy="true" aria-label="Loading portfolio">
      <div className="glass-shell grid overflow-hidden rounded-4xl md:grid-cols-[232px_minmax(0,1fr)]">
        <aside className="hidden flex-col gap-6 border-r border-separator p-4 md:flex">
          <div className="flex items-center gap-3 px-1 pt-1">
            <Skeleton className="size-10 rounded-full" />
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-3 w-3/4 rounded-lg" />
              <Skeleton className="h-3 w-1/2 rounded-lg" />
            </div>
          </div>
          <div className="grid gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-8 rounded-xl" />
            ))}
          </div>
        </aside>
        <main className="flex min-w-0 flex-col gap-5 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="grid gap-2">
              <Skeleton className="h-8 w-56 rounded-xl" />
              <Skeleton className="h-3 w-72 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-40 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full max-w-lg rounded-2xl" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Skeleton className="col-span-2 h-80 rounded-3xl lg:row-span-2" />
            <Skeleton className="h-36 rounded-3xl" />
            <Skeleton className="h-36 rounded-3xl" />
            <Skeleton className="col-span-2 h-40 rounded-3xl" />
            <Skeleton className="col-span-2 h-56 rounded-3xl" />
            <Skeleton className="h-56 rounded-3xl" />
            <Skeleton className="h-56 rounded-3xl" />
          </div>
        </main>
      </div>
    </div>
  );
}
