"use client";

import { useEffect, useRef } from "react";
import { CloseIcon } from "./icons";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
};

/**
 * Minimal modal on the native <dialog> element (design §7.10):
 * focus trap + Esc come from `showModal()`, backdrop click closes,
 * focus returns to the previously focused element on close.
 */
export function Dialog({ open, onClose, title, description, children, footer, maxWidth = "max-w-md" }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      returnFocusRef.current = document.activeElement as HTMLElement;
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleClose = () => {
      returnFocusRef.current?.focus?.();
      onClose();
    };
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      onClick={(e) => {
        // Clicks on the backdrop hit the dialog element itself.
        if (e.target === ref.current) ref.current?.close();
      }}
      className={`w-[calc(100vw-2rem)] ${maxWidth} rounded-2xl bg-transparent p-0 backdrop:bg-black/50`}
      aria-labelledby={`${title.replace(/\s+/g, "-").toLowerCase()}-dialog-title`}
    >
      <div className="glass dialog-panel p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id={`${title.replace(/\s+/g, "-").toLowerCase()}-dialog-title`}
              className="text-lg font-semibold text-fg"
            >
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close dialog"
            className="-m-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted hover:bg-fg/5 hover:text-fg"
          >
            <CloseIcon size={18} />
          </button>
        </div>
        {children && <div className="mt-4">{children}</div>}
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </dialog>
  );
}
