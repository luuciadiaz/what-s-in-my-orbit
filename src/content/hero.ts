/**
 * HERO CONTENT
 *
 * The first breath of the experience. The brief is strict: only the title and
 * a single invitation. No menu, no buttons, no cards. Kept here so the copy is
 * editable without touching the scene.
 */

export const hero = {
  /** The question that names the whole atlas. */
  title: "What's in my Orbit?",
  /** The only instruction the visitor receives. */
  invitation: "Drag to explore",
  /**
   * Screen-reader-only orientation. The visual layer says almost nothing;
   * assistive tech gets a real sentence so the experience is never opaque.
   */
  srIntro:
    "An interactive celestial atlas. Each orbit is a creative discipline; " +
    "each world is a project. Use the links below to explore, or drag the " +
    "sky on screen.",
} as const;
