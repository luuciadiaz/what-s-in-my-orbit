/**
 * OriginPanel — the home world (About & Contact), accessible summary.
 *
 * Origin is where biography, manifesto and contact live. The full experience
 * reveals this as a world the camera can enter; this panel is its crawlable,
 * always-available counterpart and links to the dedicated /orbit/origin page.
 */
import Link from "next/link";
import { about } from "@/content/about";
import { cvArtifact } from "@/content/skills";

export function OriginPanel() {
  return (
    <section
      aria-labelledby="origin-heading"
      className="mx-auto max-w-prose px-[var(--gutter-inline)] py-3xl text-center"
    >
      <p aria-hidden="true" className="font-display text-h1 text-gold">
        {about.glyph.symbol}
      </p>
      <h2 id="origin-heading" className="mt-md font-heading text-h2 text-ink">
        {about.title}
      </h2>
      <p className="mt-2 font-caption text-caption uppercase tracking-[0.24em] text-ink-muted">
        {about.subtitle}
      </p>

      <p className="mt-xl font-body text-lead leading-relaxed text-ink-soft">
        {about.manifesto[0]}
      </p>

      <div className="mt-2xl flex flex-col items-center gap-md">
        <Link
          href="/orbit/origin"
          className="font-caption text-small uppercase tracking-[0.24em] text-gold underline-offset-8 hover:underline"
        >
          Enter Origin
        </Link>
        <a
          href={cvArtifact.href}
          download={cvArtifact.downloadName}
          className="font-caption text-small uppercase tracking-[0.24em] text-brass underline-offset-8 hover:underline hover:text-gold"
        >
          Receive the CV
        </a>
      </div>
    </section>
  );
}
