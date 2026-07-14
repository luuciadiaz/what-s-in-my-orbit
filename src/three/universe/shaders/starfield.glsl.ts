/**
 * STARFIELD SHADERS
 *
 * Stars breathe: each carries a phase so twinkle is desynchronised across the
 * field, never a uniform pulse. Points are drawn as soft radial discs (no hard
 * edges) so the sky reads as engraved light, not pixels. Colour is a per-star
 * tint passed from geometry, keeping the palette (ivory/gold/dusty pink) intact.
 */

export const starfieldVertex = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uTwinkle;

  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vColor = aColor;

    // Desynchronised breathing: 0..1, gentle.
    float t = sin(uTime * 0.6 + aPhase) * 0.5 + 0.5;
    vTwinkle = mix(1.0 - uTwinkle, 1.0, t);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size attenuates with distance; scale by DPR for crisp points.
    float size = aSize * (0.6 + 0.4 * vTwinkle);
    gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
  }
`;

export const starfieldFragment = /* glsl */ `
  precision mediump float;

  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    // Soft radial disc with a warm core.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float core = smoothstep(0.5, 0.0, d);
    float glow = smoothstep(0.5, 0.15, d);
    float alpha = (glow * 0.5 + core * 0.5) * vTwinkle;

    gl_FragColor = vec4(vColor, alpha);
  }
`;
