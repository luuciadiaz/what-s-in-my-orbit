/**
 * CONSTELLATION FIGURES — configuration.
 *
 * The illustrated constellations scattered through the far sky. Each entry is
 * placed on the background shell and drawn either from its procedural
 * placeholder (`id` → src/three/art/constellationArt.ts) OR from your own art.
 *
 * ── To use your own figure ──────────────────────────────────────────────────
 * 1. Drop the file into  public/art/constellations/  (SVG preferred, or PNG
 *    with transparency). See that folder's README for art guidance.
 * 2. Set `src` below to the filename, e.g.  src: "cygnus.svg".
 * That's the only change — the placeholder is replaced automatically.
 */

export interface ConstellationFigure {
  /** Placeholder builder key (constellationArt.ts). */
  id: string;
  /** Accessible name. */
  name: string;
  /** Override art filename in /public/art/constellations, or null for placeholder. */
  src: string | null;
  /** Spherical placement on the far shell. */
  theta: number;
  phi: number;
  radius: number;
  /** World size of the figure plane. */
  scale: number;
  /** Base opacity — kept faint so figures read as background murals. */
  opacity: number;
}

export const CONSTELLATIONS: ConstellationFigure[] = [
  { id: "cygnus", name: "Cygnus, the Swan", src: null, theta: 0.6, phi: 0.8, radius: 58, scale: 34, opacity: 0.85 },
  { id: "taurus", name: "Taurus, the Bull", src: null, theta: 2.2, phi: 1.1, radius: 58, scale: 34, opacity: 0.8 },
  { id: "sagittarius", name: "Sagittarius, the Archer", src: null, theta: 3.5, phi: 0.7, radius: 58, scale: 34, opacity: 0.8 },
  { id: "ursaMajor", name: "Ursa Major, the Great Bear", src: null, theta: 4.7, phi: 1.15, radius: 58, scale: 38, opacity: 0.85 },
  { id: "lyra", name: "Lyra, the Lyre", src: null, theta: 5.7, phi: 0.9, radius: 58, scale: 32, opacity: 0.85 },
];
