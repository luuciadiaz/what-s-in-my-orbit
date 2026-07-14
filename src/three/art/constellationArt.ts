/**
 * CONSTELLATION ART — procedural placeholders.
 *
 * Gold line-art figures in the spirit of an illuminated celestial chart: a star
 * asterism (the real connect-the-dots pattern) wrapped in a loose engraved
 * gesture of the myth. These are PLACEHOLDERS — each maps to a figure the user
 * can override by dropping their own SVG/PNG into /public/art/constellations
 * (see the config in src/config/constellations.ts).
 *
 * Every figure is a function of the palette so the gild always matches.
 */

interface FigureColors {
  gold: string;
  goldBright: string;
}

const SIZE = 512;

/** Registry of placeholder figures, keyed by id. */
export const FIGURE_BUILDERS: Record<string, (c: FigureColors) => string> = {
  cygnus: cygnus,
  taurus: taurus,
  sagittarius: sagittarius,
  ursaMajor: ursaMajor,
  lyra: lyra,
};

/** Swan / Northern Cross. */
function cygnus({ gold, goldBright }: FigureColors): string {
  return wrap(
    gold,
    `
    <g opacity="0.5">
      <path d="M256 90 C300 78 300 118 280 136"/>
      <path d="M110 250 C180 214 224 238 256 254"/>
      <path d="M402 250 C332 214 288 238 256 254"/>
    </g>
    <g opacity="0.85">
      <path d="M256 96 L256 428"/>
      <path d="M110 250 L402 250"/>
    </g>
    ${stars(goldBright, [[256, 96], [256, 254], [256, 428], [110, 250], [402, 250]])}
  `,
  );
}

/** Bull's head with horns (Taurus / the Hyades). */
function taurus({ gold, goldBright }: FigureColors): string {
  return wrap(
    gold,
    `
    <g opacity="0.85">
      <path d="M118 150 C168 92 232 120 256 198"/>
      <path d="M394 150 C344 92 280 120 256 198"/>
    </g>
    <g opacity="0.5">
      <path d="M200 208 C188 300 220 366 256 366 C292 366 324 300 312 208"/>
      <path d="M236 300 q20 16 40 0"/>
    </g>
    ${stars(goldBright, [[118, 150], [394, 150], [256, 198], [216, 250], [300, 258]])}
  `,
  );
}

/** The archer's bow (Sagittarius). */
function sagittarius({ gold, goldBright }: FigureColors): string {
  return wrap(
    gold,
    `
    <g opacity="0.85">
      <path d="M186 116 C120 200 120 312 186 396"/>
      <path d="M186 116 L186 396"/>
    </g>
    <g opacity="0.6">
      <path d="M150 256 L372 256"/>
      <path d="M372 256 l-26 -14 M372 256 l-26 14"/>
    </g>
    ${stars(goldBright, [[186, 116], [186, 396], [186, 256], [300, 256], [372, 256]])}
  `,
  );
}

/** The Great Bear / the Plough (Ursa Major). */
function ursaMajor({ gold, goldBright }: FigureColors): string {
  const dipper: [number, number][] = [
    [140, 320], [206, 322], [214, 384], [150, 382],
    [206, 322], [268, 288], [332, 306], [396, 270],
  ];
  return wrap(
    gold,
    `
    <g opacity="0.45">
      <path d="M120 350 C210 300 320 302 402 246 C432 246 442 268 420 286"/>
      <path d="M150 384 l-10 40 M214 384 l6 42 M332 306 l4 44 M396 270 l0 44"/>
    </g>
    <g opacity="0.85">
      <polyline points="${dipper.map((p) => p.join(",")).join(" ")}" />
    </g>
    ${stars(goldBright, dipper)}
  `,
  );
}

/** The lyre (Lyra / Vega). */
function lyra({ gold, goldBright }: FigureColors): string {
  return wrap(
    gold,
    `
    <g opacity="0.8">
      <path d="M198 150 C158 210 158 328 210 402"/>
      <path d="M322 150 C362 210 362 328 310 402"/>
      <path d="M198 150 L322 150"/>
      <path d="M210 402 L310 402"/>
    </g>
    <g opacity="0.5">
      <path d="M232 168 L238 388 M260 166 L260 390 M288 168 L282 388"/>
    </g>
    ${stars(goldBright, [[260, 118], [198, 150], [322, 150], [210, 402], [310, 402]])}
  `,
  );
}

/** Star nodes as small filled circles. */
function stars(color: string, points: [number, number][]): string {
  return points
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${color}"/>`)
    .join("");
}

/** Common SVG frame with gold stroke defaults. */
function wrap(stroke: string, inner: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" fill="none" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}
