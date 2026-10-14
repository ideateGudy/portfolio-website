import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Modern loading animation state with spinning pulse indicator and skeleton structure
 * instead of plain text.
 */
export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-center px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        {/* Modern multi-ring pulse spinner */}
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full bg-accent/20 duration-1000" />
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-line border-t-accent" />
          <div className="absolute h-3 w-3 rounded-full bg-accent" />
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <span className="font-mono text-xs font-semibold tracking-wider text-accent uppercase">Loading</span>
          <span className="text-xs text-muted">Preparing content…</span>
        </div>
      </div>

      {/* Ghost skeleton placeholders to eliminate layout shift */}
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <div className="glass flex flex-col gap-4 p-6">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="glass flex flex-col gap-4 p-6">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}

