/**
 * QuoteMark — a manifesto line breathing in the negative space.
 * Renders a single quote; the caller chooses which. Kept minimal and editorial.
 */
import type { Quote } from "@/content/types";

export function QuoteMark({ quote }: { quote: Quote }) {
  return (
    <figure className="mx-auto max-w-content px-[var(--gutter-inline)] py-4xl text-center">
      <blockquote className="font-display text-h1 leading-snug text-ink">
        “{quote.text}”
      </blockquote>
      {quote.attribution ? (
        <figcaption className="mt-lg font-caption text-caption uppercase tracking-[0.24em] text-ink-muted">
          {quote.attribution}
        </figcaption>
      ) : null}
    </figure>
  );
}
