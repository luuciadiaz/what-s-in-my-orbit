"use client";

/**
 * AtlasGrade — the "printed on paper" finish over the whole scene.
 *
 * A non-interactive overlay that unifies the WebGL layer into an illuminated-
 * manuscript image: a soft gold glow blooming from the centre sun, a low dusty-
 * pink wash, a deepening vignette toward the edges, and a faint paper grain.
 * This is what turns a 3D render into an antique celestial engraving.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")";

export function AtlasGrade() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: "var(--z-content)",
        backgroundImage: [
          // gold bloom from the central sun
          "radial-gradient(circle at 50% 52%, rgba(224,192,103,0.14), transparent 42%)",
          // a light deep-ultramarine veil to settle the fresco back and lift
          // contrast for the planets and type
          "linear-gradient(rgba(9,17,50,0.34), rgba(9,17,50,0.34))",
          // deep-ultramarine vignette (matched to the fresco) — soft, so the
          // painted blue and its texture stay visible to the edges
          "radial-gradient(ellipse at center, transparent 58%, rgba(11,20,58,0.55) 100%)",
          // paper grain
          GRAIN,
        ].join(","),
      }}
    />
  );
}
