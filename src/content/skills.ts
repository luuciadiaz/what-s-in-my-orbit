/**
 * SKILLS CONTENT
 *
 * Rendered as an asteroid belt in the WebGL layer, and as a grouped list for
 * assistive tech / no-JS. Each skill is one asteroid.
 */

import type { Skill } from "./types";

export const skills: Skill[] = [
  { name: "Creative Direction", category: "Craft" },
  { name: "Art Direction", category: "Craft" },
  { name: "Campaigns", category: "Craft" },
  { name: "Copywriting", category: "Craft" },
  { name: "Social Media", category: "Craft" },

  { name: "Brand Strategy", category: "Strategy" },
  { name: "Creative Strategy", category: "Strategy" },
  { name: "Communication", category: "Strategy" },
  { name: "PR", category: "Strategy" },

  { name: "Figma", category: "Tools" },
  { name: "Adobe Suite", category: "Tools" },
  { name: "AI Workflows", category: "Tools" },
];

/** The CV artifact — the glowing astronomical instrument. */
export const cvArtifact = {
  label: "Celestial Instrument",
  description: "A mystical astronomical instrument. Activate it to receive the CV.",
  /** Path to the downloadable file. Placeholder until the real CV is added. */
  href: "/cv/placeholder-cv.pdf",
  downloadName: "curriculum-vitae.pdf",
} as const;
