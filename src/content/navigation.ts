/**
 * NAVIGATION CONTENT
 *
 * The atlas has "no menu" visually — but for accessibility, SEO and no-JS, a
 * real, semantic set of links must exist. This is that canonical index. The
 * WebGL layer mirrors these destinations as planets; the DOM renders them as
 * an ordered list of orbits.
 */

import type { NavItem } from "./types";
import { projects } from "./projects";
import { about } from "./about";

/** Orbits derived from projects — the single source stays projects.ts. */
export const orbits: NavItem[] = projects.map((p) => ({
  label: p.discipline,
  slug: p.slug,
  glyph: p.glyph,
}));

/** Origin (home world) as a navigational destination. */
export const originNav: NavItem = {
  label: "Origin — About & Contact",
  slug: "origin",
  glyph: about.glyph,
};

/** Complete, ordered destination list for the accessible atlas index. */
export const navigation: NavItem[] = [...orbits, originNav];
