"use client";

/**
 * PlanetRing — Saturn's rings.
 *
 * A flat annulus in the planet's equatorial plane, drawn with faint concentric
 * banding in the planet's glow colour and dissolved at both edges so it reads as
 * fine celestial engraving rather than a solid disc. Purely decorative geometry.
 */
import { useMemo } from "react";
import * as THREE from "three";
import type { PlanetConfig } from "@/config/planets";

const ringVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragment = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform vec3 uColor;
  void main() {
    // uv.x runs across the ring width (inner→outer); band it, fade both edges.
    float edge = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
    float bands = 0.5 + 0.5 * sin(vUv.x * 60.0);
    float alpha = edge * (0.25 + 0.35 * bands);
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export function PlanetRing({ config }: { config: PlanetConfig }) {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(config.colorGlow) } }),
    [config.colorGlow],
  );

  return (
    <mesh rotation={[-Math.PI / 2 + 0.12, 0, 0]}>
      <ringGeometry args={[config.radius * 1.5, config.radius * 2.4, 96]} />
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
