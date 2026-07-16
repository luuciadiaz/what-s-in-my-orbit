"use client";

/**
 * CelestialBillboard — a world rendered from a real image.
 *
 * The supplied planet/sun art are photographs of spheres (and gold reliefs) with
 * opaque backgrounds, not equirectangular maps — so we present each as a
 * camera-facing billboard and crop it to a centred circle in the shader, which
 * removes the square background (black, white, or checker) while keeping the
 * round body. A soft glow sits behind; hover swells and labels it; it registers
 * for the camera flight exactly like a procedural planet.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import type { PlanetConfig } from "@/config/planets";
import { palette } from "@/config/colors";
import { svgTexture } from "@/three/lib/svgTexture";
import { registerPlanet, unregisterPlanet } from "@/state/atlasStore";
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

// Drop the source photo's opaque background two ways: a centred circle crop
// (removes far corners) AND a "grayness" key — the backgrounds here (black,
// white, checker) are near-neutral gray with almost no chroma, while the gold
// sun and coloured planets carry real chroma. Keying on chroma removes any
// background while keeping the body, and lets the dark limb fade into space.
const FRAG = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform float uRatio;   // imgHeight / imgWidth
  uniform vec3 uShadow;   // gradient-map dark tone (shared, painterly)
  uniform vec3 uMid;      // planet's signature mid tone
  uniform vec3 uHi;       // gilded highlight
  uniform float uStylize; // 0 = photo, 1 = full antique duotone
  void main() {
    vec2 p = vUv - 0.5;
    p.y *= uRatio;
    float circle = smoothstep(0.5, 0.47, length(p));

    vec4 tex = texture2D(uMap, vUv);
    float mx = max(tex.r, max(tex.g, tex.b));
    float mn = min(tex.r, min(tex.g, tex.b));
    float chroma = mx - mn;
    float keyMask = smoothstep(0.04, 0.10, chroma);

    // Gradient map: keep the photo's luminance detail, recolour into the
    // antique palette so the planet reads as an engraved plate, not a photo.
    float l = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    vec3 grad = l < 0.5 ? mix(uShadow, uMid, l * 2.0) : mix(uMid, uHi, (l - 0.5) * 2.0);
    vec3 col = mix(tex.rgb, grad, uStylize);

    gl_FragColor = vec4(col, tex.a * circle * keyMask);
  }
`;

export function CelestialBillboard({ config, active, reducedMotion, paused, onHover, onActivate }: Props) {
  const revolveRef = useRef<THREE.Group>(null);
  const swellRef = useRef<THREE.Group>(null);
  const [angle] = useState(config.startAngle);
  const [ratio, setRatio] = useState(1);

  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load(`/art/planets/${config.texture}`, (loaded) => {
      const img = loaded.image as { width: number; height: number };
      if (img?.width) setRatio(img.height / img.width);
    });
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [config.texture]);

  const glowTex = useMemo(() => {
    const c = config.colorGlow;
    return svgTexture(
      `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><defs><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${c}" stop-opacity="0.55"/><stop offset="55%" stop-color="${c}" stop-opacity="0.14"/><stop offset="100%" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><circle cx="128" cy="128" r="128" fill="url(#g)"/></svg>`,
    );
  }, [config.colorGlow]);

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uRatio: { value: ratio },
      // Shared painterly shadow; per-planet mid; gilded highlight.
      uShadow: { value: new THREE.Color("#0e1a40") },
      uMid: { value: new THREE.Color(config.colorCore) },
      uHi: { value: new THREE.Color(config.colorGlow).lerp(new THREE.Color(palette.ivory), 0.5) },
      // Realistic universe: planets keep their photographic colour (no duotone).
      uStylize: { value: 0 },
    }),
    [texture, ratio, config.colorCore, config.colorGlow, config.isCenter],
  );
  uniforms.uRatio.value = ratio;

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
      const t = active ? 1.12 : 1;
      swellRef.current.scale.lerp(new THREE.Vector3(t, t, t), 0.12);
    }
  });

  const w = config.radius * (config.isCenter ? 3.7 : 2.0);
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
                <shaderMaterial vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} transparent depthWrite={false} />
              </mesh>

              {active ? (
                <Html center distanceFactor={18} position={[0, h * 0.5 + 0.6, 0]} pointerEvents="none">
                  <div className="pointer-events-none select-none whitespace-nowrap text-center">
                    <div className="font-display text-[2.6rem] leading-none text-gold">{config.glyph.symbol}</div>
                    <div className="mt-1 font-caption text-[0.7rem] uppercase tracking-[0.28em] text-ink">{config.discipline}</div>
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
