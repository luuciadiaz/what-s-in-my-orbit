"use client";

/**
 * Universe — composition of every subsystem.
 *
 * The sky itself is a real starfield texture set as the scene background (see
 * SceneCanvas); this layer holds the moving, three-dimensional matter over it:
 * foreground dust, the thin orbit lines, and the five realistic discipline
 * planets. Quality scales to the device tier; motion collapses to stillness
 * under reduced motion.
 */
import { useThree } from "@react-three/fiber";
import type { TierBudget } from "@/hooks/useDeviceTier";
import { Dust } from "./Dust";
import { OrbitLines } from "./OrbitLines";
import { PlanetSystem } from "@/three/planets/PlanetSystem";
import { EntryParticles } from "@/three/planets/EntryParticles";

interface UniverseProps {
  budget: TierBudget;
  reducedMotion: boolean;
  coarse: boolean;
  onSelect: (slug: string) => void;
}

export function Universe({ budget, reducedMotion, coarse, onSelect }: UniverseProps) {
  const pixelRatio = Math.min(useThree((s) => s.viewport.dpr), budget.maxDpr);

  return (
    <group>
      {/* The sky is the real starfield photograph (set as scene.background in
          SceneCanvas). Only subtle foreground dust drifts over it here. */}
      <Dust count={budget.particles} pixelRatio={pixelRatio} reducedMotion={reducedMotion} />
      <OrbitLines />
      <PlanetSystem reducedMotion={reducedMotion} coarse={coarse} budget={budget} onSelect={onSelect} />
      <EntryParticles budget={budget} reducedMotion={reducedMotion} />
    </group>
  );
}
