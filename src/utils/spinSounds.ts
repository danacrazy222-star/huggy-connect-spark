// Spin wheel sound effects using Web Audio API — rich casino-style sounds

let audioCtx: AudioContext | null = null;

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

/** Tick sound — richer click with harmonics */
export function playTick() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    // Main click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = 2200 + Math.random() * 600;
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.04);

    // Subtle knock
    const noise = ctx.createOscillator();
    const nGain = ctx.createGain();
    noise.type = "square";
    noise.frequency.value = 800;
    nGain.gain.setValueAtTime(0.06, t);
    nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    noise.connect(nGain).connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.02);
  } catch {}
}

/** Spin start — dramatic whoosh with rising pitch */
export function playSpinStart() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    // Rising whoosh
    const osc1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(150, t);
    osc1.frequency.exponentialRampToValueAtTime(1200, t + 0.5);
    g1.gain.setValueAtTime(0.15, t);
    g1.gain.linearRampToValueAtTime(0.2, t + 0.15);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc1.connect(g1).connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.6);

    // Sub bass thump
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(80, t);
    osc2.frequency.exponentialRampToValueAtTime(40, t + 0.3);
    g2.gain.setValueAtTime(0.25, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc2.connect(g2).connect(ctx.destination);
    osc2.start(t);
    osc2.stop(t + 0.35);

    // High shimmer
    const osc3 = ctx.createOscillator();
    const g3 = ctx.createGain();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(3000, t);
    osc3.frequency.exponentialRampToValueAtTime(5000, t + 0.3);
    g3.gain.setValueAtTime(0.05, t);
    g3.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc3.connect(g3).connect(ctx.destination);
    osc3.start(t);
    osc3.stop(t + 0.4);
  } catch {}
}

/** Win fanfare — epic casino jackpot chime */
export function playWinSound() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    // Arpeggio: C5 → E5 → G5 → C6 → E6
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((freq, i) => {
      const start = t + i * 0.1;
      
      // Main bell tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.22, start + 0.02);
      gain.gain.setValueAtTime(0.22, start + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.8);

      // Harmonic overtone
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.value = freq * 2;
      g2.gain.setValueAtTime(0, start);
      g2.gain.linearRampToValueAtTime(0.06, start + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
      osc2.connect(g2).connect(ctx.destination);
      osc2.start(start);
      osc2.stop(start + 0.4);
    });

    // Final shimmer chord
    const chordStart = t + 0.6;
    [1047, 1319, 1568].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, chordStart);
      gain.gain.linearRampToValueAtTime(0.12, chordStart + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, chordStart + 1.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(chordStart);
      osc.stop(chordStart + 1.2);
    });
  } catch {}
}

/** Lose / try again — descending sad tone */
export function playLoseSound() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    // Descending tones
    const notes = [440, 370, 311];
    notes.forEach((freq, i) => {
      const start = t + i * 0.15;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  } catch {}
}
