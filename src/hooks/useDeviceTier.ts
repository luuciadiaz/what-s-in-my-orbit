"use client";

/**
 * useDeviceTier
 *
 * Classifies the device into a quality tier so the WebGL layer can scale to the
 * hardware — particle counts, pixel-ratio clamp, shader complexity and LOD all
 * derive from this. This is how we honour "60 FPS" and "responsive WebGL"
 * without shipping the same heavy scene to a phone as to a workstation.
 *
 * The heuristic is deliberately conservative: when unsure, tier down. A scene
 * that runs cool everywhere beats a scene that dazzles on one machine and
 * stutters on the rest.
 */
import { useEffect, useState } from "react";

export type DeviceTier = "low" | "medium" | "high";

/** Per-tier budgets consumed by the universe/planet systems. */
export interface TierBudget {
  tier: DeviceTier;
  /** Upper bound on devicePixelRatio to render at (perf vs. sharpness). */
  maxDpr: number;
  /** Rough star/particle budget for the starfield. */
  particles: number;
  /** Whether expensive post-processing / heavy shaders are permitted. */
  allowHeavyShaders: boolean;
}

const BUDGETS: Record<DeviceTier, TierBudget> = {
  low: { tier: "low", maxDpr: 1, particles: 1500, allowHeavyShaders: false },
  medium: { tier: "medium", maxDpr: 1.5, particles: 5000, allowHeavyShaders: false },
  high: { tier: "high", maxDpr: 2, particles: 12000, allowHeavyShaders: true },
};

/** Classify using coarse, widely-supported signals. Errs toward lower tiers. */
function classify(): DeviceTier {
  if (typeof navigator === "undefined") return "medium";

  const cores = navigator.hardwareConcurrency ?? 4;
  // deviceMemory is non-standard but useful where present.
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const smallViewport = Math.min(window.innerWidth, window.innerHeight) < 768;

  // Touch-first, small, or memory-constrained → guided low tier.
  if ((coarsePointer && smallViewport) || memory <= 2 || cores <= 2) return "low";
  if (cores >= 8 && memory >= 8 && !coarsePointer) return "high";
  return "medium";
}

export function useDeviceTier(): TierBudget {
  // Start at "medium" so SSR and first paint agree; refine after mount.
  const [budget, setBudget] = useState<TierBudget>(BUDGETS.medium);

  useEffect(() => {
    setBudget(BUDGETS[classify()]);
  }, []);

  return budget;
}
