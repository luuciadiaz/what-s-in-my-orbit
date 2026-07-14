"use client";

/**
 * Nebula — atmosphere, not spectacle.
 *
 * A few large soft-edged planes drifting behind the stars, each tinted from a
 * pair of palette colours. Movement is near-imperceptible by design. On low
 * tiers the nebula is skipped entirely (the caller decides) to protect frame
 * budget; under reduced motion the clouds are frozen.
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "@/config/colors";
import { nebulaVertex, nebulaFragment } from "./shaders/nebula.glsl";

interface NebulaProps {
  reducedMotion: boolean;
}

/** Composed placements — deep, offset, gently rotated. Intentional, not random. */
const CLOUDS = [
  { pos: [-14, 6, -40] as const, scale: 60, rot: 0.3, a: palette.ultramarine, b: palette.midnightSoft, speed: 0.006, opacity: 0.5 },
  { pos: [20, -10, -55] as const, scale: 80, rot: -0.5, a: palette.copper, b: palette.dustyPink, speed: 0.004, opacity: 0.35 },
  { pos: [4, 16, -70] as const, scale: 100, rot: 0.8, a: palette.gold, b: palette.midnight, speed: 0.003, opacity: 0.28 },
];

function Cloud({ cloud, reducedMotion }: { cloud: (typeof CLOUDS)[number]; reducedMotion: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(cloud.a) },
      uColorB: { value: new THREE.Color(cloud.b) },
      uOpacity: { value: cloud.opacity },
      uSpeed: { value: reducedMotion ? 0 : cloud.speed },
    }),
    [cloud, reducedMotion],
  );

  useFrame((_, delta) => {
    if (reducedMotion || !matRef.current) return;
    matRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh position={cloud.pos} rotation={[0, 0, cloud.rot]} scale={cloud.scale}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={nebulaVertex}
        fragmentShader={nebulaFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export function Nebula({ reducedMotion }: NebulaProps) {
  return (
    <group>
      {CLOUDS.map((cloud, i) => (
        <Cloud key={i} cloud={cloud} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}
