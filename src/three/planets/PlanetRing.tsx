"use client";

/**
 * PlanetRing — a gas giant's rings.
 *
 * A flat annulus in the planet's equatorial plane, drawn with fine concentric
 * banding and a dark Cassini-style gap, dissolved at both edges. Radii, colour
 * and tilt all come from the planet's `ring` config. Lit softly by the same sun
 * so the ring's far side dims, reading as a real ring rather than a flat disc.
 */
import { useMemo } from "react";
import * as THREE from "three";
import type { PlanetConfig } from "@/config/planets";

const ringVertex = /* glsl */ `
  varying vec2 vLocal;   // local ring-plane XY, for a true radial coordinate
  void main() {
    vLocal = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragment = /* glsl */ `
  precision mediump float;
  varying vec2 vLocal;
  uniform vec3 uColor;
  uniform float uInner;
  uniform float uOuter;

  // Cheap hash for subtle particulate variation in the ring.
  float hash(float n){ return fract(sin(n) * 43758.5453); }

  void main() {
    float r = length(vLocal);
    float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0); // 0 inner → 1 outer
    // Fade both edges so the ring dissolves into space.
    float edge = smoothstep(0.0, 0.06, t) * smoothstep(1.0, 0.88, t);
    // Fine concentric banding + a darker Cassini division around the middle.
    float bands = 0.6 + 0.4 * sin(t * 130.0);
    float grain = 0.85 + 0.15 * hash(floor(t * 200.0));
    float cassini = smoothstep(0.03, 0.07, abs(t - 0.5));
    float alpha = edge * cassini * (0.20 + 0.34 * bands) * grain;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export function PlanetRing({ config }: { config: PlanetConfig }) {
  const ring = config.ring!;
  const inner = config.radius * ring.inner;
  const outer = config.radius * ring.outer;
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(ring.color) },
      uInner: { value: inner },
      uOuter: { value: outer },
    }),
    [ring.color, inner, outer],
  );

  return (
    <mesh rotation={[-Math.PI / 2 + ring.tilt, 0, ring.tilt * 0.4]}>
      <ringGeometry args={[inner, outer, 160]} />
      <shaderMaterial
        vertexShader={ringVertex}
        fragmentShader={ringFragment}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
