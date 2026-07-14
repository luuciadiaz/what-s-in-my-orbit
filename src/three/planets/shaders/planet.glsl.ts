/**
 * PLANET SHADERS
 *
 * A celestial object from an antique atlas, not a photoreal planet. The surface
 * is a base pigment shaped by soft directional light and gentle noise mottling,
 * overlaid with a faint gold graticule (the engraved longitude/latitude lines of
 * a hand-drawn globe) and wrapped in a fresnel atmosphere rim in the planet's
 * glow colour. All colours are passed in from the palette-driven config.
 */

export const planetVertex = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vPosW = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const planetFragment = /* glsl */ `
  precision highp float;

  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying vec2 vUv;

  uniform vec3 uColor;     // core pigment
  uniform vec3 uGlow;      // atmosphere / engraving light
  uniform float uTime;
  uniform vec3 uCameraPos;

  // Cheap value noise for surface mottling.
  float hash(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y); }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
               mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
  }
  float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<4;i++){v+=a*noise(p);p*=2.0;a*=0.5;} return v; }

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(uCameraPos - vPosW);

    // Soft key light for dimensionality — antique, not harsh.
    vec3 L = normalize(vec3(0.5, 0.7, 0.6));
    float diff = clamp(dot(N, L), 0.0, 1.0);
    float shade = 0.35 + 0.65 * diff;

    // Surface mottling — subtle banding like aged ink wash.
    float band = fbm(vUv * vec2(6.0, 12.0) + vec2(0.0, uTime * 0.01));
    vec3 base = mix(uColor * 0.75, uColor, band);
    base *= shade;

    // Engraved graticule: faint gold lines along longitude/latitude.
    vec2 grid = fract(vUv * vec2(16.0, 9.0));
    vec2 gd = min(grid, 1.0 - grid);
    float line = 1.0 - smoothstep(0.0, 0.02, min(gd.x, gd.y));
    base += uGlow * line * 0.18;

    // A brighter engraved equator band, like a celestial globe's ecliptic.
    float eq = 1.0 - smoothstep(0.0, 0.012, abs(vUv.y - 0.5));
    base += uGlow * eq * 0.35;

    // Gold star-specks scattered across the surface — celestial engraving.
    vec2 sc = vUv * vec2(42.0, 22.0);
    vec2 cell = floor(sc);
    float rnd = hash(cell);
    float speck = step(0.955, rnd);
    vec2 fc = fract(sc) - 0.5;
    float dotm = 1.0 - smoothstep(0.0, 0.16, length(fc));
    base += uGlow * speck * dotm * 0.7;

    // Fresnel atmosphere rim.
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.5);
    base += uGlow * fres * 0.9;

    gl_FragColor = vec4(base, 1.0);
  }
`;

/**
 * ATMOSPHERE SHELL — a slightly larger back-facing sphere that adds a soft halo
 * of glow around the planet's silhouette. Rendered additively.
 */
export const atmosphereVertex = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vPosW = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const atmosphereFragment = /* glsl */ `
  precision highp float;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  uniform vec3 uGlow;
  uniform vec3 uCameraPos;
  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(uCameraPos - vPosW);
    float rim = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
    gl_FragColor = vec4(uGlow, rim * 0.6);
  }
`;
