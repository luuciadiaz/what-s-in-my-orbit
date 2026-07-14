"use client";

/**
 * ZodiacWheel — the gilded astrolabe the atlas turns within.
 *
 * The zodiac art laid flat on the ecliptic plane, large enough to frame every
 * orbit, faint enough to sit behind the planets. It turns almost imperceptibly
 * (still under reduced motion), like the slow precession of an observatory dome.
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "@/config/colors";
import { svgTexture } from "@/three/lib/svgTexture";
import { zodiacWheelSvg } from "@/three/art/zodiacArt";

interface ZodiacWheelProps {
  reducedMotion: boolean;
}

const RADIUS = 42;

export function ZodiacWheel({ reducedMotion }: ZodiacWheelProps) {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useMemo(
    () => svgTexture(zodiacWheelSvg({ gold: palette.gold, brass: palette.brass })),
    [],
  );

  useFrame((_, delta) => {
    if (!reducedMotion && ref.current) ref.current.rotation.z += delta * 0.006;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[RADIUS * 2, RADIUS * 2]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.5}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}
