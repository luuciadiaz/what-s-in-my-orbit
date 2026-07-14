/**
 * ProjectArticle — the editorial, crawlable project page.
 *
 * Very minimal, large typography, generous breathing space, per the brief.
 * The WebGL "enter a planet" cinematic will later transition INTO this content;
 * here it stands alone as fully-readable server-rendered HTML.
 */
import Link from "next/link";
import type { Project } from "@/content/types";

export function ProjectArticle({ project }: { project: Project }) {
  return (
    <article className="mx-auto max-w-content px-[var(--gutter-inline)] py-4xl">
      <p aria-hidden="true" className="font-display text-display text-gold">
        {project.glyph.symbol}
      </p>

      <p className="mt-lg font-caption text-caption uppercase tracking-[0.24em] text-ink-muted">
        {project.discipline} · {project.year}
      </p>
      <h1 className="mt-md font-display text-h1 leading-tight text-ink">
        {project.title}
      </h1>
      <p className="mt-lg max-w-prose font-heading text-h4 leading-snug text-ink-soft">
        {project.tagline}
      </p>

      <div className="mt-3xl max-w-prose space-y-lg">
        {project.paragraphs.map((paragraph, i) => (
          <p key={i} className="font-body text-lead leading-relaxed text-ink-soft">
            {paragraph}
          </p>
        ))}
      </div>

      <ul className="mt-2xl flex flex-wrap gap-md" aria-label="Themes">
        {project.themes.map((theme) => (
          <li
            key={theme}
            className="rounded-sm border border-brass/30 px-md py-2 font-caption text-caption uppercase tracking-[0.2em] text-brass"
          >
            {theme}
          </li>
        ))}
      </ul>

      <nav className="mt-4xl border-t border-brass/20 pt-xl">
        <Link
          href="/"
          className="font-caption text-small uppercase tracking-[0.24em] text-gold underline-offset-8 hover:underline"
        >
          ← Return to the atlas
        </Link>
      </nav>
    </article>
  );
}
