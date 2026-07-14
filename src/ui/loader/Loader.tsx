"use client";

/**
 * Loader — an antique celestial chart that illuminates.
 *
 * No progress bar. On entry a star chart draws itself in gold — rings, then
 * constellation lines tracing themselves, then stars kindling one by one, and
 * finally the central sun — after which the whole chart dissolves to reveal the
 * universe. The sequence is capped well under three seconds; reduced motion
 * shows the chart briefly and fades.
 */
import { useEffect, useMemo, useState } from "react";
import { hero } from "@/content/hero";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Phase = "showing" | "leaving" | "done";

export function Loader() {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("showing");

  useEffect(() => {
    const holdMs = reducedMotion ? 350 : 1950;
    const fadeMs = reducedMotion ? 300 : 700;
    const t1 = window.setTimeout(() => setPhase("leaving"), holdMs);
    const t2 = window.setTimeout(() => setPhase("done"), holdMs + fadeMs);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reducedMotion]);

  // Deterministic star field for the chart (golden-angle spread).
  const stars = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => {
      const a = i * 137.5 * (Math.PI / 180);
      const r = 26 + ((i * 7) % 118);
      return { x: 160 + Math.cos(a) * r, y: 160 + Math.sin(a) * r, i };
    });
  }, []);

  // A couple of asterisms tracing between stars.
  const lines = useMemo(() => {
    const idx = [
      [1, 4, 7, 10],
      [2, 6, 9, 14, 18],
      [3, 8, 12, 16],
    ];
    return idx.map((seq) => seq.map((i) => `${stars[i].x},${stars[i].y}`).join(" "));
  }, [stars]);

  if (phase === "done") return null;

  return (
    <div
      role="status"
      aria-label="Cargando el atlas"
      className="fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ease-editorial"
      style={{
        zIndex: "var(--z-loader)",
        backgroundColor: "var(--color-midnightDeep)",
        opacity: phase === "leaving" ? 0 : 1,
      }}
    >
      <style>{`
        @keyframes chart-draw { to { stroke-dashoffset: 0; } }
        @keyframes chart-kindle { from { opacity: 0; } to { opacity: 1; } }
        .chart-line { stroke-dasharray: 260; stroke-dashoffset: 260; animation: chart-draw 1.3s cubic-bezier(0.22,1,0.36,1) forwards; }
        .chart-star { opacity: 0; animation: chart-kindle 0.5s ease forwards; }
        .chart-sun { opacity: 0; animation: chart-kindle 0.8s ease forwards; animation-delay: 1.3s; }
        @media (prefers-reduced-motion: reduce) {
          .chart-line, .chart-star, .chart-sun { animation: none !important; opacity: 1; stroke-dashoffset: 0; }
        }
      `}</style>

      <svg width="300" height="300" viewBox="0 0 320 320" fill="none" aria-hidden="true">
        <circle cx="160" cy="160" r="150" stroke="var(--color-gold)" strokeWidth="1" opacity="0.35" />
        <circle cx="160" cy="160" r="120" stroke="var(--color-brass)" strokeWidth="0.75" opacity="0.25" />

        {lines.map((pts, i) => (
          <polyline
            key={i}
            className="chart-line"
            points={pts}
            stroke="var(--color-gold)"
            strokeWidth="1"
            style={{ animationDelay: `${0.3 + i * 0.35}s` }}
          />
        ))}

        {stars.map((s) => (
          <circle
            key={s.i}
            className="chart-star"
            cx={s.x}
            cy={s.y}
            r="2.4"
            fill="var(--color-goldBright)"
            style={{ animationDelay: `${0.2 + s.i * 0.06}s` }}
          />
        ))}

        {/* Central sun kindles last. */}
        <g className="chart-sun">
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={160 + Math.cos(a) * 12}
                y1={160 + Math.sin(a) * 12}
                x2={160 + Math.cos(a) * 20}
                y2={160 + Math.sin(a) * 20}
                stroke="var(--color-goldBright)"
                strokeWidth="1.2"
              />
            );
          })}
          <circle cx="160" cy="160" r="9" fill="var(--color-gold)" />
        </g>
      </svg>

      <p className="chart-sun mt-8 font-caption text-caption uppercase tracking-[0.28em] text-ink-muted">
        {hero.title}
      </p>
    </div>
  );
}
