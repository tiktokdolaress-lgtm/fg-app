/* Síntese sonora 100% Web Audio API (sem arquivos externos) — port do AF/SFX legado */
let ctx = null;
let soundOn = () => true;
export const setSoundGate = (fn) => { soundOn = fn; };

function ac() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  }
  if (ctx && ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
  return ctx;
}
function tone(f, dur, type, g, when, fEnd) {
  const c = ac();
  if (!c || !soundOn()) return;
  try {
    const o = c.createOscillator(), ga = c.createGain(), t = c.currentTime + (when || 0);
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (fEnd) o.frequency.exponentialRampToValueAtTime(Math.max(20, fEnd), t + dur);
    ga.gain.setValueAtTime(0.0001, t);
    ga.gain.linearRampToValueAtTime(g, t + 0.012);
    ga.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(ga); ga.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  } catch (e) {}
}
function noise(dur, g, fc, when) {
  const c = ac();
  if (!c || !soundOn()) return;
  try {
    const len = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, len, c.sampleRate), dd = buf.getChannelData(0);
    for (let i = 0; i < len; i++) dd[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(), ga = c.createGain(), fl = c.createBiquadFilter();
    const t = c.currentTime + (when || 0);
    src.buffer = buf; fl.type = 'lowpass'; fl.frequency.value = fc || 400;
    ga.gain.setValueAtTime(g, t);
    ga.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(fl); fl.connect(ga); ga.connect(c.destination);
    src.start(t);
  } catch (e) {}
}

export const AF = {
  ac,
  tone,
  noise,
  click() { tone(140, 0.09, 'triangle', 0.16, 0, 70); tone(2100, 0.045, 'square', 0.028); },
  beep(f, dur, g) { tone(f || 880, dur || 0.1, 'sine', g || 0.05); },
  chime() { tone(880, 0.3, 'sine', 0.1); tone(1320, 0.45, 'sine', 0.08, 0.12); },
  seal() { tone(190, 0.5, 'sine', 0.5, 0, 42); noise(0.28, 0.4, 320); tone(70, 0.6, 'sine', 0.3, 0.05, 38); tone(900, 0.06, 'square', 0.05, 0.02); },
  victory(big) {
    const c = ac();
    if (!c || !soundOn()) return;
    const seq = [523.25, 659.25, 783.99, 1046.5];
    seq.forEach((f, i) => { tone(f, 0.34, 'triangle', 0.16, i * 0.11); tone(f * 2, 0.22, 'sine', 0.05, i * 0.11); });
    tone(98, 0.7, 'sine', 0.22, 0.44); tone(1318.5, 0.8, 'triangle', 0.12, 0.44); tone(1568, 0.8, 'triangle', 0.1, 0.44);
    noise(0.5, 0.05, 3200, 0.44);
    if (big) { tone(1567.98, 1.2, 'sine', 0.06, 0.55); tone(2093.0, 1.4, 'sine', 0.05, 0.7); tone(1046.5, 1.6, 'triangle', 0.05, 0.85); tone(3135.96, 1.0, 'sine', 0.03, 1.0); }
  },
};
export const SFX = {
  anvil() { tone(95, 0.35, 'sine', 0.5, 0, 40); noise(0.12, 0.35, 900); tone(1250, 0.5, 'triangle', 0.07, 0.02, 700); tone(1870, 0.35, 'sine', 0.04, 0.03, 900); },
  step() { noise(0.06, 0.18, 2600); tone(2400, 0.1, 'square', 0.035, 0, 1700); },
  blade() { noise(0.14, 0.22, 3200); tone(2600, 0.22, 'square', 0.05, 0, 1200); tone(3900, 0.12, 'sine', 0.03, 0.05); },
  roar() { tone(170, 0.55, 'sawtooth', 0.22, 0, 85); tone(120, 0.6, 'sawtooth', 0.18, 0.06, 65); noise(0.45, 0.12, 700); },
  fire() { noise(0.7, 0.22, 1400); tone(420, 0.6, 'sine', 0.12, 0, 90); noise(0.4, 0.1, 2400, 0.1); },
  hammer() { tone(75, 0.6, 'sine', 0.6, 0, 35); noise(0.18, 0.5, 500); tone(1400, 0.35, 'triangle', 0.06, 0.02, 600); tone(60, 0.8, 'sine', 0.35, 0.05, 30); },
};
export const metaSfx = (d) => (d <= 14 ? SFX.blade() : d <= 45 ? SFX.roar() : SFX.fire());

/* Ciclo de respiração 4x4 com oscilador — usado na Fase 2 do S.O.S */
export function createBreath(phases) {
  const PH = phases || [
    { k: 'in', s: 4, l: 'INALE' },
    { k: 'holdH', s: 4, l: 'SEGURE' },
    { k: 'out', s: 4, l: 'EXALE' },
    { k: 'holdL', s: 4, l: 'SEGURE (VAZIO)' },
  ];
  let on = false, osc = null, gain = null, phase = 0, pStart = 0, iv = null;
  const api = {
    get on() { return on; },
    PH,
    start() {
      if (on) return;
      const c = ac();
      if (!c) return;
      on = true; phase = -1;
      osc = c.createOscillator(); gain = c.createGain();
      osc.type = 'sine'; osc.frequency.value = 150; gain.gain.value = 0.0001;
      osc.connect(gain); gain.connect(c.destination); osc.start();
      api.next();
      iv = setInterval(() => api.tick(), 200);
    },
    next() {
      phase = (phase + 1) % 4; pStart = Date.now();
      const p = PH[phase], c = ctx;
      if (!c) return;
      const t = c.currentTime, f = osc.frequency, g = gain.gain;
      if (p.k === 'in') { f.setValueAtTime(150, t); f.linearRampToValueAtTime(262, t + p.s); if (soundOn()) g.setTargetAtTime(0.09, t, 0.25); }
      if (p.k === 'holdH') { f.setValueAtTime(262, t); if (soundOn()) g.setTargetAtTime(0.055, t, 0.2); }
      if (p.k === 'out') { f.setValueAtTime(262, t); f.linearRampToValueAtTime(140, t + p.s); if (soundOn()) g.setTargetAtTime(0.07, t, 0.25); }
      if (p.k === 'holdL') { f.setValueAtTime(140, t); if (soundOn()) g.setTargetAtTime(0.035, t, 0.2); }
    },
    tick() {
      const p = PH[phase], left = p.s - (Date.now() - pStart) / 1000;
      if (api.onTick) api.onTick(Math.max(1, Math.ceil(left)), p);
      if (left <= 0) api.next();
    },
    stop() {
      if (!on) return;
      on = false; clearInterval(iv);
      try { const t = ctx.currentTime; gain.gain.setTargetAtTime(0.0001, t, 0.1); osc.stop(t + 0.4); } catch (e) {}
      osc = null;
    },
  };
  return api;
}

/* Programas de respiração guiada (Biblioteca do Guerreiro) */
export const BREATH_PROGRAMS = {
  combate: { nome: '⚔ Combate 4×4 (corta o impulso)', phases: [
    { k: 'in', s: 4, l: 'INALE' }, { k: 'holdH', s: 4, l: 'SEGURE' }, { k: 'out', s: 4, l: 'EXALE' }, { k: 'holdL', s: 4, l: 'SEGURE (VAZIO)' }] },
  sono: { nome: '🌙 Descida 4-7-8 (antes de dormir)', phases: [
    { k: 'in', s: 4, l: 'INALE' }, { k: 'holdH', s: 7, l: 'SEGURE' }, { k: 'out', s: 8, l: 'EXALE LENTO' }] },
  foco: { nome: '🎯 Coerência 5-5 (foco e calma)', phases: [
    { k: 'in', s: 5, l: 'INALE' }, { k: 'out', s: 5, l: 'EXALE' }] },
};
