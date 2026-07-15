"use client";

/**
 * EntryParticles — the world quickens as you approach.
 *
 * Per the brief ("entering a planet: particles increase"), a field of golden
 * motes gathers around the world being entered, fading in through the flight and
 * lingering while it is active, then dissolving on return. Positioned on the
 * live planet object; count scales to the device tier; under reduced motion the
 * motes are still but still present.
 */
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "@/config/colors";
import { PLANETS } from "@/config/planets";
import type { TierBudget } from "@/hooks/useDeviceTier";
import { SeededRandom } from "@/lib/seededRandom";
import { useAtlas, getPlanetObject } from "@/state/atlasStore";

const CONFIG = Object.fromEntries(PLANETS.map((p) => [p.slug, p]));

const VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uReduced;
  varying float vTw;
  void main() {
    vec3 p = position;
    // Slow upward drift + orbital swirl (skipped under reduced motion).
    float t = uTime * (1.0 - uReduced);
    float ang = t * 0.25 + aPhase;
    p.x += sin(ang) * 0.15;
    p.z += cos(ang) * 0.15;
    p.y += sin(t * 0.5 + aPhase) * 0.1;
    vTw = 0.6 + 0.4 * sin(uTime * 2.0 + aPhase);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (200.0 / -mv.z);
  }
`;

const FRAG = /* glsl */ `
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

export function EntryParticles({ budget, reducedMotion }: { budget: TierBudget; reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { phase, activePlanet } = useAtlas();
  const pixelRatio = Math.min(useThree((s) => s.viewport.dpr), budget.maxDpr);

  const count = Math.round(Math.min(budget.particles * 0.12, 900));

  const geometry = useMemo(() => {
    const rng = new SeededRandom(4242);
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const phaseA = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Shell around a unit world; scaled per-planet at render time.
      const r = rng.range(1.3, 3.4);
      const th = rng.range(0, Math.PI * 2);
      const ph = Math.acos(rng.signed(1));
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph);
      size[i] = rng.range(0.6, 2.2);
      phaseA[i] = rng.range(0, Math.PI * 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phaseA, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uReduced: { value: reducedMotion ? 1 : 0 },
      uColor: { value: new THREE.Color(palette.goldBright) },
      uOpacity: { value: 0 },
    }),
    [pixelRatio, reducedMotion],
  );

  useFrame((_, delta) => {
    const mat = matRef.current;
    const group = groupRef.current;
    if (!mat || !group) return;

    // Follow the active world and size the shell to its radius.
    const active = activePlanet && (phase === "entering" || phase === "active");
    if (active) {
      const obj = getPlanetObject(activePlanet);
      const cfg = CONFIG[activePlanet];
      if (obj) group.position.copy(obj.getWorldPosition(new THREE.Vector3()));
      if (cfg) {
        const s = (cfg.isCenter ? cfg.radius * 1.6 : cfg.radius) + 0.4;
        group.scale.setScalar(s);
      }
    }

    // Fade in while entering/active, out otherwise.
    const target = active ? 0.9 : 0;
    mat.uniforms.uOpacity.value += (target - mat.uniforms.uOpacity.value) * Math.min(1, delta * 2.5);
    if (!reducedMotion) mat.uniforms.uTime.value += delta;
  });

  return (
    <group ref={groupRef}>
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
    </group>
  );
}
