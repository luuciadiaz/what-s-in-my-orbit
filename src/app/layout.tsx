/**
 * ROOT LAYOUT
 *
 * Responsibilities:
 *   1. Inject the full design-token set as CSS variables on <html> — one place,
 *      once, so every component downstream reads tokens, never literals.
 *   2. Declare SEO metadata. The experience is WebGL, but the DOM must remain
 *      fully describable to crawlers and assistive technology.
 *
 * The real display/heading/body typefaces are wired here later (next/font),
 * populating the same `--font-*` variables the token system already defines —
 * a drop-in swap that touches nothing else.
 */

import type { Metadata, Viewport } from "next";
import { Caveat } from "next/font/google";
import { rootCssVars } from "@/config/tokens";
import { hero } from "@/content/hero";
import { Cursor } from "@/ui/cursor/Cursor";
import "./globals.css";

/**
 * Handwritten voice — used for the world labels and the navbar signature, so
 * the atlas is annotated by a human hand. Populates `--font-hand`, which the
 * token contract (config/fonts) and Tailwind (`font-hand`) read.
 */
const handwritten = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "What's in my Orbit? — A Celestial Atlas Portfolio",
    template: "%s · What's in my Orbit?",
  },
  description:
    "An interactive celestial atlas. Each orbit is a creative discipline; " +
    "each world is a project. Explore the mind of a Creative Director.",
  keywords: [
    "creative director",
    "portfolio",
    "brand strategy",
    "art direction",
    "celestial atlas",
  ],
  openGraph: {
    title: "What's in my Orbit?",
    description: "A personal celestial atlas — explore the mind of a Creative Director.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B1026",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={handwritten.variable} style={rootCssVars as React.CSSProperties}>
      <body>
        {/*
         * Detect WebGL before first paint and flag <html>, so the immersive
         * canvas takes over with no flash of the text fallback. Progressive
         * enhancement: if this fails, the accessible atlas simply renders.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var c=document.createElement('canvas');" +
              "if(window.WebGLRenderingContext&&(c.getContext('webgl')||c.getContext('experimental-webgl')))" +
              "{document.documentElement.dataset.webgl='on'}}catch(e){}",
          }}
        />
        <a href="#atlas" className="skip-link">
          Skip to the atlas
        </a>
        {/* Screen-reader orientation — the visual layer is near-silent by design. */}
        <p className="sr-only">{hero.srIntro}</p>
        {children}
        <Cursor />
      </body>
    </html>
  );
}
