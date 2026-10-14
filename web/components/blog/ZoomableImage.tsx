'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '@/components/ui/icons';

type Props = {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
};

/**
 * Click-to-fullscreen image component for blog articles, project previews, & covers.
 * Uses React Portal to mount to document.body so CSS filters/transforms on ancestor
 * containers (like .glass backdrop-filter) do not trap or blur the fullscreen dialog.
 */
export function ZoomableImage({ src, alt = '', className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const modal = open && mounted
    ? createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt || 'Full screen image'}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8"
        >
          {/* Dim backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"
            onClick={() => setOpen(false)}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close full screen view"
            className="absolute top-4 right-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-xs transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
          >
            <CloseIcon size={20} />
          </button>

          {/* Image Container */}
          <div
            className="relative z-10 flex max-h-[92vh] max-w-[95vw] flex-col items-center justify-center"
            onClick={() => setOpen(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl cursor-zoom-out"
            />
            {alt && (
              <p className="mt-3 text-center text-xs text-white/80 select-none">
                {alt}
              </p>
            )}
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-accent"
        title="Click to view full screen"
        aria-label={alt ? `Enlarge image: ${alt}` : 'Enlarge image'}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`transition-transform duration-200 group-hover:brightness-[1.03] ${className}`}
        />
        <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
          Click to expand
        </span>
      </button>

      {modal}
    </>
  );
}
