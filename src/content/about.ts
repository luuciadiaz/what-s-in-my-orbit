/**
 * ABOUT / ORIGIN CONTENT
 *
 * "Origin" is the visitor's home world — biography, experience, manifesto and
 * contact. Placeholder copy on-tone; swap freely.
 */

export const about = {
  glyph: { symbol: "◉", label: "Origin" },
  title: "Origin",
  subtitle: "Where the atlas begins",

  manifesto: [
    "I believe a brand is a small cosmology — a set of fixed stars people " +
      "learn to navigate by.",
    "My work is the drawing of those charts: the discipline of making " +
      "meaning legible, and the craft of making it beautiful.",
  ],

  biography: [
    "A creative director working across strategy, campaigns and brand systems. " +
      "I move between the telescope and the engraving tool — the long view and " +
      "the fine line.",
    "This atlas gathers the worlds I've charted so far. Each one is a project; " +
      "each orbit, a way of thinking.",
  ],

  experience: [
    { role: "Creative Director", place: "Independent", period: "2021 — Present" },
    { role: "Art Director", place: "Studio (placeholder)", period: "2018 — 2021" },
    { role: "Designer", place: "Agency (placeholder)", period: "2015 — 2018" },
  ],

  contact: {
    label: "Correspondence",
    email: "hello@example.com",
    note: "Open to commissions, collaborations and long conversations about stars.",
  },
} as const;
