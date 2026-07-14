/**
 * ZODIAC / ASTROLABE ART
 *
 * The great gilded wheel the atlas turns within: concentric gold circles, a
 * degree-ticked rim, and the twelve zodiac glyphs — the ornamental grammar of
 * an antique planisphere (Cellarius, observatory ceilings). Rendered faintly on
 * the ecliptic plane so it frames the planets without competing with them.
 */

interface ZodiacColors {
  gold: string;
  brass: string;
}

const SIZE = 1024;
const C = SIZE / 2;
const ZODIAC = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

export function zodiacWheelSvg({ gold, brass }: ZodiacColors): string {
  const parts: string[] = [];

  // Concentric rings — an astrolabe's nested circles.
  const rings = [500, 468, 360, 300, 214, 150];
  rings.forEach((r, i) => {
    parts.push(
      `<circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="${gold}" stroke-width="${i < 2 ? 3 : 1.4}" opacity="${i < 2 ? 0.9 : 0.4}"/>`,
    );
  });

  // Degree ticks around the rim (every 5°, longer every 30°).
  for (let d = 0; d < 360; d += 5) {
    const a = (d / 180) * Math.PI;
    const major = d % 30 === 0;
    const rOuter = 500;
    const rInner = major ? 468 : 484;
    parts.push(
      `<line x1="${xy(a, rInner).x}" y1="${xy(a, rInner).y}" x2="${xy(a, rOuter).x}" y2="${xy(a, rOuter).y}" stroke="${gold}" stroke-width="${major ? 2.5 : 1}" opacity="${major ? 0.9 : 0.45}"/>`,
    );
  }

  // Twelve zodiac glyphs on the rim band.
  ZODIAC.forEach((glyph, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2 + Math.PI / 12;
    const p = xy(a, 434);
    parts.push(
      `<text x="${p.x}" y="${p.y}" fill="${gold}" font-family="Georgia, 'Times New Roman', serif" font-size="34" text-anchor="middle" dominant-baseline="central" opacity="0.92">${glyph}</text>`,
    );
  });

  // A scatter of small gold stars between the inner rings.
  for (let i = 0; i < 60; i++) {
    const a = (i * 137.5 * Math.PI) / 180; // golden-angle spread
    const r = 160 + ((i * 47) % 130);
    const p = xy(a, r);
    parts.push(`<circle cx="${p.x}" cy="${p.y}" r="1.6" fill="${brass}" opacity="0.6"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">${parts.join("")}</svg>`;
}

function xy(angle: number, radius: number): { x: string; y: string } {
  return {
    x: (C + Math.cos(angle) * radius).toFixed(1),
    y: (C + Math.sin(angle) * radius).toFixed(1),
  };
}
