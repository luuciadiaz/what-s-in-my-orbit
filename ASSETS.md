# Cómo añadir tus propios elementos

Guía rápida para reemplazar los placeholders por tu arte y tus fuentes.
Todo está pensado para que sueltes archivos y (a lo sumo) cambies una línea.

---

## 1. Constelaciones ilustradas
📁 `public/art/constellations/`  ·  ⚙️ `src/config/constellations.ts`

- SVG (line-art, transparente) o PNG transparente.
- Pon el archivo y cambia `src: null` → `src: "tu-archivo.svg"` en la figura.
- Detalles: ver el README de esa carpeta.

## 2. Texturas de planetas
📁 `public/art/planets/`  ·  ⚙️ `src/config/planets.ts`

- Cada mundo puede usar una **fotografía real** (esfera iluminada sobre fondo
  oscuro, en `.webp`) o quedarse como esfera 3D procedural. El mapa `TEXTURES`
  en `src/config/planets.ts` decide qué foto va en cada disciplina:
  `brand-strategy`, `events`, `pr`, `content-social`, `campaigns`.
- Para mover una foto: cambia el nombre en `TEXTURES`. Para volver un mundo a
  procedural: borra su entrada. Los colores de la foto se respetan tal cual (el
  shader solo recorta el fondo oscuro por luminancia). Saturno ya trae sus
  anillos en la foto, así que su anillo procedural se desactiva.
- Fotos cuadradas, planeta centrado sobre negro (Saturno puede llevar anillos).

## 3. Sol central / ornamentos (soles secundarios, querubines, cartelas)
📁 `public/art/ornaments/`

- SVG o PNG transparente. Dime dónde quieres cada uno y lo coloco.

## 4. CV (curriculum)
📁 `public/cv/`  ·  ⚙️ `src/content/skills.ts` (`cvArtifact`)

- Reemplaza `public/cv/placeholder-cv.pdf` por tu CV real (mismo nombre, o
  cambia `href`/`downloadName` en `cvArtifact`).
- Se descarga al activar el instrumento celeste (armillar) en la escena.

## 5. Tipografías
📁 `public/fonts/`  ·  ⚙️ `src/config/fonts.ts`

- `.woff2` (recomendado) o nombres de Google Fonts.
- 4 roles: `display`, `heading`, `body`, `caption`. Dime qué va en cada uno.
- Ver el README de esa carpeta.

## 6. Colores
⚙️ `src/config/colors.ts`

- Toda la paleta vive ahí (pigmentos + roles + color por planeta). Cambiar un
  valor se propaga a toda la web.

## 7. Textos
📁 `src/content/`

- `hero`, `about`, `projects`, `skills`, `quotes`, `navigation` — edita el texto
  sin tocar el diseño.

---

**La forma más fácil:** súbeme los archivos por el chat y yo los meto y cableo.
