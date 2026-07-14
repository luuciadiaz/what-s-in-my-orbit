/**
 * COLOR SYSTEM — "What's in my Orbit?"
 *
 * The palette is drawn from antique celestial atlases and illuminated
 * manuscripts: deep pigments, gold leaf, aged ivory. There is no pure black
 * and no pure white — every value carries a subtle warmth or depth so the
 * surface always feels printed, never digital.
 *
 * Two layers:
 *   1. `palette`  — raw, named pigments. The single source of truth.
 *   2. `semantic` — role-based tokens that reference the palette. Components
 *                   consume THESE, never raw hex, so a re-theme touches one file.
 *
 * Nothing downstream should hardcode a hex value.
 */

/** Raw pigments. Named after the brief's palette. */
export const palette = {
  /** Deep Midnight Blue — the void, the base of the atlas. Never pure black. */
  midnight: "#0B1026",
  midnightDeep: "#070B1A",
  midnightSoft: "#141A38",

  /** Ultramarine — the classic manuscript blue, precious and saturated. */
  ultramarine: "#26389B",
  ultramarineLight: "#3B4FBF",

  /** Dusty Pink — faded rose of aged illustration. */
  dustyPink: "#C9A0A0",
  dustyPinkSoft: "#DDBDB8",

  /** Old Gold — illuminated leaf, primary accent. */
  gold: "#C9A24B",
  goldBright: "#E0C067",

  /** Ivory — aged paper, the "light" of the system. Never pure white. */
  ivory: "#F4ECD8",
  ivoryDim: "#D8CDB2",

  /** Antique Brass — instruments, astrolabe lines. */
  brass: "#B08D57",

  /** Copper — engraving shadow, warm depth. */
  copper: "#A9694B",
} as const;

/**
 * Semantic tokens — role-based. Components reference these.
 * Grouped by function so intent is legible at the call site.
 */
export const semantic = {
  background: {
    base: palette.midnight,
    deep: palette.midnightDeep,
    raised: palette.midnightSoft,
  },
  text: {
    primary: palette.ivory,
    secondary: palette.ivoryDim,
    muted: palette.dustyPink,
    inverse: palette.midnight,
  },
  accent: {
    /** Primary interactive / illuminated accent. */
    gold: palette.gold,
    goldBright: palette.goldBright,
    /** Secondary structural accent (orbit lines, instruments). */
    brass: palette.brass,
    copper: palette.copper,
    ultramarine: palette.ultramarine,
  },
  line: {
    /** Golden orbit lines, hairline rules. */
    orbit: palette.gold,
    hairline: palette.brass,
  },
  focus: {
    /** High-contrast keyboard focus ring — accessibility, never omitted. */
    ring: palette.goldBright,
  },
} as const;

/**
 * Per-planet signature colors. Each celestial world owns a distinct hue so
 * the atlas reads as composed, not random. Referenced by planet configs later.
 */
export const planetColors = {
  mercury: { core: palette.brass, glow: palette.goldBright },
  venus: { core: palette.dustyPink, glow: palette.dustyPinkSoft },
  mars: { core: palette.copper, glow: "#C77B54" },
  jupiter: { core: palette.gold, glow: palette.goldBright },
  saturn: { core: palette.ultramarine, glow: palette.ultramarineLight },
  origin: { core: palette.ivory, glow: palette.ivoryDim },
} as const;

export type PaletteKey = keyof typeof palette;
export type PlanetColorKey = keyof typeof planetColors;

/** Flattens a nested token object into `--prefix-key` CSS variables. */
function flatten(
  obj: Record<string, unknown>,
  prefix: string,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const varName = `${prefix}-${key}`;
    if (typeof value === "string") {
      out[varName] = value;
    } else if (value && typeof value === "object") {
      Object.assign(out, flatten(value as Record<string, unknown>, varName));
    }
  }
  return out;
}

/** All color tokens as CSS custom properties, injected once at the root. */
export const colorCssVars: Record<string, string> = {
  ...flatten(palette, "--color"),
  ...flatten(semantic, "--c"),
};
