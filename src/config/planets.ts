/**
 * PLANET CONFIGURATION
 *
 * The physical composition of the atlas: five discipline-worlds, with Brand
 * Strategy as the large planet at the centre and the others orbiting it. Every
 * visual and motion property lives here — nothing about a planet is hardcoded in
 * the scene, so re-styling a world means editing ONE entry below (its colours,
 * surface style, size, orbit), never a component or shader.
 *
 * Surface colours read low → high: for rocky worlds that is ocean → land →
 * highland (plus polar ice); for gas giants it is the dark → mid → light bands.
 *
 * Motion values are intentionally slow (celestial mechanics, not animation).
 */

import { projectBySlug } from "@/content/projects";

/**
 * A single off-scene sun lights every planet, so day/night is consistent. It
 * sits up-and-right but mostly toward the viewer, so every world keeps a lit,
 * visible face (a gentle terminator on the lower-left limb) wherever it orbits —
 * matching the storyboard, where no planet falls into full silhouette.
 */
export const SUN_DIRECTION: [number, number, number] = [0.34, 0.42, 0.84];

export interface PlanetSurface {
  /** "rocky" = oceans/land/ice; "gas" = banded atmosphere. */
  style: "rocky" | "gas";
  /** Oceans / darkest bands. */
  colorLow: string;
  /** Land / mid bands. */
  colorMid: string;
  /** Highlands / lightest bands. */
  colorHigh: string;
  /** Ice caps (rocky only). */
  colorPole: string;
  /** Feature frequency — higher = smaller, busier features. */
  noiseScale: number;
  /** 0 → soft, 1 → sharp contrast between features. */
  contrast: number;
  /** Any number — changes the continents/bands without touching anything else. */
  seed: number;
}

export interface RingConfig {
  /** Inner/outer radius as a multiple of the planet radius. */
  inner: number;
  outer: number;
  color: string;
  /** Ring plane tilt (radians). */
  tilt: number;
}

export interface PlanetConfig {
  slug: string;
  label: string;
  discipline: string;
  /** Sphere radius in scene units. */
  radius: number;
  /** Distance from the centre. 0 = the centre world. */
  orbitRadius: number;
  /** Tilt of this planet's orbital plane (radians). */
  orbitTilt: number;
  /** Starting angle on the orbit (radians). */
  startAngle: number;
  /** Revolution speed around the centre (radians/sec). */
  orbitSpeed: number;
  /** Axial spin speed (radians/sec). */
  spinSpeed: number;
  /** The centre world sits still at the origin. */
  isCenter: boolean;
  /** Fresnel atmosphere-rim colour. */
  atmosphere: string;
  /** Procedural surface definition. */
  surface: PlanetSurface;
  /** Optional drifting cloud veil (rocky worlds). */
  clouds?: boolean;
  /** Optional ring system (gas giants). */
  ring?: RingConfig;
  /**
   * Optional real photograph in /public/art/planets. When set, the world is
   * drawn as a billboard from the photo (real Drive imagery, colours intact)
   * instead of the procedural surface — see TEXTURES below to reassign.
   */
  texture?: string;
}

/**
 * Real planet photographs (in /public/art/planets), mapped per discipline.
 * Swap a filename to move a photo to a different world; delete an entry to send
 * that world back to its procedural surface. Saturn's photo already carries its
 * rings, so its procedural ring is dropped when the photo is used.
 */
const TEXTURES: Record<string, string> = {
  "brand-strategy": "jupiter.webp", // the giant at the centre
  events: "mars.webp",
  pr: "venus.webp",
  "content-social": "saturn.webp", // real rings
  campaigns: "mercury.webp",
  // spare on disk: sun.webp
};

/**
 * The five worlds. Order = order of discovery. Edit any block to restyle a
 * planet — colours and `surface` fully define its look.
 */
const WORLDS: Omit<PlanetConfig, "label" | "discipline">[] = [
  {
    // Brand Strategy & Creative Direction — the blue-grey giant at the centre.
    slug: "brand-strategy",
    radius: 2.0,
    orbitRadius: 0,
    orbitTilt: 0,
    startAngle: 0,
    orbitSpeed: 0,
    spinSpeed: 0.05,
    isCenter: true,
    atmosphere: "#6f9fd6",
    clouds: true,
    surface: {
      style: "rocky",
      colorLow: "#16324f",
      colorMid: "#4a6076",
      colorHigh: "#9aacbe",
      colorPole: "#e2ebf3",
      noiseScale: 3.0,
      contrast: 0.55,
      seed: 12.3,
    },
  },
  {
    // Events — warm beige desert world. (upper-left)
    slug: "events",
    radius: 0.95,
    orbitRadius: 10,
    orbitTilt: 0.48,
    startAngle: 2.6,
    orbitSpeed: 0,
    spinSpeed: 0.28,
    isCenter: false,
    atmosphere: "#e8d9b8",
    surface: {
      style: "rocky",
      colorLow: "#8a6f45",
      colorMid: "#bd9d6a",
      colorHigh: "#e2cd9e",
      colorPole: "#efe7d3",
      noiseScale: 4.2,
      contrast: 0.6,
      seed: 4.1,
    },
  },
  {
    // PR — soft rose world. (lower-left)
    slug: "pr",
    radius: 0.86,
    orbitRadius: 12,
    orbitTilt: 0.18,
    startAngle: 4.2,
    orbitSpeed: 0,
    spinSpeed: 0.3,
    isCenter: false,
    atmosphere: "#eaa7b6",
    surface: {
      style: "rocky",
      colorLow: "#9a4f5c",
      colorMid: "#c87c8a",
      colorHigh: "#ecbcc5",
      colorPole: "#f7e4e8",
      noiseScale: 3.4,
      contrast: 0.4,
      seed: 8.8,
    },
  },
  {
    // Content & Social Media — the ringed golden gas giant. (upper-right)
    slug: "content-social",
    radius: 1.3,
    orbitRadius: 15,
    orbitTilt: 0.48,
    startAngle: 0.22,
    orbitSpeed: 0,
    spinSpeed: 0.14,
    isCenter: false,
    atmosphere: "#e7c979",
    surface: {
      style: "gas",
      colorLow: "#9c7736",
      colorMid: "#c9a24b",
      colorHigh: "#efdba0",
      colorPole: "#efdba0",
      noiseScale: 9.0,
      contrast: 0.5,
      seed: 21.0,
    },
    ring: { inner: 1.45, outer: 2.55, color: "#d8c48a", tilt: 0.34 },
  },
  {
    // Campaigns — verdant world. (lower-right)
    slug: "campaigns",
    radius: 1.0,
    orbitRadius: 13,
    orbitTilt: 0.26,
    startAngle: 5.8,
    orbitSpeed: 0,
    spinSpeed: 0.2,
    isCenter: false,
    atmosphere: "#79c48f",
    surface: {
      style: "rocky",
      colorLow: "#1f4d39",
      colorMid: "#3f7a55",
      colorHigh: "#8cbb81",
      colorPole: "#ddefda",
      noiseScale: 3.4,
      contrast: 0.55,
      seed: 15.6,
    },
  },
];

/** Every world, with label/discipline pulled from content (single source). */
export const PLANETS: PlanetConfig[] = WORLDS.map((w) => {
  const project = projectBySlug[w.slug];
  const texture = TEXTURES[w.slug];
  // A photograph supplies its own body (and, for Saturn, its own rings), so drop
  // the procedural ring when a texture is in play.
  const ring = texture ? undefined : w.ring;
  return { ...w, ring, texture, label: project.title, discipline: project.discipline };
});
