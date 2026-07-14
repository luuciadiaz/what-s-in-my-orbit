/**
 * SUN ART
 *
 * Vector art for the golden sun at the atlas's centre — the visual language of
 * Cellarius / illuminated ceiling frescoes: a radiant disc of gold with a corona
 * of flame rays and a serene, downcast engraved face. Colours are passed in from
 * the palette so the gild always matches the system.
 *
 * Two layers so the corona can turn slowly behind a still face:
 *   sunBodySvg  — rays + disc (rotates)
 *   sunFaceSvg  — engraved features only, transparent (static)
 */

interface SunColors {
  gold: string;
  goldBright: string;
  ivory: string;
  copper: string;
}

const SIZE = 512;
const C = SIZE / 2;

/** Corona + gilded disc. */
export function sunBodySvg({ gold, goldBright, copper }: SunColors): string {
  const rays: string[] = [];
  const count = 24;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const long = i % 2 === 0;
    const tip = long ? 246 : 202;
    const base = 150;
    const w = 0.055; // angular half-width at base
    const p1 = pt(a - w, base);
    const p2 = pt(a, tip);
    const p3 = pt(a + w, base);
    rays.push(
      `<path d="M${p1} L${p2} L${p3} Z" fill="${long ? goldBright : gold}" opacity="${long ? 0.95 : 0.7}"/>`,
    );
  }

  return svg(`
    <defs>
      <radialGradient id="disc" cx="50%" cy="46%" r="55%">
        <stop offset="0%" stop-color="${goldBright}"/>
        <stop offset="70%" stop-color="${gold}"/>
        <stop offset="100%" stop-color="${copper}"/>
      </radialGradient>
    </defs>
    <g>${rays.join("")}</g>
    <circle cx="${C}" cy="${C}" r="150" fill="url(#disc)"/>
    <circle cx="${C}" cy="${C}" r="150" fill="none" stroke="${copper}" stroke-width="3" opacity="0.6"/>
  `);
}

/** Serene engraved face — calm, downcast, minimal. */
export function sunFaceSvg({ copper }: SunColors): string {
  const s = copper;
  return svg(`
    <g fill="none" stroke="${s}" stroke-width="4" stroke-linecap="round" opacity="0.8">
      <!-- brows / closed downcast eyes -->
      <path d="M${C - 74} ${C - 26} q34 26 68 0"/>
      <path d="M${C + 6} ${C - 26} q34 26 68 0"/>
      <!-- lashes -->
      <path d="M${C - 66} ${C - 8} l-8 8" stroke-width="3"/>
      <path d="M${C + 66} ${C - 8} l8 8" stroke-width="3"/>
      <!-- nose -->
      <path d="M${C} ${C - 14} q-10 34 0 44 q8 4 12 -2" stroke-width="3.5"/>
      <!-- serene mouth -->
      <path d="M${C - 34} ${C + 62} q34 22 68 0" stroke-width="4"/>
    </g>
    <!-- cheeks -->
    <circle cx="${C - 84}" cy="${C + 40}" r="16" fill="${s}" opacity="0.18"/>
    <circle cx="${C + 84}" cy="${C + 40}" r="16" fill="${s}" opacity="0.18"/>
  `);
}

/** Point on a circle centred in the viewBox, as "x y". */
function pt(angle: number, radius: number): string {
  return `${(C + Math.cos(angle) * radius).toFixed(1)} ${(C + Math.sin(angle) * radius).toFixed(1)}`;
}

function svg(inner: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">${inner}</svg>`;
}
