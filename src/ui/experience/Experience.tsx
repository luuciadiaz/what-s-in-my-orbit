"use client";

/**
 * Experience — the immersive layer.
 *
 * When WebGL is available this becomes the whole experience: a fixed, full-
 * viewport, interactive canvas with the hero overlay above it. The semantic
 * atlas from Phase 0 remains in the DOM as the accessible/no-JS fallback — it is
 * visually collapsed (but kept for screen readers and crawlers) via the
 * `data-webgl` flag on <html>, which an inline script in the layout sets before
 * first paint to avoid any flash of the fallback.
 *
 * If WebGL is absent, this renders nothing and the fallback stands on its own.
 */
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { HeroOverlay } from "./HeroOverlay";
import { AtlasGrade } from "./AtlasGrade";

const SceneCanvas = dynamic(() => import("@/three/core/SceneCanvas"), { ssr: false });

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function Experience() {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const ok = detectWebGL();
    setSupported(ok);
    // Keep the flag in sync with the inline pre-paint script.
    document.documentElement.dataset.webgl = ok ? "on" : "off";
  }, []);

  if (!supported) return null;

  return (
    <>
      <div
        className="fixed inset-0"
        style={{ zIndex: "var(--z-scene)" }}
      >
        <SceneCanvas />
      </div>
      <AtlasGrade />
      <HeroOverlay />
    </>
  );
}
