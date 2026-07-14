"use client";

/**
 * Experience — the bridge between the accessible DOM shell and the WebGL layer.
 *
 * Progressive enhancement, strictly: the semantic atlas is already in the DOM
 * and fully usable. This mounts the universe as a fixed, decorative backdrop
 * BEHIND that content, and only when the browser actually supports WebGL. If it
 * doesn't (or JS never runs), nothing is lost — the shell stands on its own.
 *
 * The canvas is `aria-hidden` and non-interactive in Phase 1; it is ambience.
 * Pointer interaction and the drag-camera arrive in Phase 2.
 */
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// WebGL must never touch the server; load the canvas client-side only.
const SceneCanvas = dynamic(() => import("@/three/core/SceneCanvas"), {
  ssr: false,
});

/** Cheap, cached WebGL capability probe. */
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
    setSupported(detectWebGL());
  }, []);

  if (!supported) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: "var(--z-canvas)" }}
    >
      <SceneCanvas />
    </div>
  );
}
