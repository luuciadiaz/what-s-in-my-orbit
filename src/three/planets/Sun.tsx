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

interface SunProps {
  config: PlanetConfig;
  hovered: boolean;
  reducedMotion: boolean;
  paused: boolean;
  onHover: (slug: string | null) => void;
  onSelect: (slug: string) => void;
}

export function Sun({ config, hovered, reducedMotion, paused, onHover, onSelect }: SunProps) {
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

  const size = config.radius * 3.7;

  useFrame((_, delta) => {
    if (!reducedMotion && !paused && bodyRef.current) {
      bodyRef.current.rotation.z += delta * 0.05; // slow corona turn
    }
    if (swellRef.current) {
      const t = hovered ? 1.08 : 1;
      swellRef.current.scale.lerp(new THREE.Vector3(t, t, t), 0.1);
    }
  });

  return (
    <Billboard>
      <group ref={swellRef}>
        {/* Corona + gilded disc (turning) */}
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
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial map={bodyTex} transparent depthWrite={false} toneMapped={false} />
        </mesh>

        {/* Serene face (still) */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial map={faceTex} transparent depthWrite={false} toneMapped={false} />
        </mesh>

        {hovered ? (
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
