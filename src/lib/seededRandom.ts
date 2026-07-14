/**
 * Deterministic pseudo-random generation.
 *
 * The universe must FEEL infinite but be carefully composed — the same,
 * intentional sky on every visit, and testable. We never call Math.random()
 * for placement; we seed a small, fast PRNG (mulberry32) so a given seed always
 * produces the identical arrangement of stars, dust and constellations.
 */

/** mulberry32 — a compact, high-quality 32-bit seeded PRNG. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A seeded random helper with range/pick conveniences. */
export class SeededRandom {
  private next: () => number;

  constructor(seed: number) {
    this.next = mulberry32(seed);
  }

  /** Float in [0, 1). */
  float(): number {
    return this.next();
  }

  /** Float in [min, max). */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** Signed float in [-magnitude, magnitude). */
  signed(magnitude = 1): number {
    return (this.next() * 2 - 1) * magnitude;
  }

  /** Integer in [min, max]. */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  /** Random element of an array. */
  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }
}

/** Stable seeds so each subsystem is reproducible and independently tunable. */
export const SEEDS = {
  stars: 20240119,
  dust: 778201,
  constellations: 141592,
  orbits: 265358,
} as const;
