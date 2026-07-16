"use client";

/**
 * Dust — suspended motes of gold light.
 *
 * A fine, sparse field of very small points that drift organically: each mote
 * follows its own slow sinuous path (a per-particle phase in the shader), so the
 * field breathes rather than rotating as a rigid block. Kept faint and delicate
 * — atmosphere, not snow. Still under reduced motion.
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SeededRandom, SEEDS } from "@/lib/seededRandom";
import { palette } from "@/config/colors";

interface DustProps {
  count: number;
  pixelRatio: number;
  reducedMotion: boolean;
}

const DUST_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uPixelRatio;
  uniform float uTime;
  varying float vTw;
  void main() {
    // Gentle, per-mote sinuous drift.
    vec3 p = position;
    float t = uTime * 0.15 + aPhase;
    p.x += sin(t) * 0.6;
    p.y += cos(t * 0.8) * 0.5;
    p.z += sin(t * 0.6) * 0.4;
    vTw = 0.55 + 0.45 * sin(uTime * 0.9 + aPhase);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (140.0 / -mv.z);
  }
`;

const DUST_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vTw;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * uOpacity * vTw;
    gl_FragColor = vec4(uColor, a);
  }
`;

export function Dust({ count, pixelRatio, reducedMotion }: DustProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const rng = new SeededRandom(SEEDS.dust);
    const n = Math.floor(count * 0.5);
    const positions = new Float32Array(n * 3);
    const sizes = new Float32Array(n);
    const phases = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      positions[i * 3] = rng.signed(24);
      positions[i * 3 + 1] = rng.signed(16);
      positions[i * 3 + 2] = rng.range(-10, 14);
      sizes[i] = rng.range(0.15, 0.55);
      phases[i] = rng.range(0, Math.PI * 2);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uPixelRatio: { value: pixelRatio },
      uColor: { value: new THREE.Color(palette.goldBright) },
      uOpacity: { value: 0.16 },
      uTime: { value: 0 },
    }),
    [pixelRatio],
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
        vertexShader={DUST_VERT}
        fragmentShader={DUST_FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
