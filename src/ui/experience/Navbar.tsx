"use client";

/**
 * Navbar — the atlas's one quiet line of chrome.
 *
 * The design is "no menu" by default, so this stays deliberately faint: a
 * handwritten signature on the left (returns to the open atlas) and a compact
 * row of the disciplines on the right (each flies the camera into that world).
 * The bar itself lets pointer events pass through to the sky — only the marks
 * are interactive — so dragging near the top still orbits the universe. It
 * fades out while a world is entered, so it never competes with a project.
 */
import { hero } from "@/content/hero";
import { enterPlanet, leavePlanet, useAtlas } from "@/state/atlasStore";
import { audioEngine } from "@/audio/AudioEngine";

/** Short labels so the row stays minimal. */
const NAV: { slug: string; label: string }[] = [
  { slug: "brand-strategy", label: "Brand" },
  { slug: "events", label: "Events" },
  { slug: "pr", label: "PR" },
  { slug: "content-social", label: "Content" },
  { slug: "campaigns", label: "Campaigns" },
];

export function Navbar() {
  const { phase } = useAtlas();
  const dimmed = phase !== "idle";

  const go = (slug: string) => {
    audioEngine.select(slug);
    enterPlanet(slug);
  };

  return (
    <nav
      aria-label="Atlas"
      className="pointer-events-none fixed inset-x-0 top-0 flex items-center justify-between gap-4 transition-opacity duration-700 ease-editorial"
      style={{
        zIndex: "var(--z-hud)",
        paddingInline: "clamp(1.1rem, 4vw, 2.75rem)",
        paddingBlock: "clamp(0.9rem, 2.2vh, 1.5rem)",
        opacity: dimmed ? 0 : 1,
      }}
    >
      <button
        type="button"
        onClick={() => leavePlanet()}
        className="pointer-events-auto font-hand text-[1.5rem] leading-none text-ink transition-colors hover:text-gold-bright"
        style={{ textShadow: "0 1px 10px rgba(7,13,40,0.95)" }}
      >
        {hero.title}
      </button>

      <ul className="pointer-events-auto flex items-center gap-[clamp(0.8rem,2.2vw,1.9rem)]">
        {NAV.map((n) => (
          <li key={n.slug}>
            <button
              type="button"
              onClick={() => go(n.slug)}
              className="font-caption text-[0.66rem] uppercase tracking-[0.24em] text-ink-soft transition-colors hover:text-gold-bright"
              style={{ textShadow: "0 1px 8px rgba(7,13,40,0.9)" }}
            >
              {n.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
