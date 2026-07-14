"use client";

/**
 * SceneCanvas — the WebGL root and the interactive camera.
 *
 * The camera IS the experience: OrbitControls give cinematic drag / trackpad /
 * touch orbiting with damping (momentum) and pinch-zoom, bounded so the visitor
 * can roam but never fall out of the atlas or lose the centre. At rest the whole
 * sky rotates almost imperceptibly (auto-rotate) — "the universe slowly moves".
 * Under reduced motion, auto-rotation stops and the loop renders on demand.
 *
 * Renderer settings scale to the device tier. Navigation is resolved here, in
 * the main React tree, then passed into the scene so router context survives the
 * WebGL reconciler boundary.
 */
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCoarsePointer } from "@/hooks/useCoarsePointer";
import { palette } from "@/config/colors";
import { Universe } from "@/three/universe/Universe";
import { CameraDirector } from "./CameraDirector";
import { enterPlanet } from "@/state/atlasStore";
import { audioEngine } from "@/audio/AudioEngine";

function selectWorld(slug: string) {
  audioEngine.select(slug);
  enterPlanet(slug);
}

export default function SceneCanvas() {
  const budget = useDeviceTier();
  const reducedMotion = useReducedMotion();
  const coarse = useCoarsePointer();

  return (
    <Canvas
      dpr={[1, budget.maxDpr]}
      frameloop={reducedMotion ? "demand" : "always"}
      camera={{ position: [0, 6, 30], fov: 55, near: 0.1, far: 300 }}
      gl={{ antialias: budget.tier === "high", alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(new THREE.Color(palette.midnight), 1);
        scene.fog = new THREE.FogExp2(new THREE.Color(palette.midnightDeep), 0.006);
      }}
    >
      <Universe budget={budget} reducedMotion={reducedMotion} coarse={coarse} onSelect={selectWorld} />
      <CameraDirector reducedMotion={reducedMotion} />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.45}
        zoomSpeed={0.7}
        minDistance={5}
        maxDistance={60}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.18}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
