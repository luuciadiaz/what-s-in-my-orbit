# Constelaciones ilustradas

Aquí van tus figuras de constelaciones (el cisne, el toro, la lira…), como en
un atlas celeste antiguo.

## Formato
- **SVG** (ideal): line-art vectorial, fondo transparente. Si es de un solo color
  (negro o dorado), mejor — se puede teñir al oro de la paleta.
- **PNG** con transparencia también sirve (mínimo ~1024×1024).

## Cómo reemplazar un placeholder
1. Pon el archivo aquí, p. ej. `cygnus.svg`.
2. Abre `src/config/constellations.ts` y en esa figura cambia:
   `src: null`  →  `src: "cygnus.svg"`
3. Listo — la figura procedural se reemplaza por la tuya.

Los ids disponibles ahora (placeholders): `cygnus`, `taurus`, `sagittarius`,
`ursaMajor`, `lyra`. Puedes añadir más entradas nuevas en ese mismo archivo
(posición, tamaño y opacidad son configurables).

> Consejo: dibújalas dentro de un lienzo cuadrado (p. ej. 512×512) y centradas,
> para que el tamaño quede consistente entre figuras.
