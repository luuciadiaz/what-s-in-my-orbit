"use client";

/**
 * Sun — the golden centre world (Origin).
 *
 * A radiant, billboarded sun in the illuminated-manuscript tradition: a corona
 * of gold flame rays turning slowly behind a still, serene engraved face. It
 * behaves like any world — hover reveals it, click enters Origin — but reads as
 * the luminous heart the whole atlas orbits.
 */
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import type { PlanetConfig } from "@/config/planets";
import { palette } from "@/config/colors";
import { svgTexture } from "@/three/lib/svgTexture";
import { sunBodySvg, sunFaceSvg } from "@/three/art/sunArt";
import { registerPlanet, unregisterPlanet } from "@/state/atlasStore";
import { setHovering } from "@/state/cursorStore";
import { audioEngine } from "@/audio/AudioEngine";

interface SunProps {
  config: PlanetConfig;
  active: boolean;
  reducedMotion: boolean;
  paused: boolean;
  onHover: (slug: string | null) => void;
  onActivate: (slug: string) => void;
}

export function Sun({ config, active, reducedMotion, paused, onHover, onActivate }: SunProps) {
  const bodyRef = useRef<THREE.Mesh>(null);
  const swellRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const node = swellRef.current;
    if (node) registerPlanet(config.slug, node);
    return () => unregisterPlanet(config.slug);
  }, [config.slug]);

  const colors = {
    gold: palette.gold,
    goldBright: palette.goldBright,
    ivory: palette.ivory,
    copper: palette.copper,
  };
  const bodyTex = useMemo(() => svgTexture(sunBodySvg(colors)), []); // eslint-disable-line react-hooks/exhaustive-deps
  const faceTex = useMemo(() => svgTexture(sunFaceSvg(colors)), []); // eslint-disable-line react-hooks/exhaustive-deps

  // Radiant halo so the gilded sun reads as a luminous star in realistic space.
  const glowTex = useMemo(
    () =>
      svgTexture(
        `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><defs><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${palette.goldBright}" stop-opacity="0.7"/><stop offset="35%" stop-color="${palette.gold}" stop-opacity="0.28"/><stop offset="100%" stop-color="${palette.gold}" stop-opacity="0"/></radialGradient></defs><circle cx="128" cy="128" r="128" fill="url(#g)"/></svg>`,
      ),
    [],
  );

  const size = config.radius * 3.7;

  useFrame((_, delta) => {
    if (!reducedMotion && !paused && bodyRef.current) {
      bodyRef.current.rotation.z += delta * 0.05; // slow corona turn
    }
    if (swellRef.current) {
      const t = active ? 1.08 : 1;
      swellRef.current.scale.lerp(new THREE.Vector3(t, t, t), 0.1);
    }
  });

  return (
    <Billboard>
      <group ref={swellRef}>
        {/* Radiant halo behind the sun. */}
        <mesh position={[0, 0, -0.05]} scale={size * 2.1}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={glowTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>

        {/* Corona + gilded disc (turning) */}
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
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial map={bodyTex} transparent depthWrite={false} toneMapped={false} />
        </mesh>

        {/* Serene face (still) */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial map={faceTex} transparent depthWrite={false} toneMapped={false} />
        </mesh>

        {active ? (
          <Html center distanceFactor={18} position={[0, config.radius + 2.4, 0]} pointerEvents="none">
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
    </Billboard>
  );
}
