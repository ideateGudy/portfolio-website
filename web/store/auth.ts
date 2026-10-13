import { create } from "zustand";

export type AuthUser = {
  id: string;
  email: string;
  role: "ADMIN";
};

type AuthState = {
  user: AuthUser | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  fetchMe: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

async function handle(res: Response) {
  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      message = data?.message ?? message;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(message);
  }
  return res.json();
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  status: "idle",
  fetchMe: async () => {
    set({ status: "loading" });
    try {
      const user = await fetch("/backend/auth/me", { credentials: "include" }).then(handle);
      set({ user, status: "authenticated" });
    } catch {
      set({ user: null, status: "unauthenticated" });
    }
  },
  login: async (email, password) => {
    const user = await fetch("/backend/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    }).then(handle);
    set({ user, status: "authenticated" });
  },
  logout: async () => {
    await fetch("/backend/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => undefined);
    set({ user: null, status: "unauthenticated" });
  },
}));
