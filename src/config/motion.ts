/**
 * MOTION SYSTEM — "What's in my Orbit?"
 *
 * The motion language is celestial: floating, breathing, orbiting, slow
 * editorial transitions. Nothing bouncy, nothing playful — everything graceful.
 *
 * This file is the single source of durations and easings. GSAP timelines,
 * Framer Motion variants, and R3F `useFrame` interpolations all read from here
 * so the whole experience shares one rhythm. When `prefers-reduced-motion` is
 * set, consumers substitute the `reduced` variants (near-instant cross-fades,
 * no travel).
 */

/** Durations in seconds (GSAP/Three-friendly). Divide by 1s for ms if needed. */
export const duration = {
  instant: 0.15,
  fast: 0.35,
  base: 0.6,
  slow: 1.0,
  /** Cinematic camera flights between worlds. */
  cinematic: 1.8,
  /** Ambient loops — breathing stars, drifting nebula. */
  ambient: 8,
} as const;

/**
 * Easing curves as cubic-bezier arrays (also consumable by GSAP as strings).
 * Named for feel, not for math.
 */
export const easing = {
  /** Default editorial ease — calm in, calm out. */
  editorial: [0.22, 1, 0.36, 1],
  /** Gentle entrance. */
  glide: [0.16, 1, 0.3, 1],
  /** Symmetric, for breathing/floating loops. */
  breathe: [0.45, 0, 0.55, 1],
  /** Weighted settle for camera arrivals — decelerates like mass in orbit. */
  gravity: [0.3, 0.8, 0.2, 1],
} as const;

/** CSS-string form of the easings, for Tailwind / inline transitions. */
export const easingCss = {
  editorial: `cubic-bezier(${easing.editorial.join(",")})`,
  glide: `cubic-bezier(${easing.glide.join(",")})`,
  breathe: `cubic-bezier(${easing.breathe.join(",")})`,
  gravity: `cubic-bezier(${easing.gravity.join(",")})`,
} as const;

/** Stagger intervals (seconds) for sequenced reveals — constellations, lists. */
export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.16,
} as const;

/**
 * Reduced-motion substitutions. Consumers check the user preference and, when
 * set, use these instead — motion becomes a calm cross-fade with no travel.
 */
export const reduced = {
  duration: {
    base: 0.2,
    cinematic: 0.25,
  },
  /** Disable ambient loops entirely under reduced motion. */
  ambientEnabled: false,
} as const;

export type DurationKey = keyof typeof duration;
export type EasingKey = keyof typeof easing;

/** Motion tokens exposed as CSS variables for DOM-level transitions. */
export const motionCssVars: Record<string, string> = {
  "--motion-fast": `${duration.fast}s`,
  "--motion-base": `${duration.base}s`,
  "--motion-slow": `${duration.slow}s`,
  "--ease-editorial": easingCss.editorial,
  "--ease-glide": easingCss.glide,
  "--ease-breathe": easingCss.breathe,
  "--ease-gravity": easingCss.gravity,
};
