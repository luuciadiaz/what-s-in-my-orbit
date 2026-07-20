"use client";

/**
 * CurtainStage — the curtain as fluid cloth (WebGL).
 *
 * A full-screen transparent shader overlay above the universe. Instead of
 * slicing the painting in two and sliding flat halves apart, the fabric
 * GATHERS: as `introProgress` rises each panel's cloth is compressed toward its
 * outer edge (the painted pleats bunching tighter and falling into shadow)
 * behind a soft, drooping, rippling leading edge — heavy velvet drawn aside,
 * revealing the universe from the centre outward while the camera dollies in.
 * Non-interactive; unmounted once the curtain is open.
 */
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getIntroProgress } from "@/state/introStore";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0); // fullscreen quad
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform float uProgress;
  uniform float uTime;

  // One cloth panel gathering toward its screen edge. 't' runs 0 at the outer
  // (screen) edge to 1 at the leading (inner) edge. The panel's whole half of
  // the painting is squeezed linearly into its shrinking width, so at rest
  // (open = 0) texU == u and the two panels form one seamless painting — no gap,
  // no seam. As it opens, pleats and a gathering shadow emerge with progress.
  vec3 cloth(float t, float texU, float v, float freq) {
    vec3 rgb = texture2D(uTex, vec2(texU, v)).rgb;
    float pleat = mix(1.0, 0.74 + 0.26 * (0.5 + 0.5 * sin(t * freq)), uProgress);
    float gatherShade = mix(1.0, 0.58, smoothstep(0.6, 1.0, t) * uProgress);
    return rgb * pleat * gatherShade;
  }

  void main() {
    float u = vUv.x;
    float v = vUv.y;

    float open = 0.46 * uProgress;                      // half-width of the parted gap
    // Leading edge droops (catenary) and ripples — never a straight vertical cut.
    float droop = (0.5 - abs(v - 0.5)) * 0.05 * uProgress;
    float ripple = sin(v * 8.0 + uTime * 1.0) * 0.012 * uProgress;
    float freq = mix(30.0, 140.0, uProgress);           // pleats bunch tighter as it gathers

    float leftEdge  = 0.5 - open - droop + ripple;      // right border of the left panel
    float rightEdge = 0.5 + open + droop - ripple;      // left border of the right panel

    // Sample the gathered cloth for whichever side this pixel belongs to.
    vec3 rgb;
    if (u < 0.5) {
      float t = clamp(u / max(leftEdge, 1e-4), 0.0, 1.0);
      rgb = cloth(t, t * 0.5, v, freq);                 // left half of the painting
    } else {
      float t = clamp((1.0 - u) / max(1.0 - rightEdge, 1e-4), 0.0, 1.0);
      rgb = cloth(t, 1.0 - t * 0.5, v, freq);           // right half of the painting
    }

    // The parted gap, feathered. Its reveal is faded in with 'open', so at rest
    // the curtain is fully opaque (no sliver of sky at the centre); the opening
    // only appears once the panels genuinely start drawing back.
    float reveal = (u < 0.5)
      ? smoothstep(leftEdge, leftEdge - 0.012, u)
      : smoothstep(rightEdge, rightEdge + 0.012, u);
    float a = mix(1.0, reveal, smoothstep(0.0, 0.03, open));

    gl_FragColor = vec4(rgb, a);
  }
`;

function CurtainMesh() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load("/art/curtain.jpeg");
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  const uniforms = useMemo(
    () => ({ uTex: { value: texture }, uProgress: { value: 0 }, uTime: { value: 0 } }),
    [texture],
  );

  useFrame((_, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uProgress.value = getIntroProgress();
    matRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export function CurtainStage() {
  // No z-index of its own: it inherits the intro overlay's stacking so the DOM
  // title (rendered after it) always paints on top of the cloth.
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas orthographic gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0, 1] }}>
        <CurtainMesh />
      </Canvas>
    </div>
  );
}
