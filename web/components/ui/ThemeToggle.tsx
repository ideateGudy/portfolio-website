"use client";

import { useSyncExternalStore } from "react";
import { useThemeStore } from "@/store/theme";
import { MoonIcon, SunIcon } from "./icons";

// Hydration detection without setState-in-effect (lint-clean).
const subscribe = () => () => {};
const getHydrated = () => true;
const getServerHydrated = () => false;

/** Sun/moon toggle. Renders a neutral icon until hydrated to avoid mismatch. */
export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const hydrated = useSyncExternalStore(subscribe, getHydrated, getServerHydrated);

  const isDark =
    hydrated &&
    (theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches));

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:bg-fg/5 hover:text-fg"
    >
      {hydrated ? (
        isDark ? (
          <MoonIcon size={18} />
        ) : (
          <SunIcon size={18} />
        )
      ) : (
        <span className="block h-[18px] w-[18px]" aria-hidden />
      )}
    </button>
  );
}
