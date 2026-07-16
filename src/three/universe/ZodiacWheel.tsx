"use client";

/**
 * ZodiacWheel — the gilded astrolabe the atlas turns within.
 *
 * The zodiac linework laid flat on the ecliptic. Its ink (the generated SVG's
 * alpha) is filled with the real gold-leaf texture, so the wheel reads as actual
 * gilding rather than flat colour. Faint and slowly turning (still under reduced
 * motion), it frames every orbit without competing with the planets.
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

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

// Ink alpha from the SVG, colour from the gold-leaf texture.
const FRAG = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uInk;
  uniform sampler2D uGold;
  uniform float uOpacity;
  void main() {
    float ink = texture2D(uInk, vUv).a;
    vec3 gold = texture2D(uGold, vUv * 2.0).rgb;
    gl_FragColor = vec4(gold, ink * uOpacity);
  }
`;

export function ZodiacWheel({ reducedMotion }: ZodiacWheelProps) {
  const ref = useRef<THREE.Mesh>(null);

  const inkTex = useMemo(
    () => svgTexture(zodiacWheelSvg({ gold: palette.gold, brass: palette.brass })),
    [],
  );

  const goldTex = useMemo(() => {
    const t = new THREE.TextureLoader().load("/art/ornaments/gold-textures.webp");
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  const uniforms = useMemo(
    () => ({ uInk: { value: inkTex }, uGold: { value: goldTex }, uOpacity: { value: 0.5 } }),
    [inkTex, goldTex],
  );

  useFrame((_, delta) => {
    if (!reducedMotion && ref.current) ref.current.rotation.z += delta * 0.006;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[RADIUS * 2, RADIUS * 2]} />
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
