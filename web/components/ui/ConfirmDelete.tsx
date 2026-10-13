"use client";

import { useState } from "react";
import { useUIStore } from "@/store/ui";
import { Button } from "./Button";
import { Dialog } from "./Dialog";

/**
 * Global confirm-delete modal. Rendered once (dashboard layout); opened via
 * `useUIStore().openConfirm({ title, description, onConfirm })`.
 */
export function ConfirmDelete() {
  const confirm = useUIStore((s) => s.confirm);
  const closeConfirm = useUIStore((s) => s.closeConfirm);
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    if (!confirm) return;
    setBusy(true);
    try {
      await confirm.onConfirm();
      closeConfirm();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={!!confirm}
      onClose={closeConfirm}
      title={confirm?.title ?? "Delete"}
      description={confirm?.description ?? "This action cannot be undone."}
      footer={
        <>
          <Button variant="secondary" onClick={closeConfirm} disabled={busy}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={busy}
            className="bg-red-600 text-white hover:brightness-110 dark:bg-red-500 dark:text-white"
          >
            {busy ? "Deleting…" : (confirm?.confirmLabel ?? "Delete")}
          </Button>
        </>
      }
    />
  );
}
