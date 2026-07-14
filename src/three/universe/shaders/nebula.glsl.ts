/**
 * NEBULA SHADERS
 *
 * Almost-imperceptible drifting clouds of colour behind the stars. Value-noise
 * FBM (cheap, no textures) tinted between two palette colours, faded to nothing
 * at the plane edges so each nebula reads as a soft smoke, never a rectangle.
 * Opacity is deliberately low — atmosphere, not spectacle.
 */

export const nebulaVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const nebulaFragment = /* glsl */ `
  precision mediump float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  uniform float uSpeed;

  // Hash + value noise — no texture dependency.
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    // Slow, drifting coordinates.
    vec2 p = vUv * 3.0;
    float drift = uTime * uSpeed;
    float n = fbm(p + vec2(drift, drift * 0.5));
    n = fbm(p + n + vec2(-drift * 0.3, drift * 0.2));

    // Radial falloff so edges dissolve.
    float edge = smoothstep(0.5, 0.05, distance(vUv, vec2(0.5)));

    vec3 color = mix(uColorA, uColorB, n);
    float alpha = n * edge * uOpacity;

    gl_FragColor = vec4(color, alpha);
  }
`;
