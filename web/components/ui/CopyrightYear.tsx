"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Current year for the copyright line. Server emits null/empty,
 * then on client it syncs to the current year with zero hydration mismatch.
 */
export function CopyrightYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null,
  );

  return <>{year}</>;
}

