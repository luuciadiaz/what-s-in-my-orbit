/**
 * ATLAS — the home experience.
 *
 * PHASE 0 renders the semantic, server-side "dual layer": the complete,
 * crawlable, keyboard-navigable atlas as real HTML. This is intentionally the
 * foundation the WebGL universe will be layered OVER (Phase 1+) — the canvas
 * enhances this DOM, it never replaces it. That is what keeps the experience
 * accessible, indexable, and usable with reduced motion or no JavaScript.
 */
import { Hero } from "@/ui/atlas/Hero";
import { OrbitList } from "@/ui/atlas/OrbitList";
import { SkillsBelt } from "@/ui/atlas/SkillsBelt";
import { OriginPanel } from "@/ui/atlas/OriginPanel";
import { QuoteMark } from "@/ui/atlas/QuoteMark";
import { quotes } from "@/content/quotes";

export default function AtlasPage() {
  return (
    <main id="atlas">
      <Hero />
      <QuoteMark quote={quotes[1]} />
      <OrbitList />
      <SkillsBelt />
      <OriginPanel />
      <QuoteMark quote={quotes[0]} />
    </main>
  );
}
