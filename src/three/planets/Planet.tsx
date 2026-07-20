"use client";

/**
 * Planet — one celestial world (realistic, procedural).
 *
 * Structure (outer → inner):
 *   tilt group → revolve group → radius offset → swell group → spinning body.
 * The body uses the realistic planet shader (procedural surface + day/night
 * terminator lit by the shared SUN_DIRECTION); a back-facing shell adds the
 * atmosphere halo, and optional cloud/ring layers come from config. Hovering
 * swells the world and raises its label; clicking enters it. All motion halts
 * under reduced motion. Every look value comes from `config` — see config/planets.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { type PlanetConfig, SUN_DIRECTION } from "@/config/planets";
import { registerPlanet, unregisterPlanet } from "@/state/atlasStore";
import { setHovering } from "@/state/cursorStore";
import { audioEngine } from "@/audio/AudioEngine";
import {
  planetVertex,
  planetFragment,
  atmosphereVertex,
  atmosphereFragment,
  cloudVertex,
  cloudFragment,
} from "./shaders/realisticPlanet.glsl";
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

const LIGHT = new THREE.Vector3(...SUN_DIRECTION).normalize();

export function Planet({ config, active, reducedMotion, paused, segments, onHover, onActivate }: PlanetProps) {
  const revolveRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const swellRef = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera);
  const [angle] = useState(config.startAngle);
  const s = config.surface;

  // Publish this world's live object so the camera director can fly to it.
  useEffect(() => {
    const node = swellRef.current;
    if (node) registerPlanet(config.slug, node);
    return () => unregisterPlanet(config.slug);
  }, [config.slug]);

  const surfaceUniforms = useMemo(
    () => ({
      uColorLow: { value: new THREE.Color(s.colorLow) },
      uColorMid: { value: new THREE.Color(s.colorMid) },
      uColorHigh: { value: new THREE.Color(s.colorHigh) },
      uPole: { value: new THREE.Color(s.colorPole) },
      uAtmo: { value: new THREE.Color(config.atmosphere) },
      uType: { value: s.style === "gas" ? 1 : 0 },
      uNoiseScale: { value: s.noiseScale },
      uContrast: { value: s.contrast },
      uSeed: { value: s.seed },
      uTime: { value: 0 },
      uLightDir: { value: LIGHT },
      uCameraPos: { value: new THREE.Vector3() },
    }),
    [s, config.atmosphere],
  );

  const atmoUniforms = useMemo(
    () => ({
      uAtmo: { value: new THREE.Color(config.atmosphere) },
      uLightDir: { value: LIGHT },
      uCameraPos: { value: new THREE.Vector3() },
    }),
    [config.atmosphere],
  );

  const cloudUniforms = useMemo(
    () => ({
      uNoiseScale: { value: s.noiseScale },
      uSeed: { value: s.seed + 3.0 },
      uTime: { value: 0 },
      uLightDir: { value: LIGHT },
    }),
    [s],
  );

  useFrame((_, delta) => {
    surfaceUniforms.uCameraPos.value.copy(camera.position);
    atmoUniforms.uCameraPos.value.copy(camera.position);

    if (!reducedMotion && !paused) {
      surfaceUniforms.uTime.value += delta;
      cloudUniforms.uTime.value += delta;
      if (revolveRef.current && config.orbitRadius > 0) {
        revolveRef.current.rotation.y += delta * config.orbitSpeed;
      }
      if (bodyRef.current) bodyRef.current.rotation.y += delta * config.spinSpeed;
      if (cloudRef.current) cloudRef.current.rotation.y += delta * config.spinSpeed * 1.15;
    }

    if (swellRef.current) {
      const target = active ? 1.1 : 1;
      swellRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.12);
    }
  });

  const cloudSegs = Math.max(20, Math.round(segments * 0.8));

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
              <shaderMaterial vertexShader={planetVertex} fragmentShader={planetFragment} uniforms={surfaceUniforms} />
            </mesh>

            {/* Cloud veil */}
            {config.clouds ? (
              <mesh ref={cloudRef} scale={1.02}>
                <sphereGeometry args={[config.radius, cloudSegs, cloudSegs]} />
                <shaderMaterial
                  vertexShader={cloudVertex}
                  fragmentShader={cloudFragment}
                  uniforms={cloudUniforms}
                  transparent
                  depthWrite={false}
                />
              </mesh>
            ) : null}

            {/* Atmosphere halo */}
            <mesh scale={1.16}>
              <sphereGeometry args={[config.radius, cloudSegs, cloudSegs]} />
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

            {config.ring ? <PlanetRing config={config} /> : null}

            {/* Reveal label — minimal: the discipline name. */}
            {active ? (
              <Html center distanceFactor={18} position={[0, config.radius + 0.9, 0]} pointerEvents="none">
                <div className="pointer-events-none select-none whitespace-nowrap text-center">
                  <div className="font-caption text-[0.82rem] uppercase tracking-[0.26em] text-ink">
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
