"use client";

/**
 * PlanetSystem — the composed solar arrangement.
 *
 * Owns interaction state and renders every world from config. Two interaction
 * models share one code path:
 *   • fine pointer (desktop) — hover reveals a world, click enters it;
 *   • coarse pointer (touch) — a first tap reveals the world's name, a second
 *     tap enters it (guided exploration, since there is no hover).
 *
 * Navigation is delegated up via `onSelect` (created outside the Canvas so the
 * router context survives the WebGL reconciler boundary). Mesh detail scales to
 * the device tier.
 */
import { useState } from "react";
import { PLANETS } from "@/config/planets";
import type { TierBudget } from "@/hooks/useDeviceTier";
import { useAtlas } from "@/state/atlasStore";
import { Planet } from "./Planet";
import { Sun } from "./Sun";
import { CelestialBillboard } from "./CelestialBillboard";

interface PlanetSystemProps {
  reducedMotion: boolean;
  coarse: boolean;
  budget: TierBudget;
  onSelect: (slug: string) => void;
}

const SEGMENTS: Record<TierBudget["tier"], number> = { low: 24, medium: 40, high: 48 };

export function PlanetSystem({ reducedMotion, coarse, budget, onSelect }: PlanetSystemProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const { phase } = useAtlas();
  const paused = phase !== "idle";
  const segments = SEGMENTS[budget.tier];

  const isActive = (slug: string) => (coarse ? focused === slug : hovered === slug);

  // Fine pointer: enter on click. Coarse: reveal on first tap, enter on second.
  const activate = (slug: string) => {
    if (!coarse) return onSelect(slug);
    if (focused === slug) onSelect(slug);
    else setFocused(slug);
  };

  return (
    <group>
      {PLANETS.map((config) => {
        const shared = {
          config,
          active: isActive(config.slug),
          reducedMotion,
          paused,
          onHover: setHovered,
          onActivate: activate,
        };
        if (config.texture) {
          return <CelestialBillboard key={config.slug} {...shared} />;
        }
        return config.isCenter ? (
          <Sun key={config.slug} {...shared} />
        ) : (
          <Planet key={config.slug} {...shared} segments={segments} />
        );
      })}
    </group>
  );
}
