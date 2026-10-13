import { MarkdownAsync } from 'react-markdown';
import { connection } from 'next/server';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSanitize from 'rehype-sanitize';
import { markdownComponents, sanitizeSchema } from './markdown-shared';

/** Server-rendered article body: GFM + anchored headings + shiki highlighting. */
export async function ArticleBody({ markdown }: { markdown: string }) {
  // rehype-pretty-code initializes Shiki with Date.now(), which must happen
  // after the request boundary when Cache Components are enabled.
  await connection();

  return (
    <div className="prose-article">
      <MarkdownAsync
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypePrettyCode, { theme: 'github-dark', keepBackground: true }],
          [rehypeSanitize, sanitizeSchema, { clobberPrefix: '' }],
        ]}
        components={markdownComponents}
      >
        {markdown}
      </MarkdownAsync>
    </div>
  );
}
