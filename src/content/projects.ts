/**
 * PROJECTS CONTENT
 *
 * The five discipline-worlds of the atlas. Each maps 1:1 to a planet in the
 * WebGL layer (by slug) and to a crawlable article in the DOM. `discipline` is
 * the name shown beside the planet and as the project-preview heading; edit the
 * prose freely while keeping the structure.
 *
 * Order here is the order of discovery in the atlas.
 */

import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "brand-strategy",
    glyph: { symbol: "◉", label: "Brand Strategy" },
    discipline: "Brand Strategy & Creative Direction",
    title: "The Core",
    tagline: "The gravity every other world orbits.",
    themes: ["Strategy", "Positioning", "Creative Direction", "Vision"],
    year: "2024",
    paragraphs: [
      "The centre of the system — where a brand's reason to exist is defined " +
        "and the creative direction that expresses it is set. Everything else " +
        "orbits this.",
      "Strategy made visible: a clear idea given enough mass that campaigns, " +
        "content and events all fall naturally into its pull.",
    ],
  },
  {
    slug: "events",
    glyph: { symbol: "✦", label: "Events" },
    discipline: "Events",
    title: "The Gathering",
    tagline: "Moments built to be remembered, not just attended.",
    themes: ["Experiential", "Production", "Live", "Atmosphere"],
    year: "2024",
    paragraphs: [
      "Experiences designed as worlds of their own — every detail, from arrival " +
        "to afterglow, tuned so the brand is felt rather than shown.",
      "Live moments engineered for meaning: the kind people carry out the door " +
        "and keep telling other people about.",
    ],
  },
  {
    slug: "pr",
    glyph: { symbol: "✶", label: "PR" },
    discipline: "PR",
    title: "The Signal",
    tagline: "The right story reaching the right ears at the right time.",
    themes: ["Media", "Reputation", "Messaging", "Relationships"],
    year: "2023",
    paragraphs: [
      "Public relations as precision, not volume — shaping the narrative and " +
        "placing it where it can still change a mind.",
      "Reputation built patiently, one true story at a time, until the brand " +
        "is spoken about the way it wants to be.",
    ],
  },
  {
    slug: "content-social",
    glyph: { symbol: "✺", label: "Content & Social Media" },
    discipline: "Content & Social Media",
    title: "The Chorus",
    tagline: "Stories, visuals and conversations that bring a brand's world to life across platforms.",
    themes: ["Content", "Social", "Community", "Editorial"],
    year: "2023",
    paragraphs: [
      "The daily voice of the brand — content and social built as an ongoing " +
        "conversation, consistent enough to recognise and alive enough to follow.",
      "Rings of stories, visuals and dialogue that keep a brand's world in " +
        "constant, beautiful motion.",
    ],
  },
  {
    slug: "campaigns",
    glyph: { symbol: "❋", label: "Campaigns" },
    discipline: "Campaigns",
    title: "The Bloom",
    tagline: "Big ideas with enough force to move an audience.",
    themes: ["Campaigns", "Concept", "Impact", "360"],
    year: "2022",
    paragraphs: [
      "Concepts built for momentum — a single bold idea carried across every " +
        "channel until it becomes a signal the whole audience feels.",
      "The kind of campaign that doesn't ask for attention so much as redirect " +
        "it, then leaves the brand changed by the wave it made.",
    ],
  },
];

/** Fast lookup by slug for the /orbit/[slug] route and planet configs. */
export const projectBySlug = Object.fromEntries(
  projects.map((p) => [p.slug, p]),
) as Record<string, Project>;
