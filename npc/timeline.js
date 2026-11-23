export const el = (id) => document.getElementById(id);
export const stamp = (t) => (t / 10).toFixed(1) + " s";
export function setText(id, text) {
  const node = el(id);
  if (node.textContent !== text) node.textContent = text;
}
export function timeline({ initial, limit, draw, describe }) {
  let clock = initial,
    playing = false,
    ready = false,
    last = null;
  const paint = () => {
    if (!ready) return;
    el("scrub").max = Math.ceil(limit());
    el("scrub").value = Math.round(clock);
    setText("time", stamp(clock));
    setText("play", playing ? "Pause" : clock >= limit() ? "Replay" : "Play");
    draw(clock, playing);
  };
  const jump = (t, play = false) => {
    clock = Math.max(0, Math.min(limit(), t));
    playing = play && clock < limit();
    paint();
  };
  const advance = (ms) => {
    if (ready && playing) {
      clock = Math.min(limit(), clock + Math.max(0, ms) / 100);
      if (clock >= limit()) playing = false;
    }
    paint();
  };
  function frame(now) {
    if (ready && playing) advance(last == null ? 0 : Math.min(100, now - last));
    last = now;
    requestAnimationFrame(frame);
  }
  function toggle() {
    jump(clock >= limit() ? 0 : clock, !playing);
  }
  el("play").onclick = toggle;
  el("finish").onclick = () => jump(limit());
  el("scrub").oninput = (e) => jump(Number(e.target.value));
  window.addEventListener("resize", paint);
  document.addEventListener("keydown", (e) => {
    if (e.repeat || /INPUT|SELECT|BUTTON|A/.test(e.target.tagName)) return;
    if (e.key === " ") {
      e.preventDefault();
      toggle();
    }
    if (e.key.toLowerCase() === "f") {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen().catch(() => {});
    }
  });
  window.advanceTime = advance;
  window.render_game_to_text = () =>
    JSON.stringify(
      ready
        ? {
            ready: true,
            tick: Math.floor(clock),
            playing,
            axes: "x increases right, z toward the front, metres",
            ...describe(clock),
          }
        : { ready: false },
    );
  return {
    get tick() {
      return clock;
    },
    jump,
    paint,
    open() {
      ready = true;
      el("loading").hidden = true;
      paint();
      requestAnimationFrame(frame);
    },
    fail(error) {
      setText("loading", "Could not open the 3D venue. " + error.message);
      for (const n of document.querySelectorAll("button,select,input"))
        n.disabled = true;
    },
  };
}
