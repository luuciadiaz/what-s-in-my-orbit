"use client";

/**
 * AUDIO ENGINE
 *
 * Ambience is synthesised, not sampled — no audio files, fully controllable, and
 * true to the brief: deep drones, wind/space texture, small interaction sounds,
 * per-planet atmospheres. No music.
 *
 * The AudioContext is created lazily on the first user gesture (the sound
 * toggle) to respect autoplay policy, and everything is muted by default. All
 * public methods are no-ops until enabled, so callers never need to guard.
 */

// Low roots per world (Hz) — each atmosphere retunes the drone.
const ATMOSPHERE: Record<string, number> = {
  origin: 110.0, // A2
  mercury: 164.81, // E3 — bright, quick
  venus: 146.83, // D3 — warm
  mars: 130.81, // C3 — bold
  jupiter: 98.0, // G2 — vast, low
  saturn: 123.47, // B2 — structural
};

// A minor pentatonic up high, for interaction shimmer.
const SHIMMER = [440.0, 523.25, 587.33, 659.25, 783.99];

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  private windGain: GainNode | null = null;
  private enabled = false;
  private lastShimmer = 0;

  /** Create the graph and fade ambience in. Must be called from a gesture. */
  async enable(): Promise<void> {
    if (this.enabled) return;
    if (!this.ctx) this.build();
    if (!this.ctx) return; // unsupported
    await this.ctx.resume();
    this.enabled = true;
    const t = this.ctx.currentTime;
    this.master!.gain.cancelScheduledValues(t);
    this.master!.gain.setValueAtTime(0.0001, t);
    this.master!.gain.exponentialRampToValueAtTime(0.5, t + 1.6);
  }

  /** Fade ambience out and suspend. */
  async disable(): Promise<void> {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
    this.enabled = false;
    window.setTimeout(() => this.ctx?.suspend(), 900);
  }

  /** A soft shimmer when a world is touched. */
  hover(): void {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    if (now - this.lastShimmer < 0.11) return; // throttle
    this.lastShimmer = now;
    const freq = SHIMMER[Math.floor(Math.random() * SHIMMER.length)];
    this.ping(freq, 0.22, 0.09, "triangle");
  }

  /** Entering a world: a low arrival tone + retune the atmosphere. */
  select(slug: string): void {
    if (!this.enabled || !this.ctx) return;
    this.ping((ATMOSPHERE[slug] ?? 110) * 2, 0.9, 0.12, "sine");
    this.setAtmosphere(slug);
  }

  /** Returning to the atlas: a gentle descending tone + neutral atmosphere. */
  back(): void {
    if (!this.enabled || !this.ctx) return;
    this.ping(196, 0.7, 0.1, "sine");
    this.setAtmosphere("origin");
  }

  /** Retune the drone to a world's root. */
  private setAtmosphere(slug: string): void {
    if (!this.ctx) return;
    const root = ATMOSPHERE[slug] ?? 110;
    const t = this.ctx.currentTime;
    this.droneOscs.forEach((osc, i) => {
      const target = i === 0 ? root : root * (i === 1 ? 1.5 : 2.01); // root, fifth, octave
      osc.frequency.cancelScheduledValues(t);
      osc.frequency.setValueAtTime(osc.frequency.value, t);
      osc.frequency.exponentialRampToValueAtTime(target, t + 2.5);
    });
  }

  /** Build the persistent ambient graph (drone + wind). */
  private build(): void {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0.0001;
    this.master.connect(ctx.destination);

    // Drone: three sines (root, fifth, octave) through a lowpass, breathing.
    this.droneGain = ctx.createGain();
    this.droneGain.gain.value = 0.5;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 600;
    lp.connect(this.droneGain);
    this.droneGain.connect(this.master);

    const root = ATMOSPHERE.origin;
    [root, root * 1.5, root * 2.01].forEach((f) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      osc.connect(lp);
      osc.start();
      this.droneOscs.push(osc);
    });

    // Breathing LFO on the drone gain.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.18;
    lfo.connect(lfoGain);
    lfoGain.connect(this.droneGain.gain);
    lfo.start();

    // Wind: looping noise through a slow band-pass sweep.
    this.windGain = ctx.createGain();
    this.windGain.gain.value = 0.06;
    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer(ctx);
    noise.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 500;
    bp.Q.value = 0.7;
    const windLfo = ctx.createOscillator();
    windLfo.frequency.value = 0.05;
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.value = 300;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(bp.frequency);
    windLfo.start();
    noise.connect(bp);
    bp.connect(this.windGain);
    this.windGain.connect(this.master);
    noise.start();
  }

  /** One-shot enveloped tone. */
  private ping(freq: number, dur: number, peak: number, type: OscillatorType): void {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  /** A few seconds of white noise for the wind source. */
  private noiseBuffer(ctx: AudioContext): AudioBuffer {
    const len = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }
}

/** Singleton shared across the app. */
export const audioEngine = new AudioEngine();
