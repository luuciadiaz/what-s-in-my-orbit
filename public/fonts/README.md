# Tipografías

El sistema tipográfico está construido para intercambiarse sin tocar los
componentes. Hay **4 roles**:

| Rol       | Dónde se usa                    | Variable CSS      |
|-----------|---------------------------------|-------------------|
| `display` | Título gigante ("What's in…")   | `--font-display`  |
| `heading` | Títulos de sección              | `--font-heading`  |
| `body`    | Texto de lectura                | `--font-body`     |
| `caption` | Etiquetas y mayúsculas pequeñas | `--font-caption`  |

## Opción A — Archivos de fuente (recomendado)
1. Pon los archivos aquí, preferible **`.woff2`** (o `.woff`/`.ttf`/`.otf`).
2. Dime qué archivo va en qué rol, p. ej.:
   - Display = `NombreFuente-Regular.woff2`
   - Body = `OtraFuente-Regular.woff2`
3. Yo las cableo con `next/font/local` a las variables `--font-*`. Nada más cambia.

## Opción B — Google Fonts
Solo dime los nombres por rol (p. ej. "Display = Cormorant Garamond,
Body = EB Garamond") y las conecto.

> No necesitas editar código: dame los archivos o los nombres y yo lo hago.
> Mientras tanto, la web usa una pila serif de respaldo elegante.
