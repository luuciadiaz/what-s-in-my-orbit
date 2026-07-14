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

- PNG/JPG **equirectangular** (proporción 2:1, p. ej. 2048×1024) para que
  envuelva la esfera.
- Dime el archivo por planeta (`mercury`, `venus`, `mars`, `jupiter`, `saturn`,
  `origin`) y lo cableo al shader. (Hoy los planetas son grabados procedurales.)

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
