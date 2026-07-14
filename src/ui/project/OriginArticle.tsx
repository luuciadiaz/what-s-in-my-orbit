/**
 * OriginArticle — the home world's full page: biography, manifesto, experience,
 * contact. The crawlable counterpart to entering Origin in the WebGL layer.
 */
import Link from "next/link";
import { about } from "@/content/about";
import { cvArtifact } from "@/content/skills";

export function OriginArticle() {
  return (
    <article className="mx-auto max-w-content px-[var(--gutter-inline)] py-4xl">
      <p aria-hidden="true" className="font-display text-display text-gold">
        {about.glyph.symbol}
      </p>
      <h1 className="mt-md font-display text-h1 leading-tight text-ink">
        {about.title}
      </h1>
      <p className="mt-2 font-caption text-caption uppercase tracking-[0.24em] text-ink-muted">
        {about.subtitle}
      </p>

      <section aria-label="Manifesto" className="mt-3xl max-w-prose space-y-lg">
        {about.manifesto.map((line, i) => (
          <p key={i} className="font-heading text-h4 leading-snug text-ink">
            {line}
          </p>
        ))}
      </section>

      <section aria-label="Biography" className="mt-3xl max-w-prose space-y-lg">
        {about.biography.map((line, i) => (
          <p key={i} className="font-body text-lead leading-relaxed text-ink-soft">
            {line}
          </p>
        ))}
      </section>

      <section aria-labelledby="exp-heading" className="mt-3xl">
        <h2
          id="exp-heading"
          className="font-caption text-small uppercase tracking-[0.28em] text-ink-muted"
        >
          Experience
        </h2>
        <ul className="mt-lg divide-y divide-brass/20">
          {about.experience.map((item) => (
            <li
              key={`${item.role}-${item.period}`}
              className="flex flex-wrap items-baseline justify-between gap-md py-lg"
            >
              <span className="font-heading text-h4 text-ink">{item.role}</span>
              <span className="font-body text-body text-ink-soft">{item.place}</span>
              <span className="font-caption text-caption text-brass">{item.period}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="contact-heading" className="mt-3xl max-w-prose">
        <h2
          id="contact-heading"
          className="font-caption text-small uppercase tracking-[0.28em] text-ink-muted"
        >
          {about.contact.label}
        </h2>
        <p className="mt-lg font-body text-lead text-ink-soft">{about.contact.note}</p>
        <a
          href={`mailto:${about.contact.email}`}
          className="mt-md inline-block font-heading text-h3 text-gold underline-offset-8 hover:underline"
        >
          {about.contact.email}
        </a>
        <div className="mt-xl">
          <a
            href={cvArtifact.href}
            download={cvArtifact.downloadName}
            className="font-caption text-small uppercase tracking-[0.24em] text-brass underline-offset-8 hover:text-gold hover:underline"
          >
            Receive the CV
          </a>
        </div>
      </section>

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
