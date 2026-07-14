"use client";

/**
 * Asteroid — one skill, one stone.
 *
 * A small faceted rock that turns slowly on the belt. Hovering swells it and
 * raises the skill's name, elegantly; it also drives the cursor and a soft
 * interaction sound. Not enterable — the belt is read, not travelled.
 */
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { palette } from "@/config/colors";
import { setHovering } from "@/state/cursorStore";
import { audioEngine } from "@/audio/AudioEngine";

interface AsteroidProps {
  name: string;
  position: [number, number, number];
  size: number;
  spin: number;
  reducedMotion: boolean;
}

const STONE = new THREE.Color(palette.brass);

export function Asteroid({ name, position, size, spin, reducedMotion }: AsteroidProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (!reducedMotion) meshRef.current.rotation.y += delta * spin;
    const target = hovered ? 1.5 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          setHovering(true);
          audioEngine.hover();
        }}
        onPointerOut={() => {
          setHovered(false);
          setHovering(false);
        }}
      >
        {/* Low-poly rock; flat shading gives faceted stone under the belt light. */}
        <icosahedronGeometry args={[size, 0]} />
        <meshStandardMaterial color={STONE} flatShading roughness={0.9} metalness={0.2} />
      </mesh>

      {hovered ? (
        <Html center distanceFactor={16} position={[0, size + 0.6, 0]} pointerEvents="none">
          <div className="pointer-events-none select-none whitespace-nowrap rounded-sm bg-bg-deep/70 px-3 py-1 font-caption text-[0.7rem] uppercase tracking-[0.24em] text-gold">
            {name}
          </div>
        </Html>
      ) : null}
    </group>
  );
}
