"use client";

/**
 * AsteroidBelt — the belt of skills.
 *
 * A ring of stones between the inner and outer worlds: each skill is a named,
 * hoverable asteroid, threaded through a denser scatter of decorative rocks for
 * texture. The whole belt turns slowly (frozen while a world is entered, or
 * under reduced motion). Lights here are the only lit surfaces in the scene —
 * the planets use unlit shaders, so these lights touch nothing else.
 */
import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { skills } from "@/content/skills";
import { palette } from "@/config/colors";
import type { TierBudget } from "@/hooks/useDeviceTier";
import { SeededRandom } from "@/lib/seededRandom";
import { useAtlas } from "@/state/atlasStore";
import { Asteroid } from "./Asteroid";

const BELT_RADIUS = 16.5;
const BELT_TILT = 0.2;
const RADIUS_JITTER = 1.8;
const Y_JITTER = 1.3;
const BELT_SPEED = 0.012;
const DECOR_BY_TIER: Record<TierBudget["tier"], number> = { low: 24, medium: 48, high: 70 };

export function AsteroidBelt({ reducedMotion, budget }: { reducedMotion: boolean; budget: TierBudget }) {
  const rotRef = useRef<THREE.Group>(null);
  const instRef = useRef<THREE.InstancedMesh>(null);
  const { phase } = useAtlas();
  const paused = phase !== "idle";
  const decorCount = DECOR_BY_TIER[budget.tier];

  // Named skill asteroids, evenly spread with a little seeded jitter.
  const rng = useMemo(() => new SeededRandom(90210), []);
  const named = useMemo(() => {
    const r = new SeededRandom(555);
    return skills.map((s, i) => {
      const a = (i / skills.length) * Math.PI * 2 + r.signed(0.15);
      const radius = BELT_RADIUS + r.signed(RADIUS_JITTER);
      return {
        name: s.name,
        position: [Math.cos(a) * radius, r.signed(Y_JITTER), Math.sin(a) * radius] as [number, number, number],
        size: r.range(0.24, 0.42),
        spin: r.range(0.2, 0.7),
      };
    });
  }, []);

  // Decorative scatter (instanced, non-interactive).
  const decor = useMemo(() => {
    return Array.from({ length: decorCount }).map(() => {
      const a = rng.range(0, Math.PI * 2);
      const radius = BELT_RADIUS + rng.signed(RADIUS_JITTER + 0.6);
      return {
        pos: new THREE.Vector3(Math.cos(a) * radius, rng.signed(Y_JITTER), Math.sin(a) * radius),
        scale: rng.range(0.05, 0.2),
        rot: new THREE.Euler(rng.range(0, 6.28), rng.range(0, 6.28), rng.range(0, 6.28)),
      };
    });
  }, [rng, decorCount]);

  useLayoutEffect(() => {
    if (!instRef.current) return;
    const dummy = new THREE.Object3D();
    decor.forEach((d, i) => {
      dummy.position.copy(d.pos);
      dummy.scale.setScalar(d.scale);
      dummy.rotation.copy(d.rot);
      dummy.updateMatrix();
      instRef.current!.setMatrixAt(i, dummy.matrix);
    });
    instRef.current.instanceMatrix.needsUpdate = true;
  }, [decor]);

  useFrame((_, delta) => {
    if (!reducedMotion && !paused && rotRef.current) {
      rotRef.current.rotation.y += delta * BELT_SPEED;
    }
  });

  return (
    <group rotation={[BELT_TILT, 0, 0]}>
      {/* The only lit surfaces in the scene. */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 10, 6]} intensity={0.9} color={palette.ivory} />

      <group ref={rotRef}>
        {named.map((a) => (
          <Asteroid key={a.name} {...a} reducedMotion={reducedMotion} />
        ))}

        <instancedMesh ref={instRef} args={[undefined, undefined, decorCount]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={palette.copper} flatShading roughness={0.95} metalness={0.1} />
        </instancedMesh>
      </group>
    </group>
  );
}
