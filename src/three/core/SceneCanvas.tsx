"use client";

/**
 * SceneCanvas — the WebGL root.
 *
 * Owns renderer configuration and scales it to the device tier: DPR is clamped,
 * antialiasing and heavy work are reserved for capable hardware, and under
 * reduced motion the render loop switches to on-demand so a still sky costs
 * almost nothing. Background and fog are pulled from the palette so the void is
 * deep midnight — never pure black.
 *
 * This component is dynamically imported with `ssr: false` by the Experience
 * wrapper: WebGL never runs on the server, and the accessible DOM shell renders
 * regardless of whether this ever mounts.
 */
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { palette } from "@/config/colors";
import { Universe } from "@/three/universe/Universe";
import { AmbientCamera } from "./AmbientCamera";

export default function SceneCanvas() {
  const budget = useDeviceTier();
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      dpr={[1, budget.maxDpr]}
      frameloop={reducedMotion ? "demand" : "always"}
      camera={{ position: [0, 0, 12], fov: 55, near: 0.1, far: 200 }}
      gl={{
        antialias: budget.tier === "high",
        alpha: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(new THREE.Color(palette.midnight), 1);
        // Fog deepens the void and hides the far edge of the star shell.
        scene.fog = new THREE.FogExp2(new THREE.Color(palette.midnightDeep), 0.008);
      }}
    >
      <AmbientCamera reducedMotion={reducedMotion} />
      <Universe budget={budget} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
