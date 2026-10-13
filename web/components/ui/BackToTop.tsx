"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "./icons";

/** Round glass back-to-top button, appears after 600px of scroll (§7.14). */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }}
      className="glass fixed right-4 bottom-4 z-40 grid h-11 w-11 place-items-center rounded-full text-fg transition-colors hover:text-accent"
    >
      <ArrowUpIcon size={18} />
    </button>
  );
}
