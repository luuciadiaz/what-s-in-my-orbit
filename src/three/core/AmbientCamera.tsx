"use client";

/**
 * AmbientCamera — the universe "slowly moves" before the visitor touches it.
 *
 * A whisper of camera drift on a slow Lissajous path so the sky feels alive at
 * rest. Amplitude is tiny and always eases back toward centre — never enough to
 * disorient. This is ambient life only; the interactive, drag-driven camera is
 * Phase 2 and will layer on top of (not fight) this idle motion.
 */
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AmbientCameraProps {
  reducedMotion: boolean;
}

const AMPLITUDE = 0.6;
const TARGET = new THREE.Vector3(0, 0, 0);

export function AmbientCamera({ reducedMotion }: AmbientCameraProps) {
  const camera = useThree((s) => s.camera);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.05) * AMPLITUDE;
    camera.position.y = Math.cos(t * 0.037) * AMPLITUDE * 0.6;
    camera.lookAt(TARGET);
  });

  return null;
}
