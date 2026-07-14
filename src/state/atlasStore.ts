"use client";

/**
 * ATLAS STORE
 *
 * A tiny external store (no dependency) that both the WebGL layer and the DOM
 * overlays subscribe to — the shared truth for "which world are we entering".
 * It must live OUTSIDE React's Canvas boundary because the camera director
 * (inside the WebGL reconciler) and the project reveal (in the DOM tree) both
 * read it. useSyncExternalStore keeps every consumer in step.
 *
 * Phases:
 *   idle     — free exploration of the atlas
 *   entering — the camera is flying into the selected world (cinematic)
 *   active   — arrived; the project is revealed, planet still on screen
 *   leaving  — flying back out to the atlas
 */
import { useSyncExternalStore } from "react";
import * as THREE from "three";

export type AtlasPhase = "idle" | "entering" | "active" | "leaving";

interface AtlasState {
  phase: AtlasPhase;
  activePlanet: string | null;
}

let state: AtlasState = { phase: "idle", activePlanet: null };
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function setState(next: Partial<AtlasState>) {
  state = { ...state, ...next };
  emit();
}

/** Begin flying into a world. */
export function enterPlanet(slug: string) {
  if (state.phase !== "idle") return;
  setState({ phase: "entering", activePlanet: slug });
}

/** Called by the camera director once the flight in completes. */
export function markArrived() {
  if (state.phase === "entering") setState({ phase: "active" });
}

/** Begin flying back out to the atlas. */
export function leavePlanet() {
  if (state.phase === "active" || state.phase === "entering") {
    setState({ phase: "leaving" });
  }
}

/** Called by the camera director once the flight out completes. */
export function markReturned() {
  setState({ phase: "idle", activePlanet: null });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

/** Reactive access to the atlas phase/active world. Works in and out of Canvas. */
export function useAtlas(): AtlasState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * PLANET REGISTRY
 *
 * Each planet publishes its live scene object here so the camera director can
 * read the world's real position at flight time (planets drift on their orbits).
 */
const registry = new Map<string, THREE.Object3D>();

export function registerPlanet(slug: string, object: THREE.Object3D) {
  registry.set(slug, object);
}

export function unregisterPlanet(slug: string) {
  registry.delete(slug);
}

export function getPlanetObject(slug: string): THREE.Object3D | undefined {
  return registry.get(slug);
}
