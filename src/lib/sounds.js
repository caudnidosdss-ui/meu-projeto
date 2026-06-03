let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, duration, volume, type = "sine", when = 0) {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, ctx.currentTime + when);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + when + duration
  );
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + when);
  osc.stop(ctx.currentTime + when + duration);
}

export function tocarSomOk() {
  playTone(880, 0.08, 0.25);
  playTone(1175, 0.12, 0.2, "sine", 0.09);
}

export function tocarSomErro() {
  playTone(220, 0.18, 0.35, "square");
  playTone(165, 0.28, 0.3, "square", 0.12);
}

export function vibrarDispositivo(padrao = 80) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(padrao);
  }
}

export function feedbackAcerto() {
  tocarSomOk();
  vibrarDispositivo([40, 30, 40]);
}

export function feedbackErro() {
  tocarSomErro();
  vibrarDispositivo([120, 60, 120]);
}
