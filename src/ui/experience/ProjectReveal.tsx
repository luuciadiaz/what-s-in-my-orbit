"use client";

/**
 * ProjectReveal — the world opens.
 *
 * When the camera has arrived at a world, its project reveals itself IN the
 * experience — no modal, no page change. The planet stays on screen; an
 * editorial panel rises from below with large type and generous space. A quiet
 * "return" (or Escape) flies the camera back to the atlas. A link to the full
 * server-rendered page remains, for depth and deep-linking.
 */
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useAtlas, leavePlanet } from "@/state/atlasStore";
import { audioEngine } from "@/audio/AudioEngine";
import { projectBySlug } from "@/content/projects";
import { about } from "@/content/about";

/** Return to the atlas with its gentle audio cue. */
function returnToAtlas() {
  audioEngine.back();
  leavePlanet();
}

interface RevealContent {
  discipline: string;
  title: string;
  tagline: string;
  paragraphs: readonly string[];
  themes: readonly string[];
  meta: string;
  href: string;
}

function contentFor(slug: string | null): RevealContent | null {
  if (!slug) return null;
  if (slug === "origin") {
    return {
      discipline: about.subtitle,
      title: about.title,
      tagline: about.manifesto[0],
      paragraphs: about.biography,
      themes: [],
      meta: "Home world",
      href: "/orbit/origin",
    };
  }
  const p = projectBySlug[slug];
  if (!p) return null;
  return {
    discipline: p.discipline,
    title: p.title,
    tagline: p.tagline,
    paragraphs: p.paragraphs,
    themes: p.themes,
    meta: p.year,
    href: `/orbit/${p.slug}`,
  };
}

export function ProjectReveal() {
  const { phase, activePlanet } = useAtlas();
  const content = contentFor(activePlanet);
  const returnRef = useRef<HTMLButtonElement>(null);
  const visible = phase === "active";

  // Escape returns to the atlas; focus the return control on arrival.
  useEffect(() => {
    if (phase !== "active") return;
    returnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") returnToAtlas();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  // Present during the whole visit so entrance/exit can transition.
  if (!content || phase === "idle") return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={`${content.title} — ${content.discipline}`}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: "var(--z-hud)" }}
    >
      {/* Legibility scrim rising from the base. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[72%] transition-opacity duration-slow ease-editorial"
        style={{
          opacity: visible ? 1 : 0,
          backgroundImage:
            "linear-gradient(to top, rgba(7,11,26,0.94), rgba(7,11,26,0.55) 45%, transparent)",
        }}
      />

      {/* Return */}
      <button
        ref={returnRef}
        onClick={returnToAtlas}
        className="pointer-events-auto absolute left-[var(--gutter-inline)] top-8 font-caption text-small uppercase tracking-[0.24em] text-ink-soft transition-opacity duration-slow hover:text-gold focus-visible:text-gold"
        style={{ opacity: visible ? 1 : 0 }}
      >
        ← The atlas
      </button>

      {/* Editorial panel */}
      <div
        className="absolute bottom-0 left-0 w-full max-w-3xl px-[var(--gutter-inline)] pb-[clamp(2.5rem,7vh,6rem)] transition-all duration-slow ease-editorial"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(2.5rem)",
        }}
      >
        <p className="font-caption text-caption uppercase tracking-[0.28em] text-ink-muted">
          {content.discipline} · {content.meta}
        </p>
        <h2 className="mt-3 font-display text-h1 leading-tight text-ink">{content.title}</h2>
        <p className="mt-4 max-w-prose font-heading text-h4 leading-snug text-ink-soft">
          {content.tagline}
        </p>

        <div className="mt-6 max-w-prose space-y-3">
          {content.paragraphs.slice(0, 2).map((p, i) => (
            <p key={i} className="font-body text-body leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
        </div>

        {content.themes.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Themes">
            {content.themes.map((t) => (
              <li
                key={t}
                className="rounded-sm border border-brass/30 px-3 py-1 font-caption text-caption uppercase tracking-[0.2em] text-brass"
              >
                {t}
              </li>
            ))}
          </ul>
        ) : null}

        <Link
          href={content.href}
          className="pointer-events-auto mt-8 inline-block font-caption text-small uppercase tracking-[0.24em] text-gold underline-offset-8 hover:underline"
        >
          Ver proyecto completo ↗
        </Link>
      </div>
    </div>
  );
}
