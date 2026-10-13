/** Shimmering skeleton block for loading states (PRD §5 shared components). */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`skeleton animate-pulse rounded-md bg-fg/10 ${className}`}
    />
  );
}

/** A skeleton card sized like a post/project card. */
export function SkeletonCard() {
  return (
    <div className="glass flex flex-col gap-3 p-5">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
