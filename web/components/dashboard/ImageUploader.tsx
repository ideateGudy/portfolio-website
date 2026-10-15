'use client';

import { useRef, useState } from 'react';
import { adminApi } from '@/lib/dashboard-api';
import { useUIStore } from '@/store/ui';
import { Button } from '@/components/ui/Button';

export type UploadFolder = 'portfolio/posts' | 'portfolio/projects' | 'portfolio/profile';

/**
 * Cloudinary image uploader (PRD §5.4): picks a file, uploads through the API,
 * and hands the returned URL back via onUploaded. No files stored locally.
 */
export function ImageUploader({
  value,
  onUploaded,
  folder = 'portfolio/posts',
  label = 'Image',
}: {
  value: string;
  onUploaded: (url: string) => void;
  folder?: UploadFolder;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const toast = useUIStore((s) => s.toast);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await adminApi.upload(file, folder);
      onUploaded(url);
      toast('Image uploaded');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Upload failed', 'error');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-fg">{label}</span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            type="button"
            variant="secondary"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            {busy ? 'Uploading…' : 'Upload to Cloudinary'}
          </Button>
          <span className="text-xs text-muted">or</span>
        </div>

        {/* Already have a URL? Paste it — full width on mobile, expands on desktop */}
        <div className="flex flex-1 items-center gap-2 min-w-0 w-full">
          <input
            type="url"
            inputMode="url"
            value={value}
            onChange={(e) => onUploaded(e.target.value.trim())}
            placeholder="https://…/image.png (paste URL)"
            aria-label={`${label} URL`}
            className="h-11 min-w-0 w-full flex-1 rounded-xl border border-line bg-transparent px-3 text-sm text-fg placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
          {value && (
            <button
              type="button"
              onClick={() => onUploaded('')}
              className="shrink-0 text-xs font-medium text-muted hover:text-red-600 dark:hover:text-red-400 px-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      {value && (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-12 w-12 rounded-md object-cover" />
          <span className="truncate font-mono text-xs text-muted">{value}</span>
        </div>
      )}
    </div>
  );
}
