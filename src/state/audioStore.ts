"use client";

/**
 * AUDIO STORE
 *
 * The single source of "is sound on". Muted by default (per the brief). Toggling
 * drives the AudioEngine — the first enable happens inside the toggle's click
 * handler, so the AudioContext resumes within a user gesture and never trips the
 * browser's autoplay policy.
 */
import { useSyncExternalStore } from "react";
import { audioEngine } from "@/audio/AudioEngine";

let enabled = false;
const listeners = new Set<() => void>();

export function toggleAudio() {
  enabled = !enabled;
  if (enabled) void audioEngine.enable();
  else void audioEngine.disable();
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAudioEnabled(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => enabled,
    () => false,
  );
}
