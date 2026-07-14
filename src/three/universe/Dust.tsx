"use client";

/**
 * Dust — suspended motes in the foreground.
 *
 * A thin field of tiny soft points close to the camera that drift with an
 * extremely slow collective rotation, giving parallax and life without noise.
 * Count scales down from the star budget. Frozen under reduced motion.
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
  uniform float uPixelRatio;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (200.0 / -mv.z);
  }
`;

const DUST_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * uOpacity;
    gl_FragColor = vec4(uColor, a);
  }
`;

export function Dust({ count, pixelRatio, reducedMotion }: DustProps) {
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const rng = new SeededRandom(SEEDS.dust);
    const n = Math.floor(count * 0.4);
    const positions = new Float32Array(n * 3);
    const sizes = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      positions[i * 3] = rng.signed(18);
      positions[i * 3 + 1] = rng.signed(12);
      positions[i * 3 + 2] = rng.range(-8, 10);
      sizes[i] = rng.range(0.4, 1.4);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uPixelRatio: { value: pixelRatio },
      uColor: { value: new THREE.Color(palette.ivoryDim) },
      uOpacity: { value: 0.35 },
    }),
    [pixelRatio],
  );

  useFrame((_, delta) => {
    if (reducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.012;
    groupRef.current.rotation.x += delta * 0.005;
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={DUST_VERT}
          fragmentShader={DUST_FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
