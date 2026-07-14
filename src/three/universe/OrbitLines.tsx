"use client";

/**
 * OrbitLines — the golden tracks the planets travel.
 *
 * One ring per orbiting world, derived directly from the planet config so a
 * planet always sits ON its line. Each ring inherits its planet's orbital tilt.
 * Thin gold, faint, near-imperceptibly alive — the structure that tells the eye
 * this space is composed, not empty.
 */
import { useMemo } from "react";
import * as THREE from "three";
import { palette } from "@/config/colors";
import { PLANETS } from "@/config/planets";

const SEGMENTS = 240;

function Ring({ radius, tilt }: { radius: number; tilt: number }) {
  const geometry = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const t = (i / SEGMENTS) * Math.PI * 2;
      pts.push(Math.cos(t) * radius, 0, Math.sin(t) * radius);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, [radius]);

  // Fainter as rings grow, so the composition recedes into depth.
  const opacity = Math.max(0.12, 0.5 - radius * 0.012);

  return (
    <lineLoop geometry={geometry} rotation={[tilt, 0, 0]}>
      <lineBasicMaterial
        color={palette.gold}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineLoop>
  );
}

export function OrbitLines() {
  const rings = PLANETS.filter((p) => p.orbitRadius > 0);
  return (
    <group>
      {rings.map((p) => (
        <Ring key={p.slug} radius={p.orbitRadius} tilt={p.orbitTilt} />
      ))}
    </group>
  );
}
