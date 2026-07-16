"use client";

/**
 * Starfield — a deep, realistic night sky.
 *
 * A dense cloud of stars distributed through a spherical shell around the
 * camera, with wide variation in size and brightness (a few luminous foreground
 * stars among thousands of faint distant ones) and subtle white / blue-white /
 * warm tints — the density and depth of a long-exposure sky, kept elegant.
 * Parallaxes as the camera moves, so the field reads as true space, not a flat
 * image. Count scales to the device tier; still under reduced motion.
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SeededRandom, SEEDS } from "@/lib/seededRandom";

interface StarfieldProps {
  count: number;
  pixelRatio: number;
  reducedMotion: boolean;
}

// Realistic star tints: mostly white, some blue-white, a few warm.
const TINTS = ["#ffffff", "#eaf1ff", "#cdddff", "#fff4e0", "#ffe9c8"];

const VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uTwinkle;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    vColor = aColor;
    float t = sin(uTime * 0.8 + aPhase) * 0.5 + 0.5;
    vTw = mix(1.0 - uTwinkle, 1.0, t);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (260.0 / -mv.z);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    // Sharp core + soft halo, like a real point source.
    float core = smoothstep(0.5, 0.0, d);
    float halo = smoothstep(0.5, 0.28, d);
    float alpha = (core * 0.7 + halo * 0.3) * vTw;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export function Starfield({ count, pixelRatio, reducedMotion }: StarfieldProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const rng = new SeededRandom(SEEDS.stars);
    const n = Math.floor(count * 1.6); // denser than before for realism
    const positions = new Float32Array(n * 3);
    const sizes = new Float32Array(n);
    const phases = new Float32Array(n);
    const colors = new Float32Array(n * 3);
    const tint = new THREE.Color();

    for (let i = 0; i < n; i++) {
      const r = rng.range(24, 110);
      const theta = rng.range(0, Math.PI * 2);
      const phi = Math.acos(rng.signed(1));
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Mostly small faint stars, a rare few large & bright.
      const roll = rng.float();
      sizes[i] = roll > 0.97 ? rng.range(2.6, 4.2) : roll > 0.85 ? rng.range(1.2, 2.2) : rng.range(0.4, 1.0);
      phases[i] = rng.range(0, Math.PI * 2);

      tint.set(rng.pick(TINTS));
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
      uTwinkle: { value: reducedMotion ? 0 : 0.35 },
    }),
    [pixelRatio, reducedMotion],
  );

  useFrame((_, delta) => {
    if (reducedMotion || !matRef.current) return;
    matRef.current.uniforms.uTime.value += delta;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
