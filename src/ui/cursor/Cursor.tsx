"use client";

/**
 * Cursor — an astrolabe for a pointer.
 *
 * A gold instrument that follows the pointer with a touch of easing: a fixed
 * reticle of fine rings and a slowly rotating tick-ring, like the alidade of an
 * astrolabe. It swells and brightens over interactive things (planets, links).
 *
 * Desktop-only enhancement: shown solely for fine pointers, where it hides and
 * replaces the native cursor. Touch devices keep their native behaviour. Under
 * reduced motion the rotation stops and the follow is immediate.
 */
import { useEffect, useRef, useState } from "react";
import { useHovering, setHovering } from "@/state/cursorStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [pressed, setPressed] = useState(false);
  const hovering = useHovering();
  const reducedMotion = useReducedMotion();

  // Only a fine pointer gets the custom cursor; hide the native one while active.
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.style.cursor = "none";
    return () => {
      document.documentElement.style.cursor = "";
    };
  }, []);

  // Follow the pointer with light easing via a single rAF loop.
  useEffect(() => {
    if (!enabled) return;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const tick = () => {
      const ease = reducedMotion ? 1 : 0.2;
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // React to DOM interactive elements too (links, buttons). Canvas/planet
    // hover is handled by the WebGL layer via the same store, so we only toggle
    // on real anchors/buttons here to avoid fighting it.
    const onOver = (e: PointerEvent) => {
      if ((e.target as Element)?.closest?.("a,button")) setHovering(true);
    };
    const onOut = (e: PointerEvent) => {
      if ((e.target as Element)?.closest?.("a,button")) setHovering(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
    };
  }, [enabled, reducedMotion]);

  if (!enabled) return null;

  const scale = (hovering ? 1.7 : 1) * (pressed ? 0.85 : 1);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0"
      style={{ zIndex: "var(--z-cursor)" }}
    >
      <div
        className="transition-transform duration-300 ease-glide"
        style={{ transform: `scale(${scale})` }}
      >
        <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
          {/* Rotating tick-ring (the alidade). */}
          <g
            style={{
              transformOrigin: "23px 23px",
              animation: reducedMotion ? undefined : "astrolabe-spin 12s linear infinite",
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              const x1 = 23 + Math.cos(a) * 17;
              const y1 = 23 + Math.sin(a) * 17;
              const x2 = 23 + Math.cos(a) * 20;
              const y2 = 23 + Math.sin(a) * 20;
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-gold)" strokeWidth="1" opacity="0.8" />
              );
            })}
          </g>
          {/* Fixed reticle. */}
          <circle cx="23" cy="23" r="14" stroke="var(--color-goldBright)" strokeWidth="1" opacity="0.9" fill="none" />
          <circle cx="23" cy="23" r="8" stroke="var(--color-gold)" strokeWidth="0.75" opacity="0.6" fill="none" />
          <line x1="23" y1="4" x2="23" y2="11" stroke="var(--color-goldBright)" strokeWidth="1" />
          <line x1="23" y1="35" x2="23" y2="42" stroke="var(--color-goldBright)" strokeWidth="1" />
          <line x1="4" y1="23" x2="11" y2="23" stroke="var(--color-goldBright)" strokeWidth="1" />
          <line x1="35" y1="23" x2="42" y2="23" stroke="var(--color-goldBright)" strokeWidth="1" />
          <circle cx="23" cy="23" r="1.4" fill="var(--color-goldBright)" />
        </svg>
      </div>
    </div>
  );
}
