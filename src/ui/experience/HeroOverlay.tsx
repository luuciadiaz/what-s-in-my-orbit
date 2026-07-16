"use client";

/**
 * HeroOverlay — the only words on the open sky.
 *
 * Per the brief: the title and a single invitation, nothing else. The overlay
 * is non-interactive (drags pass straight through to the camera) and recedes
 * once the visitor begins to explore — on first pointer/touch/key input, or
 * after a few seconds — so the universe takes over.
 */
import { useEffect, useState } from "react";
import { hero } from "@/content/hero";
import { useCoarsePointer } from "@/hooks/useCoarsePointer";

export function HeroOverlay() {
  const [visible, setVisible] = useState(true);
  const coarse = useCoarsePointer();

  useEffect(() => {
    const dismiss = () => setVisible(false);
    const timer = window.setTimeout(dismiss, 6000);
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("wheel", dismiss);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 flex flex-col items-center px-6 text-center transition-opacity duration-[1600ms] ease-editorial"
      style={{
        zIndex: "var(--z-hud)",
        paddingTop: "clamp(3rem, 12vh, 9rem)",
        opacity: visible ? 1 : 0,
      }}
    >
      <h1
        className="font-display text-display leading-[1.02] tracking-tight text-ink"
        style={{ textShadow: "0 2px 18px rgba(7,13,40,0.95), 0 0 40px rgba(7,13,40,0.8)" }}
      >
        {hero.title}
      </h1>
      <p
        className="mt-6 font-caption text-small uppercase tracking-[0.28em] text-gold-bright"
        style={{ textShadow: "0 1px 10px rgba(7,13,40,0.95)" }}
      >
        {coarse ? hero.invitationTouch : hero.invitation}
      </p>
    </div>
  );
}
