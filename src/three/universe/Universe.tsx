"use client";

/**
 * Universe — composition of every subsystem.
 *
 * The sky itself is now a real frescoed texture set as the scene background (see
 * SceneCanvas); this layer holds the moving, three-dimensional matter over it:
 * foreground dust, the gilded zodiac wheel and orbit lines, the planets, the
 * asteroid belt and the CV artifact. Quality scales to the device tier; motion
 * collapses to stillness under reduced motion.
 */
import { useThree } from "@react-three/fiber";
import type { TierBudget } from "@/hooks/useDeviceTier";
import { Starfield } from "./Starfield";
import { Nebula } from "./Nebula";
import { Dust } from "./Dust";
import { OrbitLines } from "./OrbitLines";
import { ZodiacWheel } from "./ZodiacWheel";
import { PlanetSystem } from "@/three/planets/PlanetSystem";
import { EntryParticles } from "@/three/planets/EntryParticles";
import { AsteroidBelt } from "@/three/skills/AsteroidBelt";
import { CvArtifact } from "@/three/artifacts/CvArtifact";

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
      {/* The realistic deep-space sky. */}
      <Starfield count={budget.particles} pixelRatio={pixelRatio} reducedMotion={reducedMotion} />
      {budget.allowHeavyShaders ? <Nebula reducedMotion={reducedMotion} /> : null}
      <Dust count={budget.particles} pixelRatio={pixelRatio} reducedMotion={reducedMotion} />
      <ZodiacWheel reducedMotion={reducedMotion} />
      <OrbitLines />
      <PlanetSystem reducedMotion={reducedMotion} coarse={coarse} budget={budget} onSelect={onSelect} />
      <EntryParticles budget={budget} reducedMotion={reducedMotion} />
      <AsteroidBelt reducedMotion={reducedMotion} budget={budget} />
      <CvArtifact reducedMotion={reducedMotion} />
    </group>
  );
}
