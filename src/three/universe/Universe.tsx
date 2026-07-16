"use client";

/**
 * Universe — composition of every subsystem.
 *
 * The living backdrop (stars, dust, nebula, constellations, orbit lines) plus
 * the planets themselves. Quality scales to the device tier; motion collapses
 * to stillness under reduced motion. Planet selection is delegated up via
 * `onSelect` so router navigation happens outside the WebGL reconciler.
 */
import { useThree } from "@react-three/fiber";
import type { TierBudget } from "@/hooks/useDeviceTier";
import { Starfield } from "./Starfield";
import { Dust } from "./Dust";
import { Nebula } from "./Nebula";
import { Constellations } from "./Constellations";
import { ConstellationFigures } from "./ConstellationFigures";
import { GoldStars } from "./GoldStars";
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
      <Starfield count={budget.particles} pixelRatio={pixelRatio} reducedMotion={reducedMotion} />
      <Dust count={budget.particles} pixelRatio={pixelRatio} reducedMotion={reducedMotion} />
      {budget.allowHeavyShaders ? <Nebula reducedMotion={reducedMotion} /> : null}
      <Constellations reducedMotion={reducedMotion} />
      <ConstellationFigures />
      <GoldStars />
      <ZodiacWheel reducedMotion={reducedMotion} />
      <OrbitLines />
      <PlanetSystem reducedMotion={reducedMotion} coarse={coarse} budget={budget} onSelect={onSelect} />
      <EntryParticles budget={budget} reducedMotion={reducedMotion} />
      <AsteroidBelt reducedMotion={reducedMotion} budget={budget} />
      <CvArtifact reducedMotion={reducedMotion} />
    </group>
  );
}
