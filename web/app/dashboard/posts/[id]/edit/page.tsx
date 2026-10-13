import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostEditor } from '@/components/dashboard/PostEditor';
import { getPostForAdmin } from '@/lib/admin-data';

export const instant = false;
export const metadata: Metadata = {
  title: 'Edit post',
  robots: { index: false, follow: false },
};

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostForAdmin(id);
  if (!post) notFound();
  return <PostEditor post={post} />;
}
