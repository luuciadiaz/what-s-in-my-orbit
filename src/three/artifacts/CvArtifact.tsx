"use client";

/**
 * CvArtifact — a mystical astronomical instrument.
 *
 * Not a satellite: an armillary sphere of gold rings turning in space, wrapped
 * in a soft glow. Hover reveals it; activating it (click or Enter/Space via the
 * accessible control) summons the CV download. It should feel like receiving a
 * charted gift, not clicking a button.
 */
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import { palette } from "@/config/colors";
import { cvArtifact } from "@/content/skills";
import { svgTexture } from "@/three/lib/svgTexture";
import { setHovering } from "@/state/cursorStore";
import { audioEngine } from "@/audio/AudioEngine";

const POSITION: [number, number, number] = [-12, 4, 8];

const glowSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><defs><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${palette.goldBright}" stop-opacity="0.9"/><stop offset="45%" stop-color="${palette.gold}" stop-opacity="0.35"/><stop offset="100%" stop-color="${palette.gold}" stop-opacity="0"/></radialGradient></defs><circle cx="128" cy="128" r="128" fill="url(#g)"/></svg>`;

/** Trigger the CV download from within the canvas. */
function summonCv() {
  const a = document.createElement("a");
  a.href = cvArtifact.href;
  a.download = cvArtifact.downloadName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function CvArtifact({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const glowTex = useMemo(() => svgTexture(glowSvg), []);

  useFrame((state, delta) => {
    if (!reducedMotion && ringsRef.current) ringsRef.current.rotation.y += delta * 0.4;
    if (groupRef.current) {
      // Gentle float.
      const bob = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.6) * 0.3;
      groupRef.current.position.set(POSITION[0], POSITION[1] + bob, POSITION[2]);
      const t = hovered ? 1.15 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(t, t, t), 0.12);
    }
  });

  const ringMat = <meshBasicMaterial color={palette.gold} toneMapped={false} />;

  return (
    <group ref={groupRef} position={POSITION}>
      {/* Soft glow behind the instrument. */}
      <Billboard>
        <mesh>
          <planeGeometry args={[5, 5]} />
          <meshBasicMaterial map={glowTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
      </Billboard>

      {/* Armillary rings. */}
      <group
        ref={ringsRef}
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
        onClick={(e) => {
          e.stopPropagation();
          audioEngine.select("origin");
          summonCv();
        }}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.035, 16, 96]} />
          {ringMat}
        </mesh>
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[1.2, 0.035, 16, 96]} />
          {ringMat}
        </mesh>
        <mesh rotation={[Math.PI / 2, Math.PI / 3, 0]}>
          <torusGeometry args={[1.0, 0.03, 16, 96]} />
          {ringMat}
        </mesh>
        {/* Equator band, a touch bolder. */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.35, 0.05, 8, 96]} />
          <meshBasicMaterial color={palette.goldBright} toneMapped={false} />
        </mesh>
        {/* Core. */}
        <mesh>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshBasicMaterial color={palette.goldBright} toneMapped={false} />
        </mesh>
      </group>

      {hovered ? (
        <Html center distanceFactor={18} position={[0, 2, 0]} pointerEvents="none">
          <div className="pointer-events-none select-none whitespace-nowrap text-center">
            <div className="font-caption text-[0.7rem] uppercase tracking-[0.28em] text-gold">
              {cvArtifact.label}
            </div>
            <div className="mt-1 font-caption text-[0.62rem] uppercase tracking-[0.2em] text-ink-soft">
              Descargar CV
            </div>
          </div>
        </Html>
      ) : null}

      {/* Accessible, keyboard-reachable download that mirrors the artifact. */}
      <Html>
        <a
          href={cvArtifact.href}
          download={cvArtifact.downloadName}
          className="sr-only"
        >
          {cvArtifact.label} — descargar CV
        </a>
      </Html>
    </group>
  );
}
