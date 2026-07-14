/**
 * TOKEN AGGREGATOR
 *
 * Collects every design token's CSS custom properties into one object that the
 * root layout injects a single time. This is the bridge between the typed
 * config files and the runtime stylesheet: change a token, and the variable it
 * produces updates everywhere it is referenced.
 */

import { colorCssVars } from "./colors";
import { fontCssVars } from "./fonts";
import { layoutCssVars } from "./layout";
import { motionCssVars } from "./motion";

/** All design tokens flattened to CSS custom properties for `:root`. */
export const rootCssVars: Record<string, string> = {
  ...colorCssVars,
  ...fontCssVars,
  ...motionCssVars,
  ...layoutCssVars,
};

/** Serialize the token map into a CSS declaration block for `:root`. */
export function rootCssVarsToString(): string {
  return Object.entries(rootCssVars)
    .map(([key, value]) => `${key}:${value};`)
    .join("");
}
