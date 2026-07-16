/**
 * PLANET CONFIGURATION
 *
 * The physical composition of the atlas: Origin as a luminous world at the
 * centre, the five disciplines orbiting it on the golden rings. Every visual
 * and motion property lives here — nothing about a planet is hardcoded in the
 * scene. Swapping the illustrated look later means changing colours/radii here,
 * not touching the components.
 *
 * Motion values are intentionally slow (celestial mechanics, not animation).
 */

import { planetColors } from "./colors";
import { projects } from "@/content/projects";
import { about } from "@/content/about";
import type { Glyph } from "@/content/types";

export interface PlanetConfig {
  slug: string;
  label: string;
  discipline: string;
  glyph: Glyph;
  /** Palette-driven surface + glow colours. */
  colorCore: string;
  colorGlow: string;
  /** Sphere radius in scene units. */
  radius: number;
  /** Distance from Origin. 0 = the centre world. */
  orbitRadius: number;
  /** Tilt of this planet's orbital plane (radians). */
  orbitTilt: number;
  /** Starting angle on the orbit (radians). */
  startAngle: number;
  /** Revolution speed around Origin (radians/sec). */
  orbitSpeed: number;
  /** Axial spin speed (radians/sec). */
  spinSpeed: number;
  /** Saturn wears rings. */
  hasRing: boolean;
  /** The centre world is fixed and self-luminous. */
  isCenter: boolean;
  /** Optional real art in /public/art/planets; when set, rendered as a billboard. */
  texture?: string;
}

/** Tuning per discipline — dynamics chosen to echo each planet's character. */
const ORBIT_TUNING: Record<
  string,
  Pick<PlanetConfig, "radius" | "orbitRadius" | "orbitTilt" | "startAngle" | "orbitSpeed" | "spinSpeed" | "hasRing">
> = {
  // ☿ fast, small, dynamic
  mercury: { radius: 0.55, orbitRadius: 7, orbitTilt: 0.34, startAngle: 0.4, orbitSpeed: 0.055, spinSpeed: 0.5, hasRing: false },
  // ♀ soft, warm, unhurried
  venus: { radius: 0.95, orbitRadius: 10.5, orbitTilt: 0.26, startAngle: 2.1, orbitSpeed: 0.04, spinSpeed: 0.18, hasRing: false },
  // ♂ bold, contrasty
  mars: { radius: 0.72, orbitRadius: 14, orbitTilt: 0.44, startAngle: 4.0, orbitSpeed: 0.03, spinSpeed: 0.3, hasRing: false },
  // ♃ massive, slow, grand
  jupiter: { radius: 1.7, orbitRadius: 19.5, orbitTilt: 0.3, startAngle: 5.4, orbitSpeed: 0.018, spinSpeed: 0.12, hasRing: false },
  // ♄ precise geometry, beautiful rings
  saturn: { radius: 1.3, orbitRadius: 26, orbitTilt: 0.52, startAngle: 1.1, orbitSpeed: 0.012, spinSpeed: 0.16, hasRing: true },
};

/** Real art filenames in /public/art/planets (swap freely). */
const TEXTURES: Record<string, string> = {
  origin: "sun.webp",
  mercury: "mercury.jpeg",
  venus: "venus.webp",
  mars: "mars.webp",
  jupiter: "jupiter.webp",
  // saturn: pending file on disk — stays procedural (with rings) until added.
};

/** Origin — the centre world where About/Contact live. */
const origin: PlanetConfig = {
  slug: "origin",
  label: about.title,
  discipline: about.subtitle,
  glyph: about.glyph,
  colorCore: planetColors.origin.core,
  colorGlow: planetColors.origin.glow,
  radius: 1.9,
  orbitRadius: 0,
  orbitTilt: 0,
  startAngle: 0,
  orbitSpeed: 0,
  spinSpeed: 0.06,
  hasRing: false,
  isCenter: true,
  texture: TEXTURES.origin,
};

/** The orbiting disciplines, derived from project content + tuning. */
const disciplines: PlanetConfig[] = projects.map((p) => {
  const t = ORBIT_TUNING[p.planet];
  const colors = planetColors[p.planet];
  return {
    slug: p.slug,
    label: p.title,
    discipline: p.discipline,
    glyph: p.glyph,
    colorCore: colors.core,
    colorGlow: colors.glow,
    ...t,
    isCenter: false,
    texture: TEXTURES[p.planet],
  };
});

/** Every world in the atlas. Origin first, then outward. */
export const PLANETS: PlanetConfig[] = [origin, ...disciplines];
