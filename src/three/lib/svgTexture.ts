/**
 * SVG → texture pipeline.
 *
 * Our illustrated, engraved look is generated as vector art (crisp at any size,
 * palette-driven, no external assets) and rasterised into three textures at
 * runtime. This is how planets, the sun and the zodiac wheel get their gold
 * linework without shipping image files — the "placeholders now" art layer.
 *
 * Textures are cached by their SVG source so repeated art (shared engravings)
 * is only rasterised once.
 */
import * as THREE from "three";

const cache = new Map<string, THREE.Texture>();

/**
 * Turn an SVG document string into a texture. Rasterisation is asynchronous
 * (the browser decodes the SVG as an image); the texture updates itself once
 * ready, so it is safe to use immediately.
 */
export function svgTexture(svg: string): THREE.Texture {
  const existing = cache.get(svg);
  if (existing) return existing;

  const texture = new THREE.Texture();
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = false;

  if (typeof window !== "undefined") {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      texture.image = image;
      texture.needsUpdate = true;
    };
    image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  cache.set(svg, texture);
  return texture;
}
