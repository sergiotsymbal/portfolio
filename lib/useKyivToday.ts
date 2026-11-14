"use client";

import { useSyncExternalStore } from "react";
import { kyivToday } from "@/data/events";

const noop = () => () => {};

/**
 * Today's date in Kyiv (YYYY-MM-DD) in the browser; null while rendering at build time / hydrating.
 * Components show the list computed at build time until this kicks in, then the up-to-date one —
 * so past events disappear even without a redeploy.
 */
export function useKyivToday(): string | null {
  return useSyncExternalStore(noop, () => kyivToday(), () => null);
}
