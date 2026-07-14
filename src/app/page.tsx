/**
 * ATLAS — the home experience.
 *
 * Immersive-first: the interactive universe (planets you orbit, hover and enter)
 * is the whole page. The Phase 0 semantic atlas is still rendered — it is the
 * accessible / no-JS / crawlable fallback — but when WebGL is active it collapses
 * to a screen-reader layer (`.fallback-atlas`) so the canvas takes the screen.
 */
import { Loader } from "@/ui/loader/Loader";
import { Experience } from "@/ui/experience/Experience";
import { Hero } from "@/ui/atlas/Hero";
import { OrbitList } from "@/ui/atlas/OrbitList";
import { SkillsBelt } from "@/ui/atlas/SkillsBelt";
import { OriginPanel } from "@/ui/atlas/OriginPanel";

export default function AtlasPage() {
  return (
    <>
      {/* Antique celestial-chart loader — illuminates, then reveals the universe. */}
      <Loader />

      {/* The immersive universe (mounts only when WebGL is supported). */}
      <Experience />

      {/* Accessible / no-JS fallback — collapsed to SR-only when WebGL is active. */}
      <div className="fallback-atlas">
        <main id="atlas" className="bg-bg">
          <Hero />
          <OrbitList />
          <SkillsBelt />
          <OriginPanel />
        </main>
      </div>
    </>
  );
}
