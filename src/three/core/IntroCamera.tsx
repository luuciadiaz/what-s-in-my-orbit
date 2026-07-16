"use client";

/**
 * IntroCamera — the cinematic dolly through the curtain.
 *
 * While the curtain is closed/parting, this owns the camera: it holds it far
 * back, then draws it forward as the curtain's `introProgress` rises, so the
 * visitor feels themselves passing through the opening into space. The moment
 * the curtain is fully open it hands the camera to OrbitControls (re-enabling
 * damping and idle drift) for free exploration.
 *
 * OrbitControls is neutralised during the intro (enabled/damping/auto-rotate
 * off) so drei's own update loop never fights the dolly.
 */
import { useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIntroPhase, getIntroProgress } from "@/state/introStore";

const ORIGIN = new THREE.Vector3(0, 0, 0);

interface Controls {
  target: THREE.Vector3;
  enabled: boolean;
  enableDamping: boolean;
  autoRotate: boolean;
  update: () => void;
}

export function IntroCamera({ reducedMotion }: { reducedMotion: boolean }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as unknown as Controls | null;
  const phase = useIntroPhase();

  useEffect(() => {
    if (!controls) return;
    if (phase === "open") {
      controls.target.copy(ORIGIN);
      controls.enabled = true;
      controls.enableDamping = true;
      controls.autoRotate = !reducedMotion;
      controls.update();
    } else {
      controls.enabled = false;
      controls.enableDamping = false;
      controls.autoRotate = false;
    }
  }, [phase, controls, reducedMotion]);

  useFrame(() => {
    if (phase === "open") return;
    const p = getIntroProgress();
    // Far and slightly elevated → settling into the home vantage.
    camera.position.set(0, 10 - p * 4, 62 - p * 32);
    camera.lookAt(ORIGIN);
  });

  return null;
}
