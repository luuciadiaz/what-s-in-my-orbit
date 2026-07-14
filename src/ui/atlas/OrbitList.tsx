/**
 * OrbitList — the accessible spine of navigation.
 *
 * Visually the atlas has "no menu"; structurally it must. This ordered list of
 * orbits is what crawlers index and what keyboard/screen-reader users navigate.
 * Each item links to a real, server-rendered project page. The WebGL layer
 * mirrors these as planets — this list is never removed, only visually managed.
 */
import Link from "next/link";
import { projects } from "@/content/projects";

export function OrbitList() {
  return (
    <section aria-labelledby="orbits-heading" className="mx-auto max-w-content px-[var(--gutter-inline)] py-3xl">
      <h2
        id="orbits-heading"
        className="font-caption text-small uppercase tracking-[0.28em] text-ink-muted"
      >
        The Orbits
      </h2>

      <ol className="mt-xl divide-y divide-brass/20">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/orbit/${project.slug}`}
              className="group flex items-baseline gap-lg py-xl transition-colors duration-fast ease-editorial hover:text-gold focus-visible:text-gold"
            >
              <span
                aria-hidden="true"
                className="font-display text-h2 text-brass transition-colors group-hover:text-gold"
              >
                {project.glyph.symbol}
              </span>
              <span className="flex flex-1 flex-col">
                <span className="font-caption text-caption uppercase tracking-[0.2em] text-ink-muted">
                  {project.discipline}
                </span>
                <span className="font-heading text-h3 text-ink">
                  {project.title}
                </span>
                <span className="mt-1 font-body text-body text-ink-soft">
                  {project.tagline}
                </span>
              </span>
              <span className="font-caption text-caption text-brass">
                {project.year}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
