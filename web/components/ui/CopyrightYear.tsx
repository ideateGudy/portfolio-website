"use client";

import { useEffect, useState } from "react";

/**
 * Current year for the copyright line, as a client island so the static
 * prerender never calls `new Date()` (Next.js "blocking prerender" guard).
 * Server and first client render both emit an empty span → no hydration
 * mismatch; the year fills in right after mount.
 */
export function CopyrightYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <>{year}</>;
}
