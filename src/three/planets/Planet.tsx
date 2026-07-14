"use client";

/**
 * Planet — one celestial world.
 *
 * Structure (outer → inner):
 *   tilt group → revolve group → radius offset → spinning body + atmosphere.
 * The body uses the illustrated planet shader; a larger back-facing shell adds
 * the atmosphere halo. Hovering swells the world gently and raises a label;
 * clicking enters it. All motion halts under reduced motion.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { PlanetConfig } from "@/config/planets";
import { registerPlanet, unregisterPlanet } from "@/state/atlasStore";
import { setHovering } from "@/state/cursorStore";
import { audioEngine } from "@/audio/AudioEngine";
import {
  planetVertex,
  planetFragment,
  atmosphereVertex,
  atmosphereFragment,
} from "./shaders/planet.glsl";
import { PlanetRing } from "./PlanetRing";

interface PlanetProps {
  config: PlanetConfig;
  /** Revealed: hovered (fine pointer) or focused by first tap (coarse). */
  active: boolean;
  reducedMotion: boolean;
  /** When true (a world is being entered), orbital motion freezes. */
  paused: boolean;
  /** Sphere tessellation, scaled to the device tier. */
  segments: number;
  onHover: (slug: string | null) => void;
  onActivate: (slug: string) => void;
}

export function Planet({ config, active, reducedMotion, paused, segments, onHover, onActivate }: PlanetProps) {
  const revolveRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const swellRef = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera);
  const [angle] = useState(config.startAngle);

  // Publish this world's live object so the camera director can fly to it.
  useEffect(() => {
    const node = swellRef.current;
    if (node) registerPlanet(config.slug, node);
    return () => unregisterPlanet(config.slug);
  }, [config.slug]);

  const surfaceUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(config.colorCore) },
      uGlow: { value: new THREE.Color(config.colorGlow) },
      uTime: { value: 0 },
      uCameraPos: { value: new THREE.Vector3() },
    }),
    [config.colorCore, config.colorGlow],
  );

  const atmoUniforms = useMemo(
    () => ({
      uGlow: { value: new THREE.Color(config.colorGlow) },
      uCameraPos: { value: new THREE.Vector3() },
    }),
    [config.colorGlow],
  );

  useFrame((_, delta) => {
    surfaceUniforms.uCameraPos.value.copy(camera.position);
    atmoUniforms.uCameraPos.value.copy(camera.position);

    if (!reducedMotion && !paused) {
      surfaceUniforms.uTime.value += delta;
      // Incremental so pausing/resuming never causes an orbital jump.
      if (revolveRef.current && config.orbitRadius > 0) {
        revolveRef.current.rotation.y += delta * config.orbitSpeed;
      }
      if (bodyRef.current) bodyRef.current.rotation.y += delta * config.spinSpeed;
    }

    // Gentle swell when revealed.
    if (swellRef.current) {
      const target = active ? 1.12 : 1;
      swellRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.12);
    }
  });

  return (
    <group rotation={[config.orbitTilt, 0, 0]}>
      <group ref={revolveRef} rotation={[0, angle, 0]}>
        <group position={[config.orbitRadius, 0, 0]}>
          <group ref={swellRef}>
            {/* Body */}
            <mesh
              ref={bodyRef}
              onPointerOver={(e) => {
                e.stopPropagation();
                onHover(config.slug);
                setHovering(true);
                audioEngine.hover();
              }}
              onPointerOut={() => {
                onHover(null);
                setHovering(false);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onActivate(config.slug);
              }}
            >
              <sphereGeometry args={[config.radius, segments, segments]} />
              <shaderMaterial
                vertexShader={planetVertex}
                fragmentShader={planetFragment}
                uniforms={surfaceUniforms}
              />
            </mesh>

            {/* Atmosphere halo */}
            <mesh scale={1.18}>
              <sphereGeometry args={[config.radius, Math.max(16, Math.round(segments * 0.7)), Math.max(16, Math.round(segments * 0.7))]} />
              <shaderMaterial
                vertexShader={atmosphereVertex}
                fragmentShader={atmosphereFragment}
                uniforms={atmoUniforms}
                transparent
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>

            {config.hasRing ? <PlanetRing config={config} /> : null}

            {/* Reveal label — minimal: glyph + discipline. */}
            {active ? (
              <Html center distanceFactor={18} position={[0, config.radius + 0.9, 0]} pointerEvents="none">
                <div className="pointer-events-none select-none whitespace-nowrap text-center">
                  <div className="font-display text-[2.6rem] leading-none text-gold">
                    {config.glyph.symbol}
                  </div>
                  <div className="mt-1 font-caption text-[0.7rem] uppercase tracking-[0.28em] text-ink">
                    {config.discipline}
                  </div>
                </div>
              </Html>
            ) : null}
          </group>
        </group>
      </group>
    </group>
  );
}
