"use client";

/**
 * PlanetSystem — the composed solar arrangement.
 *
 * Owns which world is currently hovered and renders every planet from config.
 * Navigation is delegated upward via `onSelect`: the handler is created outside
 * the Canvas (where Next's router context lives) and passed in, so entering a
 * world works despite the WebGL reconciler boundary.
 */
import { useState } from "react";
import { PLANETS } from "@/config/planets";
import { Planet } from "./Planet";

interface PlanetSystemProps {
  reducedMotion: boolean;
  onSelect: (slug: string) => void;
}

export function PlanetSystem({ reducedMotion, onSelect }: PlanetSystemProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <group>
      {PLANETS.map((config) => (
        <Planet
          key={config.slug}
          config={config}
          hovered={hovered === config.slug}
          reducedMotion={reducedMotion}
          onHover={setHovered}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
