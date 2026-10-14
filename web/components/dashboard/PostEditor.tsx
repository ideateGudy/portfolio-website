'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, type AdminPost } from '@/lib/dashboard-api';
import { useEditorStore, type PostDraft } from '@/store/editor';
import { useUIStore } from '@/store/ui';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from './ImageUploader';
import { ArticleBody } from '@/components/blog/ArticleBody';

/** Wrap the selection (or insert a snippet) into the Markdown textarea. */
function wrap(
  ta: HTMLTextAreaElement,
  before: string,
  after = '',
  placeholder = 'text',
): { value: string; caret: number } {
  const { selectionStart: s, selectionEnd: e, value } = ta;
  const selected = value.slice(s, e) || placeholder;
  const next = value.slice(0, s) + before + selected + after + value.slice(e);
  return { value: next, caret: s + before.length + selected.length + after.length };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** ISO → datetime-local value (no seconds). */
function toLocalInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toDraft(post: AdminPost): PostDraft {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    tags: post.tags.join(', '),
    coverUrl: post.coverUrl ?? '',
    coverAlt: post.coverAlt ?? '',
    content: post.content,
    status: post.status,
    publishedAt: post.publishedAt ? toLocalInput(post.publishedAt) : '',
    canonicalUrl: post.canonicalUrl ?? '',
  };
}


/**
 * Create/Edit post form (PRD §5.4). `post` present → editing; otherwise creating.
 * Autosaves the draft to localStorage via the editor store (cleared on save).
 */
export function PostEditor({ post }: { post?: AdminPost }) {
  const router = useRouter();
  const { draft, setDraft, resetDraft } = useEditorStore();
  const toast = useUIStore((s) => s.toast);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(() => !!post);
  const [backdate, setBackdate] = useState(() => !!post?.publishedAt);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    if (post) {
      resetDraft(toDraft(post));
    }
  }, [post, resetDraft]);

  useEffect(() => {
    if (slugTouched) return;
    setDraft({ slug: slugify(draft.title) });
  }, [draft.title, slugTouched, setDraft]);

  const tags = useMemo(
    () => draft.tags.split(',').map((t) => t.trim()).filter(Boolean),
    [draft.tags],
  );

  const applyEdit = useCallback((before: string, after = '', placeholder = 'text') => {
    const ta = taRef.current;
    if (!ta) return;
    const { value, caret } = wrap(ta, before, after, placeholder);
    setDraft({ content: value });
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(caret, caret);
    });
  }, [setDraft]);


  // Insert an inline image at the cursor: paste a URL, or upload to Cloudinary.
  const inlineFileRef = useRef<HTMLInputElement>(null);
  const [inlineBusy, setInlineBusy] = useState(false);
  function insertInlineImage(url: string, alt = 'image') {
    const ta = taRef.current;
    const md = `![${alt}](${url})\n`;
    if (!ta) {
      setDraft({ content: `${draft.content}\n${md}` });
      return;
    }
    const { selectionStart: s, selectionEnd: e, value } = ta;
    setDraft({ content: value.slice(0, s) + md + value.slice(e) });
    requestAnimationFrame(() => {
      ta.focus();
      const pos = s + md.length;
      ta.setSelectionRange(pos, pos);
    });
  }
  async function onInlineFile(file: File | undefined) {
    if (!file) return;
    setInlineBusy(true);
    try {
      const { url } = await adminApi.upload(file, 'portfolio/posts');
      insertInlineImage(url, file.name.replace(/\.[^.]+$/, '') || 'image');
      toast('Image inserted');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Upload failed', 'error');
    } finally {
      setInlineBusy(false);
      if (inlineFileRef.current) inlineFileRef.current.value = '';
    }
  }

  async function onSave(publish: boolean) {
    setError(null);
    if (!draft.title.trim()) {
      setError('Title is required');
      return;
    }
    setBusy(true);
    try {
      const body: Record<string, unknown> = {
        title: draft.title.trim(),
        slug: draft.slug.trim() || undefined,
        excerpt: draft.excerpt,
        content: draft.content,
        coverUrl: draft.coverUrl || undefined,
        coverAlt: draft.coverAlt || undefined,
        tags,
        publish,
        canonicalUrl: draft.canonicalUrl.trim() || undefined,
      };
      if (backdate && draft.publishedAt) body.publishedAt = new Date(draft.publishedAt).toISOString();

      if (post?.id) await adminApi.posts.update(post.id, body);
      else await adminApi.posts.create(body);

      resetDraft();
      toast(publish ? 'Post published' : 'Draft saved');
      router.push('/dashboard/posts');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setBusy(false);
    }
  }

  const TOOLBAR_ACTIONS = [
    { label: 'B', title: 'Bold', action: 'bold' },
    { label: 'I', title: 'Italic', action: 'italic' },
    { label: 'H2', title: 'Heading 2', action: 'h2' },
    { label: 'H3', title: 'Heading 3', action: 'h3' },
    { label: 'Link', title: 'Link', action: 'link' },
    { label: 'Quote', title: 'Quote', action: 'quote' },
    { label: '• List', title: 'Bullet list', action: 'ul' },
    { label: '1. List', title: 'Numbered list', action: 'ol' },
    { label: '`code`', title: 'Inline code', action: 'code' },
    { label: '{}', title: 'Code block', action: 'codeblock' },
  ] as const;

  const handleToolbar = (action: (typeof TOOLBAR_ACTIONS)[number]['action']) => {
    switch (action) {
      case 'bold':
        applyEdit('**', '**', 'bold');
        break;
      case 'italic':
        applyEdit('_', '_', 'italic');
        break;
      case 'h2':
        applyEdit('\n## ', '\n', 'Heading');
        break;
      case 'h3':
        applyEdit('\n### ', '\n', 'Heading');
        break;
      case 'link':
        applyEdit('[', '](https://)', 'label');
        break;
      case 'quote':
        applyEdit('\n> ', '\n', 'quote');
        break;
      case 'ul':
        applyEdit('\n- ', '\n', 'item');
        break;
      case 'ol':
        applyEdit('\n1. ', '\n', 'item');
        break;
      case 'code':
        applyEdit('`', '`', 'code');
        break;
      case 'codeblock':
        applyEdit('\n```ts\n', '\n```\n', '// code');
        break;
    }
  };


  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // No submit button uses this anymore; Enter falls back to saving a draft.
        void onSave(false);
      }}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          {post ? 'Edit post' : 'New post'}
        </h1>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" disabled={busy} onClick={() => void onSave(false)}>
            Save draft
          </Button>
          <Button type="button" disabled={busy} onClick={() => void onSave(true)}>
            {busy ? 'Saving…' : 'Publish'}
          </Button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-600/40 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <Input
        label="Title"
        value={draft.title}
        onChange={(e) => setDraft({ title: e.target.value })}
        placeholder="An irresistible headline"
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Slug"
          value={draft.slug}
          onChange={(e) => {
            setSlugTouched(true);
            setDraft({ slug: e.target.value });
          }}
          placeholder="auto-from-title"
        />
        <Input
          label="Tags (comma-separated)"
          value={draft.tags}
          onChange={(e) => setDraft({ tags: e.target.value })}
          placeholder="aws, devops, node"
        />
      </div>

      <Textarea
        label="Excerpt"
        value={draft.excerpt}
        onChange={(e) => setDraft({ excerpt: e.target.value })}
        placeholder="One or two sentences shown in listings."
        rows={2}
      />

      <ImageUploader
        label="Cover image"
        folder="portfolio/posts"
        value={draft.coverUrl}
        onUploaded={(url) => setDraft({ coverUrl: url })}
      />
      {draft.coverUrl && (
        <Input
          label="Cover alt text"
          value={draft.coverAlt}
          onChange={(e) => setDraft({ coverAlt: e.target.value })}
          placeholder="Describe the cover for accessibility & SEO"
        />
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-fg">Content (Markdown)</span>
          <div className="flex rounded-full border border-line p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setTab('write')}
              className={`rounded-full px-3 py-1 ${tab === 'write' ? 'bg-accent/10 text-accent' : 'text-muted'}`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setTab('preview')}
              className={`rounded-full px-3 py-1 ${tab === 'preview' ? 'bg-accent/10 text-accent' : 'text-muted'}`}
            >
              Preview
            </button>
          </div>
        </div>

        {tab === 'write' ? (
          <>
            <div className="flex flex-wrap gap-1">
              {TOOLBAR_ACTIONS.map((b) => (
                <button
                  key={b.title}
                  type="button"
                  title={b.title}
                  onClick={() => handleToolbar(b.action)}
                  className="rounded-lg border border-line px-2.5 py-1 text-xs text-muted hover:bg-fg/5 hover:text-fg"
                >
                  {b.label}
                </button>
              ))}
              {/* Inline image: upload to Cloudinary and insert ![alt](url) at cursor. */}
              <input
                ref={inlineFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void onInlineFile(e.target.files?.[0])}
              />
              <button
                type="button"
                title="Insert image at cursor"
                disabled={inlineBusy}
                onClick={() => inlineFileRef.current?.click()}
                className="rounded-lg border border-line px-2.5 py-1 text-xs text-muted hover:bg-fg/5 hover:text-fg disabled:opacity-50"
              >
                {inlineBusy ? 'Uploading…' : 'Image'}
              </button>
            </div>
            <textarea
              ref={taRef}
              value={draft.content}
              onChange={(e) => setDraft({ content: e.target.value })}
              rows={16}
              placeholder="Write your article in Markdown…"
              className="w-full rounded-xl border border-line bg-transparent px-4 py-3 font-mono text-sm text-fg placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </>
        ) : (
          <div className="glass min-h-40 rounded-xl p-4">
            {draft.content.trim() ? (
              <ArticleBody content={draft.content} />
            ) : (
              <p className="text-sm text-muted">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-fg">
            <input
              type="checkbox"
              checked={backdate}
              onChange={(e) => {
                setBackdate(e.target.checked);
                if (!e.target.checked) setDraft({ publishedAt: '' });
              }}
              className="h-4 w-4"
            />
            Use a past published date
          </label>
          {backdate ? (
            <Input
              label="Published date"
              type="datetime-local"
              value={draft.publishedAt}
              onChange={(e) => setDraft({ publishedAt: e.target.value })}
            />
          ) : (
            <p className="text-xs text-muted">
              Off → the post is stamped with “now” at the moment you publish.
            </p>
          )}
        </div>
        <Input
          label="Canonical URL (optional — e.g. dev.to)"
          value={draft.canonicalUrl}
          onChange={(e) => setDraft({ canonicalUrl: e.target.value })}
          placeholder="https://dev.to/…"
        />
      </div>
      <p className="-mt-2 text-xs text-muted">
        Back-dating stores and displays that exact date publicly. Future dates are rejected by the API.
      </p>
    </form>
  );
}
