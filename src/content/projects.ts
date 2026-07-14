/**
 * PROJECTS CONTENT
 *
 * The five worlds of the atlas. Each maps 1:1 to a planet in the WebGL layer
 * and to a crawlable article in the DOM. Placeholder copy follows the brief's
 * per-planet themes; replace the prose while keeping the structure.
 *
 * Order here is the order of discovery in the atlas.
 */

import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "mercury",
    planet: "mercury",
    glyph: { symbol: "☿", label: "Mercury" },
    discipline: "Communication & PR",
    title: "The Messenger",
    tagline: "Words that travel faster than the thing they describe.",
    themes: ["Strategy", "Messaging", "PR", "Words"],
    year: "2024",
    paragraphs: [
      "A communication programme built on speed and precision — the art of " +
        "saying the right thing at the exact moment it can still change a mind.",
      "Small orbiting ideas, released in sequence, each one pulling the story " +
        "a little further into view.",
    ],
  },
  {
    slug: "venus",
    planet: "venus",
    glyph: { symbol: "♀", label: "Venus" },
    discipline: "Creative Direction",
    title: "The Luminous",
    tagline: "Beauty as an argument, not an ornament.",
    themes: ["Beauty", "Emotion", "Luxury", "Direction"],
    year: "2023",
    paragraphs: [
      "Creative direction for a house that sells feeling before product — soft " +
        "light, warm atmosphere, dust suspended in a shaft of gold.",
      "Every frame tuned until elegance stopped being a style and became the " +
        "message itself.",
    ],
  },
  {
    slug: "mars",
    planet: "mars",
    glyph: { symbol: "♂", label: "Mars" },
    discipline: "Campaigns & PR",
    title: "The Bold",
    tagline: "Ideas with enough mass to move an audience.",
    themes: ["Campaigns", "Action", "Impact", "Contrast"],
    year: "2023",
    paragraphs: [
      "A campaign built for wind and momentum — strong contrast, decisive " +
        "movement, a single bold gesture repeated until it became a signal.",
      "The kind of idea that doesn't ask for attention so much as redirect it.",
    ],
  },
  {
    slug: "jupiter",
    planet: "jupiter",
    glyph: { symbol: "♃", label: "Jupiter" },
    discipline: "Large-scale Brands",
    title: "The Sovereign",
    tagline: "Ambition at the scale of a gravity well.",
    themes: ["Scale", "Luxury", "Ambition", "Power"],
    year: "2022",
    paragraphs: [
      "Brand work for a house large enough to bend the market around it — slow, " +
        "grand, unhurried, aware of its own weight.",
      "Power expressed not as loudness but as the confidence to move slowly.",
    ],
  },
  {
    slug: "saturn",
    planet: "saturn",
    glyph: { symbol: "♄", label: "Saturn" },
    discipline: "Brand Systems & Identity",
    title: "The Architect",
    tagline: "Structure so precise it reads as inevitability.",
    themes: ["Systems", "Identity", "Structure", "Editorial"],
    year: "2022",
    paragraphs: [
      "A complete brand system — perfect geometry, beautiful rings of rules " +
        "that hold every future application in orbit.",
      "Editorial precision applied until the identity felt less designed than " +
        "discovered.",
    ],
  },
];

/** Fast lookup by slug for the /orbit/[slug] route. */
export const projectBySlug = Object.fromEntries(
  projects.map((p) => [p.slug, p]),
) as Record<string, Project>;
