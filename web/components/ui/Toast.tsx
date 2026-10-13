"use client";

import { useUIStore } from "@/store/ui";
import { CloseIcon } from "./icons";

/** Bottom-right toast stack (design §7.11). Mounted once in the root layout. */
export function ToastViewport() {
  const toasts = useUIStore((s) => s.toasts);
  const dismiss = useUIStore((s) => s.dismissToast);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="glass toast-item pointer-events-auto flex items-start justify-between gap-3 px-4 py-3 text-sm text-fg"
        >
          <span className={toast.tone === "error" ? "text-red-600 dark:text-red-400" : ""}>
            {toast.message}
          </span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => dismiss(toast.id)}
            className="-m-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted hover:bg-fg/5 hover:text-fg"
          >
            <CloseIcon size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
