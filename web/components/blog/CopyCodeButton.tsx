"use client";

import { useState } from "react";

/** Copy button floating on every code block; copies the rendered code text. */
export function CopyCodeButton() {
  const [copied, setCopied] = useState(false);

  const copy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const block = e.currentTarget.closest(".codeblock");
    const text = block?.querySelector("pre")?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="absolute top-2.5 right-2.5 z-10 rounded-md border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-xs text-neutral-300 opacity-0 transition-opacity duration-150 focus-visible:opacity-100 [.codeblock:hover_&]:opacity-100 [.codeblock:focus-within_&]:opacity-100"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}
