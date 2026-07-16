"use client";

/**
 * INTRO STORE
 *
 * Coordinates the theatrical opening between the DOM curtain and the WebGL
 * camera. The phase (rarely changes) is reactive; the opening `progress`
 * (0→1, changes every animation frame) is a plain module value read imperatively
 * inside useFrame, so the curtain's GSAP tween never triggers React re-renders
 * in the 3D scene.
 *
 *   curtain  — closed, title shown, camera held far back
 *   opening  — curtain parting + camera dollying forward
 *   open     — inside the universe, free exploration
 */
import { useSyncExternalStore } from "react";

export type IntroPhase = "curtain" | "opening" | "open";

let phase: IntroPhase = "curtain";
let progress = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function beginOpening() {
  if (phase !== "curtain") return;
  phase = "opening";
  emit();
}

export function finishOpening() {
  phase = "open";
  progress = 1;
  emit();
}

/** Reduced motion / skip: jump straight into the universe. */
export function skipIntro() {
  phase = "open";
  progress = 1;
  emit();
}

export function setIntroProgress(p: number) {
  progress = p;
}

/** Imperative read for useFrame (no re-render). */
export function getIntroProgress() {
  return progress;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useIntroPhase(): IntroPhase {
  return useSyncExternalStore(
    subscribe,
    () => phase,
    () => "curtain" as IntroPhase,
  );
}
