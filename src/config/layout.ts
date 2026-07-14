/**
 * LAYOUT SYSTEM — "What's in my Orbit?"
 *
 * Spacing, breakpoints, z-index layering, container widths and radii.
 * The spacing scale is the rhythm of the editorial layout; the z-index scale
 * is the vertical order of the experience (canvas at the back, cursor on top).
 *
 * Consumers reference named tokens, never raw pixel/rem values.
 */

/** Spacing scale (rem). A soft geometric progression for generous whitespace. */
export const spacing = {
  none: "0",
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2.5rem",
  "2xl": "4rem",
  "3xl": "6.5rem",
  "4xl": "10rem",
  /** Editorial "breathing" gaps between project sections. */
  breath: "clamp(4rem, 12vh, 12rem)",
} as const;

/** Responsive breakpoints (px). Desktop is the premium tier. */
export const breakpoints = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
  wide: 1920,
} as const;

/** Max content widths for editorial measure (readable line length). */
export const container = {
  prose: "38rem",
  content: "72rem",
  wide: "90rem",
  full: "100%",
} as const;

/**
 * Z-index layers — the vertical stack of the experience, back to front.
 * Named so nothing ever invents an arbitrary `z-index: 9999`.
 */
export const zLayer = {
  canvas: 0,
  scene: 10,
  content: 20,
  hud: 30,
  overlay: 40,
  loader: 50,
  cursor: 60,
} as const;

/** Corner radii. Antique instruments favour near-square with soft relief. */
export const radius = {
  none: "0",
  sm: "2px",
  md: "4px",
  lg: "8px",
  full: "9999px",
} as const;

/** Standard content gutters, responsive. */
export const gutter = {
  inline: "clamp(1.25rem, 5vw, 6rem)",
} as const;

export type SpacingKey = keyof typeof spacing;
export type ZLayerKey = keyof typeof zLayer;

/** Layout tokens exposed as CSS variables. */
export const layoutCssVars: Record<string, string> = {
  "--gutter-inline": gutter.inline,
  "--container-prose": container.prose,
  "--container-content": container.content,
  "--z-canvas": String(zLayer.canvas),
  "--z-scene": String(zLayer.scene),
  "--z-content": String(zLayer.content),
  "--z-hud": String(zLayer.hud),
  "--z-loader": String(zLayer.loader),
  "--z-cursor": String(zLayer.cursor),
};
