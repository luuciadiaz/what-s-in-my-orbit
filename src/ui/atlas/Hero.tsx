/**
 * Hero — the first breath of the atlas.
 *
 * Per the brief: only the title and a single invitation. This is the semantic,
 * always-present version; the WebGL layer will later render the same words as
 * living type over the canvas, but this DOM remains the crawlable source.
 */
import { hero } from "@/content/hero";

export function Hero() {
  return (
    <header className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="font-display text-displayHero leading-[1.05] tracking-tight text-ink">
        {hero.title}
      </h1>
      <p className="mt-8 font-caption text-small uppercase tracking-[0.28em] text-gold">
        {hero.invitation}
      </p>
    </header>
  );
}
