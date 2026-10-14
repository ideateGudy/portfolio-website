import { BlogNavbar } from '@/components/site/BlogNavbar';
import { Skeleton } from '@/components/ui/Skeleton';

export default function BlogListLoading() {
  return (
    <div>
      <BlogNavbar />
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {/* Header skeleton */}
        <header className="max-w-2xl">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="mt-4 h-10 w-3/4 sm:h-12" />
          <Skeleton className="mt-3 h-5 w-full" />
          <Skeleton className="mt-2 h-5 w-4/5" />
        </header>

        {/* Tag pills skeleton */}
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>

        {/* Post cards grid skeleton (6 placeholders) */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass flex h-full flex-col overflow-hidden rounded-2xl border border-line">
              <Skeleton className="aspect-16/10 w-full rounded-none" />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-20 rounded-full" />
                </div>
                <Skeleton className="mt-3 h-6 w-5/6" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-4/5" />
                <div className="mt-6 flex items-center gap-3 pt-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

