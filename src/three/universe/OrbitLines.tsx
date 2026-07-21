"use client";

/**
 * OrbitLines — the faint tracks the planets travel.
 *
 * One ring per orbiting world, derived directly from the planet config so a
 * planet always sits ON its line. Each ring inherits its planet's orbital tilt.
 * Thin, cool-white and faint — the structure that tells the eye this space is
 * composed, not empty, without competing with the worlds.
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLANETS } from "@/config/planets";
import { getAtlas, isUniverseDimmed } from "@/state/atlasStore";

const ORBIT_COLOR = "#b9c6d6";

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
  const opacity = Math.max(0.1, 0.34 - radius * 0.008);
  const matRef = useRef<THREE.LineBasicMaterial>(null);

  // Fade the tracks down when a world takes the spotlight.
  useFrame((_, delta) => {
    if (!matRef.current) return;
    const target = opacity * (isUniverseDimmed(getAtlas()) ? 0.22 : 1);
    matRef.current.opacity += (target - matRef.current.opacity) * Math.min(1, delta * 4);
  });

  return (
    <lineLoop geometry={geometry} rotation={[tilt, 0, 0]}>
      <lineBasicMaterial
        ref={matRef}
        color={ORBIT_COLOR}
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
