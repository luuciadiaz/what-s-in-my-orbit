"use client";

/**
 * OrbitLines — golden rings that structure the void.
 *
 * Concentric elliptical paths, each gently tilted, drawn as thin gold lines.
 * In later phases these become the tracks the planets travel; here they are the
 * quiet geometry that tells the eye this space is composed, not empty. They
 * rotate almost imperceptibly (frozen under reduced motion).
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "@/config/colors";

interface OrbitLinesProps {
  reducedMotion: boolean;
}

/** Each ring: semi-major radius, eccentricity, tilt, and drift speed. */
const RINGS = [
  { radius: 8, ecc: 0.12, tilt: 0.5, speed: 0.02, opacity: 0.5 },
  { radius: 13, ecc: 0.08, tilt: 0.42, speed: 0.014, opacity: 0.38 },
  { radius: 19, ecc: 0.16, tilt: 0.6, speed: 0.01, opacity: 0.28 },
  { radius: 26, ecc: 0.1, tilt: 0.38, speed: 0.007, opacity: 0.2 },
];

const SEGMENTS = 220;

function Ring({ ring, reducedMotion }: { ring: (typeof RINGS)[number]; reducedMotion: boolean }) {
  const ref = useRef<THREE.LineLoop>(null);

  const geometry = useMemo(() => {
    const b = ring.radius * (1 - ring.ecc); // semi-minor from eccentricity
    const pts: number[] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const t = (i / SEGMENTS) * Math.PI * 2;
      pts.push(Math.cos(t) * ring.radius, 0, Math.sin(t) * b);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, [ring]);

  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return;
    ref.current.rotation.y += delta * ring.speed;
  });

  return (
    <lineLoop ref={ref} geometry={geometry} rotation={[ring.tilt, 0, 0]}>
      <lineBasicMaterial
        color={palette.gold}
        transparent
        opacity={ring.opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineLoop>
  );
}

export function OrbitLines({ reducedMotion }: OrbitLinesProps) {
  return (
    <group>
      {RINGS.map((ring, i) => (
        <Ring key={i} ring={ring} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}
