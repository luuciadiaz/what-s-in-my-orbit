"use client";

/**
 * CurtainIntro — the theatrical opening.
 *
 * A heavy painterly curtain fills the screen with the title. After a cinematic
 * pause it parts: each half slides toward its side while GATHERING (scaling in
 * toward the outer edge with an organic warp filter) — not a flat translate, but
 * fabric drawing aside under its own weight. It leaves thin drapes framing the
 * universe. The parting drives `introProgress`, which the 3D camera reads to
 * dolly forward "through" the curtain into space. The title fades as it opens.
 *
 * Under reduced motion the curtain is skipped entirely.
 */
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { hero } from "@/content/hero";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  beginOpening,
  finishOpening,
  setIntroProgress,
  skipIntro,
  useIntroPhase,
} from "@/state/introStore";

const CURTAIN = "/art/curtain.jpeg";

export function CurtainIntro() {
  const reducedMotion = useReducedMotion();
  const phase = useIntroPhase();
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      skipIntro();
      setSkipped(true);
      return;
    }

    const apply = (p: number) => {
      const gather = 1 - 0.42 * p;
      const shift = 46 * p; // vw each half travels toward its side
      const sway = Math.sin(p * Math.PI) * 1.5; // subtle fabric sway
      if (leftRef.current)
        leftRef.current.style.transform = `translateX(${-shift}vw) scaleX(${gather}) skewX(${sway}deg)`;
      if (rightRef.current)
        rightRef.current.style.transform = `translateX(${shift}vw) scaleX(${gather}) skewX(${-sway}deg)`;
      if (titleRef.current) {
        const t = Math.min(1, p / 0.55);
        titleRef.current.style.opacity = String(1 - t);
        titleRef.current.style.transform = `translateY(${-t * 2}rem) scale(${1 + t * 0.06})`;
      }
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
        apply(proxy.p);
      },
      onComplete: finishOpening,
    });
    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  if (skipped) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: "var(--z-loader)" }}
    >
      {/* Organic warp so the flat painting reads as heavy cloth. */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="curtain-warp">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.03" numOctaves="2" seed="7" result="n">
            <animate attributeName="baseFrequency" dur="14s" values="0.008 0.03;0.012 0.028;0.008 0.03" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div
        ref={leftRef}
        className="absolute left-0 top-0 h-full w-1/2"
        style={{
          backgroundImage: `url(${CURTAIN})`,
          backgroundSize: "100vw 100vh",
          backgroundPosition: "0 0",
          transformOrigin: "left center",
          filter: "url(#curtain-warp)",
          willChange: "transform",
        }}
      />
      <div
        ref={rightRef}
        className="absolute right-0 top-0 h-full w-1/2"
        style={{
          backgroundImage: `url(${CURTAIN})`,
          backgroundSize: "100vw 100vh",
          backgroundPosition: "-50vw 0",
          transformOrigin: "right center",
          filter: "url(#curtain-warp)",
          willChange: "transform",
        }}
      />

      {/* Title, centred on the curtain, fading as it opens. */}
      {phase !== "open" ? (
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
      ) : null}
    </div>
  );
}
