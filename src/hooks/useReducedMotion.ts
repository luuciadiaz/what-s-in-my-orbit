"use client";

/**
 * useReducedMotion
 *
 * Reactive access to the user's `prefers-reduced-motion` setting. Every motion
 * system in the experience — GSAP timelines, Framer variants, R3F ambient
 * loops — reads this to decide between the full cinematic path and the calm,
 * still atlas. Updates live if the user changes the OS setting.
 *
 * SSR-safe: returns `false` during server render and hydrates to the real value.
 */
import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
