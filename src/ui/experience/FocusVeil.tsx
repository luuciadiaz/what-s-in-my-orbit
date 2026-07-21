"use client";

/**
 * FocusVeil — the universe recedes when attention narrows.
 *
 * A non-interactive radial scrim that deepens toward the edges, so the world in
 * focus keeps the light while its surroundings fall back into the dark. It is
 * gentle on hover (a world is merely being considered) and near-total once a
 * world is entered (the camera has centred it and the project is revealing).
 * Pairs with the in-WebGL dimming of the other planets and the orbit tracks.
 */
import { useAtlas } from "@/state/atlasStore";

export function FocusVeil() {
  const { phase, focused } = useAtlas();
  const entering = phase !== "idle";
  const opacity = entering ? 1 : focused ? 0.36 : 0;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 transition-opacity duration-[900ms] ease-editorial"
      style={{
        zIndex: "var(--z-content)",
        opacity,
        backgroundImage:
          "radial-gradient(ellipse at center, transparent 30%, rgba(6,10,26,0.72) 82%, rgba(4,7,18,0.9) 100%)",
      }}
    />
  );
}
