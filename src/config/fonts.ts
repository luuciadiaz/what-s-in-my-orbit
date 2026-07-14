/**
 * TYPOGRAPHY SYSTEM — "What's in my Orbit?"
 *
 * Fonts are NEVER hardcoded in components. Every typeface is referenced through
 * a CSS variable (`--font-display`, etc.). To re-brand the whole site you swap
 * the four `fontFamilies` values below and nothing else changes.
 *
 * Four roles:
 *   display — the hero voice. Large, editorial, characterful.
 *   heading — section titles.
 *   body    — reading text.
 *   caption — labels, metadata, small mono-ish detail.
 *
 * Plus configurable spacing (type scale) and letterspacing scales.
 * The actual @font-face / next/font wiring lives in the app layout; this file
 * is the contract everything else reads.
 */

/**
 * Font family stacks, exposed as CSS variables. The variable NAME is the stable
 * contract; the value here is the fallback stack. When real display/heading
 * fonts are added (via next/font), they populate the same variable name.
 */
export const fontFamilies = {
  display: {
    var: "--font-display",
    fallback: "'Cormorant Garamond', 'Times New Roman', serif",
  },
  heading: {
    var: "--font-heading",
    fallback: "'Cormorant Garamond', Georgia, serif",
  },
  body: {
    var: "--font-body",
    fallback: "'EB Garamond', Georgia, serif",
  },
  caption: {
    var: "--font-caption",
    fallback:
      "'Spectral', ui-monospace, 'SFMono-Regular', 'Courier New', monospace",
  },
} as const;

/**
 * Type scale — a modular scale (ratio ~1.25, "major third") expressed in rem.
 * Named steps keep call sites intention-revealing instead of magic numbers.
 */
export const fontSize = {
  caption: "0.75rem",
  small: "0.875rem",
  body: "1rem",
  lead: "1.25rem",
  h4: "1.5rem",
  h3: "1.953rem",
  h2: "2.441rem",
  h1: "3.815rem",
  display: "clamp(3rem, 8vw, 7.5rem)",
  displayHero: "clamp(3.5rem, 11vw, 11rem)",
} as const;

/** Line-heights tuned for editorial breathing room. */
export const lineHeight = {
  tight: "1.05",
  snug: "1.2",
  normal: "1.5",
  relaxed: "1.7",
} as const;

/** Font weights available across the type roles. */
export const fontWeight = {
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
} as const;

/**
 * Letterspacing scale. Antique display type wants generous tracking on small
 * caps/labels and near-zero on large display sizes.
 */
export const letterSpacing = {
  tightest: "-0.03em",
  tight: "-0.01em",
  normal: "0",
  wide: "0.05em",
  wider: "0.12em",
  /** For all-caps captions and mystical labels. */
  widest: "0.28em",
} as const;

export type FontRole = keyof typeof fontFamilies;
export type FontSizeKey = keyof typeof fontSize;

/** Font-related CSS custom properties injected at the root. */
export const fontCssVars: Record<string, string> = {
  [fontFamilies.display.var]: fontFamilies.display.fallback,
  [fontFamilies.heading.var]: fontFamilies.heading.fallback,
  [fontFamilies.body.var]: fontFamilies.body.fallback,
  [fontFamilies.caption.var]: fontFamilies.caption.fallback,
};
