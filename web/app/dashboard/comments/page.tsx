import { Suspense } from 'react';
import CommentsAdminClient from './CommentsAdminClient';

export default function CommentsAdminPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-sm text-muted">Loading comments…</p>}>
      <CommentsAdminClient />
    </Suspense>
  );
}

