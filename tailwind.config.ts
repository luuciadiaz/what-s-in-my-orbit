/**
 * Tailwind configuration.
 *
 * Tailwind is wired to the design tokens by REFERENCE, not by duplication:
 * colors/fonts point at the CSS variables produced by `src/config/*`. This
 * keeps a single source of truth — utilities and tokens can never drift apart.
 */
import type { Config } from "tailwindcss";
import { fontFamilies } from "./src/config/fonts";
import { breakpoints, spacing, container, radius } from "./src/config/layout";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: Object.fromEntries(
      Object.entries(breakpoints).map(([k, v]) => [k, `${v}px`]),
    ),
    extend: {
      colors: {
        // Reference semantic CSS variables — re-theming happens in config/colors.ts.
        bg: "var(--c-background-base)",
        "bg-deep": "var(--c-background-deep)",
        "bg-raised": "var(--c-background-raised)",
        ink: "var(--c-text-primary)",
        "ink-soft": "var(--c-text-secondary)",
        "ink-muted": "var(--c-text-muted)",
        gold: "var(--c-accent-gold)",
        "gold-bright": "var(--c-accent-goldBright)",
        brass: "var(--c-accent-brass)",
        copper: "var(--c-accent-copper)",
        ultramarine: "var(--c-accent-ultramarine)",
        focus: "var(--c-focus-ring)",
      },
      fontFamily: {
        display: [`var(${fontFamilies.display.var})`],
        heading: [`var(${fontFamilies.heading.var})`],
        body: [`var(${fontFamilies.body.var})`],
        caption: [`var(${fontFamilies.caption.var})`],
      },
      spacing,
      maxWidth: container,
      borderRadius: radius,
      transitionTimingFunction: {
        editorial: "var(--ease-editorial)",
        glide: "var(--ease-glide)",
        breathe: "var(--ease-breathe)",
        gravity: "var(--ease-gravity)",
      },
    },
  },
  plugins: [],
};

export default config;
