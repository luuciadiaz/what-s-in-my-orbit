"use client";

/**
 * GoldStars — gilded star ornaments in the far sky.
 *
 * The supplied gold eight-pointed stars, keyed off their blue ground by hue
 * (warm gold kept, blue dropped) and scattered as faint billboards among the
 * procedural starfield — the illuminated-manuscript gold-leaf accent from the
 * references. Purely decorative and, like the rest of the ambient sky, still.
 */
import { useMemo } from "react";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import { SeededRandom } from "@/lib/seededRandom";

const SRC = "/art/stars.webp";
const COUNT = 5;

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

// Keep warm gold (r > b), drop the blue ground.
const FRAG = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform float uOpacity;
  void main() {
    vec4 t = texture2D(uMap, vUv);
    float warm = t.r - t.b;
    float a = smoothstep(0.02, 0.14, warm) * uOpacity;
    gl_FragColor = vec4(t.rgb, a);
  }
`;

function place(rng: SeededRandom): [number, number, number] {
  const r = rng.range(48, 66);
  const theta = rng.range(0, Math.PI * 2);
  const phi = rng.range(Math.PI * 0.2, Math.PI * 0.8);
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

export function GoldStars() {
  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load(SRC);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  const ornaments = useMemo(() => {
    const rng = new SeededRandom(88888);
    return Array.from({ length: COUNT }).map(() => ({
      pos: place(rng),
      scale: rng.range(7, 15),
      opacity: rng.range(0.35, 0.7),
    }));
  }, []);

  return (
    <group>
      {ornaments.map((o, i) => {
        const uniforms = { uMap: { value: texture }, uOpacity: { value: o.opacity } };
        // stars.webp is 675x1200 (portrait); keep that aspect.
        return (
          <Billboard key={i} position={o.pos}>
            <mesh scale={[o.scale * (675 / 1200), o.scale, 1]}>
              <planeGeometry args={[1, 1]} />
              <shaderMaterial
                vertexShader={VERT}
                fragmentShader={FRAG}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </Billboard>
        );
      })}
    </group>
  );
}
