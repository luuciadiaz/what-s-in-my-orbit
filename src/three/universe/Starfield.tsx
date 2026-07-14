"use client";

/**
 * Starfield — the breathing sky.
 *
 * A seeded cloud of soft points distributed through a spherical shell around the
 * camera, so depth feels infinite in every direction. Count is set by the device
 * tier. Under reduced motion the field is rendered once and frozen — still, but
 * present. Colours are drawn from the palette, never invented here.
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SeededRandom, SEEDS } from "@/lib/seededRandom";
import { palette } from "@/config/colors";
import { starfieldVertex, starfieldFragment } from "./shaders/starfield.glsl";

interface StarfieldProps {
  count: number;
  pixelRatio: number;
  reducedMotion: boolean;
}

/** Warm tints stars are drawn from — the light of an antique chart. */
const STAR_TINTS = [palette.ivory, palette.goldBright, palette.dustyPinkSoft];

export function Starfield({ count, pixelRatio, reducedMotion }: StarfieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const rng = new SeededRandom(SEEDS.stars);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const tint = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Distribute on a spherical shell (radius 30–90) for endless depth.
      const r = rng.range(30, 90);
      const theta = rng.range(0, Math.PI * 2);
      const phi = Math.acos(rng.signed(1));
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      sizes[i] = rng.range(0.6, 2.4);
      phases[i] = rng.range(0, Math.PI * 2);

      tint.set(rng.pick(STAR_TINTS));
      colors[i * 3] = tint.r;
      colors[i * 3 + 1] = tint.g;
      colors[i * 3 + 2] = tint.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uTwinkle: { value: reducedMotion ? 0 : 0.5 },
    }),
    [pixelRatio, reducedMotion],
  );

  useFrame((_, delta) => {
    if (reducedMotion || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={starfieldVertex}
        fragmentShader={starfieldFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
