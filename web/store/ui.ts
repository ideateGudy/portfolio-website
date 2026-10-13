import { create } from "zustand";

export type Toast = {
  id: number;
  message: string;
  tone: "success" | "error";
};

/** Payload for the confirm-delete dialog opened via `useUIStore`. */
export type ConfirmRequest = {
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
};

type UIState = {
  toasts: Toast[];
  toast: (message: string, tone?: Toast["tone"]) => void;
  dismissToast: (id: number) => void;

  confirm: ConfirmRequest | null;
  openConfirm: (request: ConfirmRequest) => void;
  closeConfirm: () => void;

  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;

  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

let toastId = 0;

export const useUIStore = create<UIState>()((set, get) => ({
  toasts: [],
  toast: (message, tone = "success") => {
    const id = ++toastId;
    set({ toasts: [...get().toasts, { id, message, tone }] });
    setTimeout(() => get().dismissToast(id), 3000);
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

  confirm: null,
  openConfirm: (request) => set({ confirm: request }),
  closeConfirm: () => set({ confirm: null }),

  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
