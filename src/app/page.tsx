/**
 * ATLAS — the home experience.
 *
 * The living universe (Phase 1) is mounted as a fixed backdrop; the semantic,
 * accessible atlas from Phase 0 renders ABOVE it. The hero sits transparently
 * over the sky so the stars breathe behind the title, while the readable index
 * below rests on a solid ground for contrast. The WebGL enhances — it never
 * replaces — the DOM, so the experience degrades gracefully to the shell.
 */
import { Experience } from "@/ui/experience/Experience";
import { Hero } from "@/ui/atlas/Hero";
import { OrbitList } from "@/ui/atlas/OrbitList";
import { SkillsBelt } from "@/ui/atlas/SkillsBelt";
import { OriginPanel } from "@/ui/atlas/OriginPanel";
import { QuoteMark } from "@/ui/atlas/QuoteMark";
import { quotes } from "@/content/quotes";

export default function AtlasPage() {
  return (
    <>
      <Experience />

      <main id="atlas" className="relative" style={{ zIndex: "var(--z-content)" }}>
        {/* Hero breathes over the open sky. */}
        <div className="relative">
          <Hero />
          {/* A soft gradient hands the eye from sky to page. */}
          <div className="pointer-events-none h-40 bg-gradient-to-b from-transparent to-bg" />
        </div>

        {/* The readable atlas index rests on solid ground for contrast. */}
        <div className="bg-bg">
          <QuoteMark quote={quotes[1]} />
          <OrbitList />
          <SkillsBelt />
          <OriginPanel />
          <QuoteMark quote={quotes[0]} />
        </div>
      </main>
    </>
  );
}
