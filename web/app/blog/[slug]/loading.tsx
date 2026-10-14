import { BlogNavbar } from '@/components/site/BlogNavbar';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ArticleLoading() {
  return (
    <div>
      <BlogNavbar />
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <article className="glass mx-auto max-w-4xl overflow-hidden rounded-2xl border border-line">
          {/* Cover image placeholder */}
          <Skeleton className="h-64 w-full rounded-none sm:h-80 md:h-96" />

          <div className="p-6 sm:p-10 md:p-12">
            <header className="mx-auto max-w-[68ch]">
              {/* Author badge placeholder */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              {/* Title placeholder */}
              <Skeleton className="h-10 w-full sm:h-12" />
              <Skeleton className="mt-3 h-10 w-4/5 sm:h-12" />

              {/* Tag placeholders */}
              <div className="mt-5 flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            </header>

            {/* Article content body lines placeholder */}
            <div className="mx-auto mt-10 max-w-[68ch] space-y-4 border-t border-line pt-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="py-2" />
              <Skeleton className="h-7 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-9/12" />
              <div className="py-2" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

