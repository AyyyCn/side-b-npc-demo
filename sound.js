// Original electric-piano loop over a brushed kick and a rounded bass.
let ctx,
  master,
  next = 0,
  beat = 0,
  playing = false;
const chords = [
  [53, 57, 60, 64],
  [50, 53, 57, 60],
  [46, 53, 57, 60],
  [48, 55, 58, 62],
];
export function wake() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.65;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
}
function tone(note, when, length, gain, type = "sine", drop = 0) {
  const osc = ctx.createOscillator(),
    env = ctx.createGain();
  const hz = 440 * 2 ** ((note - 69) / 12);
  osc.type = type;
  osc.frequency.setValueAtTime(hz, when);
  if (drop)
    osc.frequency.exponentialRampToValueAtTime(drop, when + length * 0.7);
  env.gain.setValueAtTime(0.0001, when);
  env.gain.exponentialRampToValueAtTime(gain, when + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, when + length);
  osc.connect(env);
  env.connect(master);
  osc.start(when);
  osc.stop(when + length + 0.02);
}
export function music(active, enabled) {
  if (!ctx) return;
  master.gain.value = enabled ? 0.65 : 0;
  if (!active) {
    playing = false;
    return;
  }
  if (!playing) {
    next = ctx.currentTime + 0.04;
    beat = 0;
    playing = true;
  }
  next = Math.max(next, ctx.currentTime);
  while (next < ctx.currentTime + 0.13) {
    const chord = chords[Math.floor(beat / 8) % 4];
    if (beat % 8 === 0 || beat % 8 === 5)
      chord.forEach((n, i) =>
        tone(n + 12, next + i * 0.012, 1.05, 0.055, "triangle"),
      );
    if (beat % 4 === 0) {
      tone(chord[0] - 12, next, 0.39, 0.2);
      tone(42, next, 0.14, 0.22, "sine", 36);
    }
    if (beat % 2 === 1) tone(94, next, 0.043, 0.014, "triangle");
    next += 0.29;
    beat++;
  }
}
