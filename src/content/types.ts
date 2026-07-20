/**
 * CONTENT TYPES
 *
 * The shape of every piece of editable copy in the atlas. Content is fully
 * separated from presentation: components render these structures and never
 * embed literal strings. Editing the site means editing `content/*.ts` only.
 */

/** A celestial glyph paired with its accessible name. */
export interface Glyph {
  /** The symbol, e.g. "◉". Decorative — always paired with `label`. */
  symbol: string;
  /** Accessible label announced to assistive tech, e.g. "Brand Strategy". */
  label: string;
}

/** One project — rendered as a planet in the WebGL layer, as an article in DOM. */
export interface Project {
  /** Stable slug used in the URL: /orbit/[slug]. Ties to its planet config. */
  slug: string;
  glyph: Glyph;
  /** Short discipline label, e.g. "Creative Direction". */
  discipline: string;
  title: string;
  /** One-line essence shown on approach. */
  tagline: string;
  /** Editorial body paragraphs for the project page. */
  paragraphs: string[];
  /** Theme keywords (from the brief's per-planet notes). */
  themes: string[];
  /** Year or range, editorial metadata. */
  year: string;
}

/** A skill, rendered as an asteroid in the belt. */
export interface Skill {
  name: string;
  /** Optional grouping for the a11y list (e.g. "Craft", "Strategy"). */
  category: string;
}

/** A navigational destination in the atlas (orbit). */
export interface NavItem {
  label: string;
  slug: string;
  glyph: Glyph;
}

/** A pull-quote / manifesto line that breathes in the experience. */
export interface Quote {
  text: string;
  attribution?: string;
}
