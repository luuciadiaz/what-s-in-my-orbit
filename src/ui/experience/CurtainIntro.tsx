"use client";

/**
 * CurtainIntro — the theatrical opening.
 *
 * A heavy painterly curtain fills the screen with the title. After a cinematic
 * pause it parts — not as two flat halves sliding aside, but as fabric that
 * GATHERS: the WebGL {@link CurtainStage} compresses each panel's cloth toward
 * its edge behind a drooping, rippling leading edge. The same tween drives
 * `introProgress`, which the 3D camera reads to dolly forward "through" the
 * parting into space, so the curtain opens *while* we zoom into the universe.
 * The title, an ordinary DOM overlay for crisp type, fades as it opens.
 *
 * Under reduced motion the curtain is skipped entirely.
 */
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { hero } from "@/content/hero";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CurtainStage } from "@/three/core/CurtainStage";
import {
  beginOpening,
  finishOpening,
  setIntroProgress,
  skipIntro,
  useIntroPhase,
} from "@/state/introStore";

export function CurtainIntro() {
  const reducedMotion = useReducedMotion();
  const phase = useIntroPhase();
  const titleRef = useRef<HTMLDivElement>(null);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      skipIntro();
      setSkipped(true);
      return;
    }

    const fadeTitle = (p: number) => {
      if (!titleRef.current) return;
      const t = Math.min(1, p / 0.5); // fully gone by the time it is half open
      titleRef.current.style.opacity = String(1 - t);
      titleRef.current.style.transform = `translateY(${-t * 2}rem) scale(${1 + t * 0.06})`;
    };

    const proxy = { p: 0 };
    const tl = gsap.timeline({ delay: 2.0 });
    tl.to(proxy, {
      p: 1,
      duration: 3.6,
      ease: "power2.inOut",
      onStart: beginOpening,
      onUpdate: () => {
        setIntroProgress(proxy.p);
        fadeTitle(proxy.p);
      },
      onComplete: finishOpening,
    });
    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  if (skipped || phase === "open") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: "var(--z-loader)" }}
    >
      {/* The fluid velvet, gathering aside in WebGL. */}
      <CurtainStage />

      {/* Title, centred on the curtain, fading as it opens. */}
      <div
        ref={titleRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      >
        <h1
          className="font-display text-display leading-[1.02] tracking-tight text-ink"
          style={{ textShadow: "0 2px 26px rgba(4,8,26,0.95), 0 0 60px rgba(4,8,26,0.9)" }}
        >
          {hero.title}
        </h1>
      </div>
    </div>
  );
}
