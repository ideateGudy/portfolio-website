'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeSanitize from 'rehype-sanitize';
import { markdownComponents, sanitizeSchema } from '@/lib/markdown-shared';

/**
 * Dashboard live preview (PRD §5.4): "same renderer as the public page".
 * Shares the exact component overrides + sanitize schema with the public
 * article body; only the async shiki highlighter is omitted (it's server-only
 * and would bloat the client bundle per §10). Everything else matches.
 */
export function ArticleBody({ content }: { content: string }) {
  return (
    <div className="prose-article">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeSanitize, sanitizeSchema]]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
