// Global sound effects system using Web Audio API — no external files

let audioCtx: AudioContext | null = null;

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

// ─── SPIN WHEEL ───

export function playTick() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = 2200 + Math.random() * 600;
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.04);

    const n = ctx.createOscillator();
    const ng = ctx.createGain();
    n.type = "square";
    n.frequency.value = 800;
    ng.gain.setValueAtTime(0.06, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    n.connect(ng).connect(ctx.destination);
    n.start(t);
    n.stop(t + 0.02);
  } catch {}
}

export function playSpinStart() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    // Rising whoosh
    const o1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    o1.type = "sawtooth";
    o1.frequency.setValueAtTime(150, t);
    o1.frequency.exponentialRampToValueAtTime(1200, t + 0.5);
    g1.gain.setValueAtTime(0.15, t);
    g1.gain.linearRampToValueAtTime(0.2, t + 0.15);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    o1.connect(g1).connect(ctx.destination);
    o1.start(t); o1.stop(t + 0.6);
    // Bass thump
    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.type = "sine";
    o2.frequency.setValueAtTime(80, t);
    o2.frequency.exponentialRampToValueAtTime(40, t + 0.3);
    g2.gain.setValueAtTime(0.25, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    o2.connect(g2).connect(ctx.destination);
    o2.start(t); o2.stop(t + 0.35);
  } catch {}
}

export function playWinSound() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    [523, 659, 784, 1047, 1319].forEach((freq, i) => {
      const s = t + i * 0.1;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.22, s + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.8);
      o.connect(g).connect(ctx.destination);
      o.start(s); o.stop(s + 0.8);
      // Overtone
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.type = "sine"; o2.frequency.value = freq * 2;
      g2.gain.setValueAtTime(0, s);
      g2.gain.linearRampToValueAtTime(0.06, s + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.001, s + 0.4);
      o2.connect(g2).connect(ctx.destination);
      o2.start(s); o2.stop(s + 0.4);
    });
    // Final chord
    const cs = t + 0.6;
    [1047, 1319, 1568].forEach((freq) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0, cs);
      g.gain.linearRampToValueAtTime(0.12, cs + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, cs + 1.2);
      o.connect(g).connect(ctx.destination);
      o.start(cs); o.stop(cs + 1.2);
    });
  } catch {}
}

export function playLoseSound() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    [440, 370, 311].forEach((freq, i) => {
      const s = t + i * 0.15;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.15, s + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.4);
      o.connect(g).connect(ctx.destination);
      o.start(s); o.stop(s + 0.4);
    });
  } catch {}
}

// ─── NAVIGATION ───

export function playNavTap() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 1400;
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + 0.06);
  } catch {}
}

// ─── CHAT ───

export function playChatSend() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(600, t);
    o.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
    g.gain.setValueAtTime(0.1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + 0.15);
  } catch {}
}

export function playChatReceive() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    [880, 1100].forEach((freq, i) => {
      const s = t + i * 0.08;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.07, s + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.12);
      o.connect(g).connect(ctx.destination);
      o.start(s); o.stop(s + 0.12);
    });
  } catch {}
}

// ─── SHOP ───

export function playPurchaseConfirm() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    // Cash register "cha-ching"
    const o1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    o1.type = "sine"; o1.frequency.value = 1500;
    g1.gain.setValueAtTime(0.12, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    o1.connect(g1).connect(ctx.destination);
    o1.start(t); o1.stop(t + 0.08);

    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.type = "sine"; o2.frequency.value = 2200;
    g2.gain.setValueAtTime(0.15, t + 0.1);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o2.connect(g2).connect(ctx.destination);
    o2.start(t + 0.1); o2.stop(t + 0.3);
  } catch {}
}

export function playPurchaseSuccess() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    // Triumphant jingle
    [784, 988, 1175, 1568].forEach((freq, i) => {
      const s = t + i * 0.08;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.18, s + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.6);
      o.connect(g).connect(ctx.destination);
      o.start(s); o.stop(s + 0.6);
    });
  } catch {}
}

// ─── TAROT ───

export function playCardFlip() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    // Swoosh + reveal
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(300, t);
    o.frequency.exponentialRampToValueAtTime(1500, t + 0.08);
    g.gain.setValueAtTime(0.06, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + 0.12);
    // Chime
    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.type = "sine"; o2.frequency.value = 1200;
    g2.gain.setValueAtTime(0, t + 0.05);
    g2.gain.linearRampToValueAtTime(0.1, t + 0.07);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    o2.connect(g2).connect(ctx.destination);
    o2.start(t + 0.05); o2.stop(t + 0.25);
  } catch {}
}

export function playMysticReveal() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    // Ethereal chord
    [440, 554, 659, 880].forEach((freq, i) => {
      const s = t + i * 0.15;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.1, s + 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, s + 1.5);
      o.connect(g).connect(ctx.destination);
      o.start(s); o.stop(s + 1.5);
    });
  } catch {}
}

// ─── XP RAIN ───

export function playXPCollect() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 1800 + Math.random() * 800;
    g.gain.setValueAtTime(0.1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + 0.06);
  } catch {}
}

export function playXPRainStart() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    // Thunder rumble
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(60, t);
    o.frequency.exponentialRampToValueAtTime(30, t + 0.8);
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + 1);
    // Lightning crack
    [2000, 3000, 2500].forEach((freq, i) => {
      const s = t + 0.05 + i * 0.05;
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.type = "square"; o2.frequency.value = freq;
      g2.gain.setValueAtTime(0.08, s);
      g2.gain.exponentialRampToValueAtTime(0.001, s + 0.04);
      o2.connect(g2).connect(ctx.destination);
      o2.start(s); o2.stop(s + 0.04);
    });
  } catch {}
}

// ─── DUEL / GAMES ───

export function playDuelStart() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    // Battle horn
    [220, 330, 440].forEach((freq, i) => {
      const s = t + i * 0.12;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sawtooth"; o.frequency.value = freq;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.12, s + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.4);
      o.connect(g).connect(ctx.destination);
      o.start(s); o.stop(s + 0.4);
    });
  } catch {}
}

export function playDuelClash() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    // Metal clash
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(3000, t);
    o.frequency.exponentialRampToValueAtTime(500, t + 0.1);
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + 0.15);
    // Impact thud
    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.type = "sine";
    o2.frequency.setValueAtTime(120, t);
    o2.frequency.exponentialRampToValueAtTime(50, t + 0.2);
    g2.gain.setValueAtTime(0.2, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    o2.connect(g2).connect(ctx.destination);
    o2.start(t); o2.stop(t + 0.25);
  } catch {}
}

export function playDuelWin() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    // Victory fanfare
    [523, 659, 784, 1047].forEach((freq, i) => {
      const s = t + i * 0.12;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.2, s + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.7);
      o.connect(g).connect(ctx.destination);
      o.start(s); o.stop(s + 0.7);
    });
  } catch {}
}

export function playDuelLose() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    [392, 330, 262].forEach((freq, i) => {
      const s = t + i * 0.2;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.13, s + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.5);
      o.connect(g).connect(ctx.destination);
      o.start(s); o.stop(s + 0.5);
    });
  } catch {}
}

// ─── LEVEL UP ───

export function playLevelUp() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    // Ascending arpeggio with shimmer
    [523, 659, 784, 1047, 1319, 1568].forEach((freq, i) => {
      const s = t + i * 0.08;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.18, s + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, s + 1);
      o.connect(g).connect(ctx.destination);
      o.start(s); o.stop(s + 1);
    });
    // Grand chord at end
    const cs = t + 0.55;
    [1047, 1319, 1568, 2093].forEach((freq) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0, cs);
      g.gain.linearRampToValueAtTime(0.1, cs + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, cs + 1.5);
      o.connect(g).connect(ctx.destination);
      o.start(cs); o.stop(cs + 1.5);
    });
  } catch {}
}

// ─── GENERIC UI ───

export function playButtonPress() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 1000;
    g.gain.setValueAtTime(0.06, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + 0.05);
  } catch {}
}

export function playPopupOpen() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(800, t);
    o.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + 0.15);
  } catch {}
}

export function playError() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    [300, 250].forEach((freq, i) => {
      const s = t + i * 0.12;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.08, s);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.1);
      o.connect(g).connect(ctx.destination);
      o.start(s); o.stop(s + 0.1);
    });
  } catch {}
}
