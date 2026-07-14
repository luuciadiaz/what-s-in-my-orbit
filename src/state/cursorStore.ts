"use client";

/**
 * CURSOR STORE
 *
 * A one-boolean external store for whether the pointer is over something
 * interactive. The WebGL planets (inside the Canvas) publish hover here, and the
 * DOM astrolabe cursor (outside the Canvas) reads it to react — a clean bridge
 * across the reconciler boundary without prop drilling.
 */
import { useSyncExternalStore } from "react";

let hovering = false;
const listeners = new Set<() => void>();

export function setHovering(next: boolean) {
  if (hovering === next) return;
  hovering = next;
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useHovering(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => hovering,
    () => false,
  );
}
