/**
 * REALISTIC PLANET SHADERS
 *
 * A believable 3D world, lit by a single off-scene sun so every planet shares a
 * day/night terminator. The surface is generated procedurally from 3D noise on
 * the sphere (no UV seams) in one of two styles:
 *   rocky — oceans, land and ice caps;
 *   gas   — banded, turbulent atmosphere (Saturn/Jupiter).
 * Every look knob (colours, feature scale, contrast, seed, style) is a uniform,
 * so a planet's appearance is defined entirely by its config entry — nothing is
 * baked into the shader. A fresnel rim adds the atmosphere, brighter on the lit
 * limb where a real atmosphere scatters light.
 */

export const planetVertex = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying vec3 vPosObj;
  void main() {
    vPosObj = position;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPosW = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

/** Shared 3D value-noise + fbm, used by surface and cloud shaders. */
const NOISE = /* glsl */ `
  float hash(vec3 p){ p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float noise(vec3 x){
    vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                   mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                   mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p){ float v = 0.0, a = 0.5; for(int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.02; a *= 0.5; } return v; }
`;

export const planetFragment = /* glsl */ `
  precision highp float;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying vec3 vPosObj;

  uniform vec3 uColorLow;   // oceans / dark bands
  uniform vec3 uColorMid;   // land / mid bands
  uniform vec3 uColorHigh;  // highlands / light bands
  uniform vec3 uPole;       // ice caps (rocky)
  uniform vec3 uAtmo;       // atmosphere rim
  uniform float uType;      // 0 rocky, 1 gas
  uniform float uNoiseScale;
  uniform float uContrast;
  uniform float uSeed;
  uniform float uTime;
  uniform vec3 uLightDir;
  uniform vec3 uCameraPos;

  ${NOISE}

  void main() {
    vec3 sp = normalize(vPosObj);
    vec3 surf;
    float waterMask = 0.0;

    if (uType < 0.5) {
      // ---- Rocky world: elevation -> water / land / highland, plus ice caps.
      float e = fbm(sp * uNoiseScale + uSeed);
      e = pow(clamp(e, 0.0, 1.0), mix(1.0, 2.2, uContrast));
      float level = 0.46;
      float land = smoothstep(level - 0.04, level + 0.04, e);
      vec3 landCol = mix(uColorMid, uColorHigh, smoothstep(level, 1.0, e));
      surf = mix(uColorLow, landCol, land);
      waterMask = 1.0 - land;
      // Polar ice.
      float ice = smoothstep(0.60, 0.86, abs(sp.y));
      surf = mix(surf, uPole, ice * 0.92);
      waterMask *= 1.0 - ice;
    } else {
      // ---- Gas giant: latitude bands warped by turbulence, with a storm.
      float turb = fbm(sp * vec3(1.6, 5.0, 1.6) * 0.7 + uSeed) - 0.5;
      float band = sp.y * uNoiseScale * 0.28 + turb * 0.55;
      float t = 0.5 + 0.5 * sin(band * 6.28318);
      t = pow(t, mix(1.0, 1.8, uContrast));
      surf = mix(uColorLow, uColorMid, t);
      surf = mix(surf, uColorHigh, smoothstep(0.55, 1.0, t) * 0.7);
      // A single great storm oval in the southern hemisphere.
      float storm = smoothstep(0.16, 0.0, length((sp - normalize(vec3(0.5, -0.35, 0.8))) ));
      surf = mix(surf, uColorHigh, storm * 0.5);
    }

    // ---- Lighting: single sun, real day/night terminator.
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(uCameraPos - vPosW);
    vec3 L = normalize(uLightDir);
    float lam = dot(N, L);
    float day = smoothstep(-0.08, 0.30, lam);
    vec3 lit = surf * (0.06 + 1.10 * clamp(lam, 0.0, 1.0));
    vec3 night = surf * 0.05;
    vec3 color = mix(night, lit, day);

    // Ocean sun-glint.
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 60.0) * waterMask * day;
    color += vec3(1.0) * spec * 0.35;

    // Atmosphere rim — brighter where the sun grazes the limb.
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
    color += uAtmo * fres * (0.25 + 0.90 * day);

    gl_FragColor = vec4(color, 1.0);
  }
`;

/** Outer halo shell (back-facing, additive) — the glow around the silhouette. */
export const atmosphereVertex = planetVertex;

export const atmosphereFragment = /* glsl */ `
  precision highp float;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying vec3 vPosObj;
  uniform vec3 uAtmo;
  uniform vec3 uLightDir;
  uniform vec3 uCameraPos;
  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(uCameraPos - vPosW);
    float rim = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
    float day = smoothstep(-0.10, 0.40, dot(N, normalize(uLightDir)));
    gl_FragColor = vec4(uAtmo, rim * (0.12 + 0.55 * day));
  }
`;

/** Optional cloud layer — thin fbm veil, only visible on the day side. */
export const cloudVertex = planetVertex;

export const cloudFragment = /* glsl */ `
  precision highp float;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying vec3 vPosObj;
  uniform float uNoiseScale;
  uniform float uSeed;
  uniform float uTime;
  uniform vec3 uLightDir;

  ${NOISE}

  void main() {
    vec3 sp = normalize(vPosObj);
    float c = fbm(sp * uNoiseScale * 0.85 + vec3(uSeed) + vec3(uTime * 0.02, 0.0, 0.0));
    float a = smoothstep(0.54, 0.78, c);
    vec3 N = normalize(vNormalW);
    float day = smoothstep(-0.05, 0.32, dot(N, normalize(uLightDir)));
    vec3 col = mix(vec3(0.02), vec3(1.0), day);
    gl_FragColor = vec4(col, a * day * 0.9);
  }
`;
