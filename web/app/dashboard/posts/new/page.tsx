import type { Metadata } from 'next';
import { PostEditor } from '@/components/dashboard/PostEditor';

export const instant = false;
export const metadata: Metadata = {
  title: 'New post',
  robots: { index: false, follow: false },
};

export default function NewPostPage() {
  return <PostEditor />;
}
