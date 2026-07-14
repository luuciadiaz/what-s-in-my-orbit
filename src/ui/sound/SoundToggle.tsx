"use client";

/**
 * SoundToggle — a quiet gold control for the ambience.
 *
 * Muted by default. A minimal instrument-like mark in the corner: three rising
 * arcs when sound is on, a single still arc when off. Accessible (aria-pressed),
 * keyboard-focusable, and unobtrusive — sound is an invitation, never imposed.
 */
import { useAudioEnabled, toggleAudio } from "@/state/audioStore";

export function SoundToggle() {
  const on = useAudioEnabled();

  return (
    <button
      type="button"
      onClick={toggleAudio}
      aria-pressed={on}
      aria-label={on ? "Silenciar el sonido ambiente" : "Activar el sonido ambiente"}
      className="pointer-events-auto fixed bottom-6 right-6 flex items-center gap-3 font-caption text-caption uppercase tracking-[0.24em] text-ink-soft transition-colors duration-slow hover:text-gold focus-visible:text-gold"
      style={{ zIndex: "var(--z-hud)" }}
    >
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <circle cx="13" cy="13" r="12" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
        {/* central emitter */}
        <circle cx="9" cy="13" r="1.6" fill="currentColor" />
        {/* sound arcs — all present when on, only the first when off */}
        <path d="M12 9 a5 5 0 0 1 0 8" stroke="currentColor" strokeWidth="1.1" opacity={on ? 0.9 : 0.5} />
        <path d="M14.5 7 a8 8 0 0 1 0 12" stroke="currentColor" strokeWidth="1.1" opacity={on ? 0.7 : 0} />
        <path d="M17 5.5 a11 11 0 0 1 0 15" stroke="currentColor" strokeWidth="1.1" opacity={on ? 0.5 : 0} />
      </svg>
      <span>{on ? "Sound" : "Silence"}</span>
    </button>
  );
}
