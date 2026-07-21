"use client";

/**
 * CelestialBillboard — a world rendered from a real photograph.
 *
 * Some worlds use a real planet photo (see `texture` in config/planets) instead
 * of the procedural surface. The photos are pictures of lit spheres on a
 * near-black field, not equirectangular maps, so we present each as a
 * camera-facing billboard. The shader drops only the dark background by
 * luminance (so bright bands / cores survive) and feathers the disk edge into
 * space — colours pass through untouched. A soft glow sits behind; hover swells
 * and labels it; it registers for the camera flight exactly like a procedural
 * planet. The Sun photo is an emitter, so it blends additively.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import type { PlanetConfig } from "@/config/planets";
import { svgTexture } from "@/three/lib/svgTexture";
import { registerPlanet, unregisterPlanet, getAtlas, isUniverseDimmed, spotlitPlanet } from "@/state/atlasStore";
import { setHovering } from "@/state/cursorStore";
import { audioEngine } from "@/audio/AudioEngine";

interface Props {
  config: PlanetConfig;
  active: boolean;
  reducedMotion: boolean;
  paused: boolean;
  onHover: (slug: string | null) => void;
  onActivate: (slug: string) => void;
}

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

// The real planet photographs sit on a near-black field. Drop only the dark
// background by LUMINANCE (so Jupiter's white bands and the Sun's bright core
// survive — a chroma key would gut them, and a hard circle would clip Saturn's
// rings), then a soft circular falloff trims the square corners and any dim halo
// beyond the disk. The night-side limb fades naturally into space. Colours pass
// through untouched.
const FRAG = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform float uDim; // 1 = full; <1 recedes when another world is focused
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    float l = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    float lumKey = smoothstep(0.02, 0.09, l);
    float r = length(vUv - 0.5);
    float circle = 1.0 - smoothstep(0.45, 0.5, r);
    gl_FragColor = vec4(tex.rgb * uDim, tex.a * lumKey * circle);
  }
`;

export function CelestialBillboard({ config, active, reducedMotion, paused, onHover, onActivate }: Props) {
  const revolveRef = useRef<THREE.Group>(null);
  const swellRef = useRef<THREE.Group>(null);
  const [angle] = useState(config.startAngle);
  const [ratio, setRatio] = useState(1);
  // The Sun is a light source, not a lit solid — blend it additively.
  const emitter = config.texture === "sun.webp";

  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load(`/art/planets/${config.texture}`, (loaded) => {
      const img = loaded.image as { width: number; height: number };
      if (img?.width) setRatio(img.height / img.width);
    });
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [config.texture]);

  const glowTex = useMemo(() => {
    const c = config.atmosphere;
    return svgTexture(
      `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><defs><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${c}" stop-opacity="0.5"/><stop offset="55%" stop-color="${c}" stop-opacity="0.12"/><stop offset="100%" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><circle cx="128" cy="128" r="128" fill="url(#g)"/></svg>`,
    );
  }, [config.atmosphere]);

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uDim: { value: 1 },
    }),
    [texture],
  );

  useEffect(() => {
    const node = swellRef.current;
    if (node) registerPlanet(config.slug, node);
    return () => unregisterPlanet(config.slug);
  }, [config.slug]);

  useFrame((_, delta) => {
    if (!reducedMotion && !paused && revolveRef.current && config.orbitRadius > 0) {
      revolveRef.current.rotation.y += delta * config.orbitSpeed;
    }
    if (swellRef.current) {
      const t = active ? 1.1 : 1;
      swellRef.current.scale.lerp(new THREE.Vector3(t, t, t), 0.12);
    }
    // Recede when another world holds the spotlight.
    const st = getAtlas();
    const target = !isUniverseDimmed(st) || spotlitPlanet(st) === config.slug ? 1 : 0.3;
    uniforms.uDim.value += (target - uniforms.uDim.value) * Math.min(1, delta * 4);
  });

  // Disk fills ~0.88 of the padded texture, so this width makes the visible disk
  // ≈ the sphere diameter (2·radius) the config asks for.
  const w = config.radius * 2.3;
  const h = w * ratio;

  return (
    <group rotation={[config.orbitTilt, 0, 0]}>
      <group ref={revolveRef} rotation={[0, angle, 0]}>
        <group position={[config.orbitRadius, 0, 0]}>
          <group ref={swellRef}>
            <Billboard>
              {/* Glow behind */}
              <mesh position={[0, 0, -0.05]} scale={Math.max(w, h) * 1.5}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial map={glowTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
              </mesh>

              {/* The body */}
              <mesh
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
                <planeGeometry args={[w, h]} />
                <shaderMaterial
                  vertexShader={VERT}
                  fragmentShader={FRAG}
                  uniforms={uniforms}
                  transparent
                  depthWrite={false}
                  toneMapped={!emitter}
                  blending={emitter ? THREE.AdditiveBlending : THREE.NormalBlending}
                />
              </mesh>

              {active ? (
                <Html center distanceFactor={18} position={[0, h * 0.5 + 0.5, 0]} pointerEvents="none">
                  <div className="pointer-events-none select-none whitespace-nowrap text-center">
                    <div
                      className="font-hand text-[1.55rem] leading-none tracking-wide text-ink"
                      style={{ textShadow: "0 1px 10px rgba(7,13,40,0.95), 0 0 22px rgba(7,13,40,0.7)" }}
                    >
                      {config.discipline}
                    </div>
                  </div>
                </Html>
              ) : null}
            </Billboard>
          </group>
        </group>
      </group>
    </group>
  );
}
