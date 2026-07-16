"use client";

/**
 * Nebula — distant cosmic clouds and dust bands.
 *
 * A few very large, soft, deep-blue clouds placed far behind the stars, drifting
 * almost imperceptibly. Value-noise FBM (no textures), tinted between deep
 * ultramarine and faint cyan/violet, edge-dissolved so each reads as a diffuse
 * band of the Milky Way rather than a plane. Kept low in opacity — depth and
 * atmosphere, not spectacle. Frozen under reduced motion; heavy tier only.
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NebulaProps {
  reducedMotion: boolean;
}

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  uniform float uSpeed;
  float hash(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y); }
  float noise(vec2 p){ vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y); }
  float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<6;i++){v+=a*noise(p);p*=2.0;a*=0.5;} return v; }
  void main() {
    vec2 p = vUv * 3.5;
    float drift = uTime * uSpeed;
    float n = fbm(p + vec2(drift, drift * 0.4));
    n = fbm(p + n * 1.5);
    float edge = smoothstep(0.5, 0.02, distance(vUv, vec2(0.5)));
    vec3 color = mix(uColorA, uColorB, n);
    float alpha = pow(n, 1.6) * edge * uOpacity;
    gl_FragColor = vec4(color, alpha);
  }
`;

// Deep, composed placements behind the stars.
const CLOUDS = [
  { pos: [-18, 8, -70] as const, scale: 110, rot: 0.3, a: "#1b2f6e", b: "#2a4d8f", speed: 0.004, opacity: 0.5 },
  { pos: [26, -12, -90] as const, scale: 140, rot: -0.5, a: "#141f52", b: "#3a3f80", speed: 0.003, opacity: 0.4 },
  { pos: [6, 20, -120] as const, scale: 180, rot: 0.8, a: "#101a44", b: "#22407a", speed: 0.002, opacity: 0.32 },
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
        vertexShader={VERT}
        fragmentShader={FRAG}
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
