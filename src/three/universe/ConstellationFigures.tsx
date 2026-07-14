"use client";

/**
 * ConstellationFigures — illustrated myths in the far sky.
 *
 * Renders each configured constellation as a faint, billboarded gold figure on
 * the background shell — the illuminated-chart layer (cf. antique planispheres).
 * Each figure uses its procedural placeholder unless a custom art file is set in
 * the config, in which case that file is loaded and swapped in. Non-interactive
 * and, like the rest of the ambient sky, effectively still.
 */
import { useEffect, useMemo, useState } from "react";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import { palette } from "@/config/colors";
import { CONSTELLATIONS, type ConstellationFigure } from "@/config/constellations";
import { FIGURE_BUILDERS } from "@/three/art/constellationArt";
import { svgTexture } from "@/three/lib/svgTexture";

const COLORS = { gold: palette.gold, goldBright: palette.goldBright };

/** Spherical → cartesian on the background shell. */
function place(theta: number, phi: number, r: number): [number, number, number] {
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

function Figure({ figure }: { figure: ConstellationFigure }) {
  // Placeholder texture is always available immediately.
  const placeholder = useMemo(() => {
    const build = FIGURE_BUILDERS[figure.id];
    return build ? svgTexture(build(COLORS)) : null;
  }, [figure.id]);

  const [texture, setTexture] = useState<THREE.Texture | null>(placeholder);

  // If custom art is configured, load it and swap in on success.
  useEffect(() => {
    if (!figure.src) return;
    let active = true;
    new THREE.TextureLoader().load(
      `/art/constellations/${figure.src}`,
      (t) => {
        if (!active) return;
        t.colorSpace = THREE.SRGBColorSpace;
        setTexture(t);
      },
      undefined,
      () => {}, // keep placeholder on failure
    );
    return () => {
      active = false;
    };
  }, [figure.src]);

  if (!texture) return null;
  const pos = place(figure.theta, figure.phi, figure.radius);

  return (
    <Billboard position={pos}>
      <mesh>
        <planeGeometry args={[figure.scale, figure.scale]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={figure.opacity}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </Billboard>
  );
}

export function ConstellationFigures() {
  return (
    <group>
      {CONSTELLATIONS.map((figure) => (
        <Figure key={figure.id} figure={figure} />
      ))}
    </group>
  );
}
