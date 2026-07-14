"use client";

/**
 * Universe — composition of every ambient subsystem.
 *
 * This is where the atlas's living backdrop is assembled: stars, dust, nebula,
 * constellations and golden orbit lines. Quality scales to the device tier —
 * heavy nebula shaders are dropped on low-end hardware to protect the frame
 * budget — and all motion collapses to stillness under reduced-motion.
 *
 * Phase 1 owns the ambience only. The camera (Phase 2) and planets (Phase 4+)
 * are added as siblings later; nothing here needs to change to accommodate them.
 */
import { useThree } from "@react-three/fiber";
import type { TierBudget } from "@/hooks/useDeviceTier";
import { Starfield } from "./Starfield";
import { Dust } from "./Dust";
import { Nebula } from "./Nebula";
import { Constellations } from "./Constellations";
import { OrbitLines } from "./OrbitLines";

interface UniverseProps {
  budget: TierBudget;
  reducedMotion: boolean;
}

export function Universe({ budget, reducedMotion }: UniverseProps) {
  // Clamp the DPR the shaders scale their point sizes by, matching the renderer.
  const pixelRatio = Math.min(useThree((s) => s.viewport.dpr), budget.maxDpr);

  return (
    <group>
      <Starfield
        count={budget.particles}
        pixelRatio={pixelRatio}
        reducedMotion={reducedMotion}
      />
      <Dust
        count={budget.particles}
        pixelRatio={pixelRatio}
        reducedMotion={reducedMotion}
      />
      {/* Nebula is the heaviest pass — only on tiers that can afford it. */}
      {budget.allowHeavyShaders ? <Nebula reducedMotion={reducedMotion} /> : null}
      <Constellations reducedMotion={reducedMotion} />
      <OrbitLines reducedMotion={reducedMotion} />
    </group>
  );
}
