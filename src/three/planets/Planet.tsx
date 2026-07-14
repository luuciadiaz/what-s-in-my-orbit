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
import { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { PlanetConfig } from "@/config/planets";
import {
  planetVertex,
  planetFragment,
  atmosphereVertex,
  atmosphereFragment,
} from "./shaders/planet.glsl";
import { PlanetRing } from "./PlanetRing";

interface PlanetProps {
  config: PlanetConfig;
  hovered: boolean;
  reducedMotion: boolean;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string) => void;
}

export function Planet({ config, hovered, reducedMotion, onHover, onSelect }: PlanetProps) {
  const revolveRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const swellRef = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera);
  const [angle] = useState(config.startAngle);

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

  useFrame((state, delta) => {
    surfaceUniforms.uCameraPos.value.copy(camera.position);
    atmoUniforms.uCameraPos.value.copy(camera.position);

    if (!reducedMotion) {
      surfaceUniforms.uTime.value += delta;
      if (revolveRef.current && config.orbitRadius > 0) {
        revolveRef.current.rotation.y = angle + state.clock.elapsedTime * config.orbitSpeed;
      }
      if (bodyRef.current) bodyRef.current.rotation.y += delta * config.spinSpeed;
    }

    // Gentle swell on hover.
    if (swellRef.current) {
      const target = hovered ? 1.12 : 1;
      swellRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.12);
    }
  });

  return (
    <group rotation={[config.orbitTilt, 0, 0]}>
      <group ref={revolveRef}>
        <group position={[config.orbitRadius, 0, 0]}>
          <group ref={swellRef}>
            {/* Body */}
            <mesh
              ref={bodyRef}
              onPointerOver={(e) => {
                e.stopPropagation();
                onHover(config.slug);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                onHover(null);
                document.body.style.cursor = "auto";
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(config.slug);
              }}
            >
              <sphereGeometry args={[config.radius, 48, 48]} />
              <shaderMaterial
                vertexShader={planetVertex}
                fragmentShader={planetFragment}
                uniforms={surfaceUniforms}
              />
            </mesh>

            {/* Atmosphere halo */}
            <mesh scale={1.18}>
              <sphereGeometry args={[config.radius, 32, 32]} />
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

            {/* Hover label — minimal: glyph + discipline. */}
            {hovered ? (
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
