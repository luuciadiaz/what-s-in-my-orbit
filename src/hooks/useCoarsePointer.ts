"use client";

/**
 * useCoarsePointer
 *
 * True on touch-first devices (no hover). The atlas uses this to switch from the
 * desktop hover model to guided exploration on mobile: a first tap reveals a
 * world's name, a second tap enters it — so nothing depends on hovering.
 *
 * SSR-safe: false on the server, resolves after mount.
 */
import { useEffect, useState } from "react";

const QUERY = "(pointer: coarse)";

export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    setCoarse(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setCoarse(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return coarse;
}
