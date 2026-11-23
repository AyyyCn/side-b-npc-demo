import { createView } from "./view.js";
import {
  COUNT,
  HZ,
  END,
  CHANGE,
  FORK,
  HOLD,
  DEFAULT_SEED,
  STRIDE,
  history,
  readGuest,
  hall,
} from "./simulation.js";
import { music, wake } from "../sound.js";
const $ = (id) => document.getElementById(id);
const set = (id, value) => {
  const node = $(id);
  if (node.textContent !== value) node.textContent = value;
};
const query = new URLSearchParams(location.search),
  pitch = query.has("pitch"),
  slide = query.has("slide");
const stamp = (t) => (t / HZ).toFixed(1) + " s";
const requested = query.get("seed");
let seed =
  requested !== null &&
  /^\d{1,10}$/.test(requested) &&
  Number(requested) <= 4294967295
    ? Number(requested)
    : DEFAULT_SEED;
let original,
  result,
  ranks,
  guests,
  manager,
  view,
  witness = 0,
  worker,
  nonce = 0,
  ready = false;
let clock = END,
  playing = false,
  pitchTime = 0,
  dirty = true,
  last = 0,
  lastUI = "",
  lastTrail = "";
const canvas = $("comparison-view");
const buttonIds = [
  "play",
  "seek",
  "checkpoint",
  "end",
  "messenger",
  "best",
  "new",
  "witness",
];
if (slide) {
  document.body.classList.add("pitch", "slide");
  $("method").hidden = false;
}
if (pitch) {
  document.body.classList.add("pitch");
  $("progress").hidden = $("clock-label").hidden = false;
}
$("seek").max = $("progress").max = String(END);
let failed = false;
function report(error) {
  failed = true;
  ready = false;
  $("loading").hidden = false;
  set("loading", error.message || "The comparison could not open.");
  for (const id of buttonIds) $(id).disabled = true;
}
function loading() {
  ready = false;
  playing = false;
  $("loading").hidden = false;
  set("loading", "Computing the crowd’s possible outcomes…");
  for (const id of buttonIds) $(id).disabled = true;
}
function chooseWitness() {
  if (!result.changed.length) return result.hold;
  const direct = result.changed.find((id) =>
    [original, result].some((trace) => {
      const e = trace.receipts[readGuest(trace, END, id).memory];
      return e.from === result.hold && e.tick > FORK;
    }),
  );
  return direct ?? result.changed[0];
}
function optionList(id, items) {
  $(id).replaceChildren(
    ...items.map(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      return option;
    }),
  );
}
function accept(data) {
  if (failed || data.nonce !== nonce) return;
  if (data.error) {
    report(Error(data.error));
    return;
  }
  if (data.original) {
    ({ original, ranks, guests, manager } = data);
    optionList(
      "messenger",
      ranks.map((r) => [
        r.hold,
        guests[r.hold].name + " · " + r.changed.length + " changed",
      ]),
    );
    optionList(
      "witness",
      guests
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((g) => [g.id, g.name]),
    );
  }
  result = data.result;
  $("to-crew").href =
    "?crew&seed=" + seed + "&hold=" + result.hold + "&run=altered";
  witness = chooseWitness();
  clock = pitch ? 0 : END;
  pitchTime = 0;
  $("messenger").value = result.hold;
  $("witness").value = witness;
  ready = true;
  dirty = true;
  lastTrail = lastUI = "";
  playing = false;
  for (const id of buttonIds) $(id).disabled = false;
  $("loading").hidden = Boolean(view);
  $("start-pitch").hidden = !pitch;
  paint();
}
const workerURL = URL.createObjectURL(
  new Blob([CROWD_WORKER_SOURCE], { type: "text/javascript" }),
);
function calculate(hold, newSeed = false) {
  clearInterview();
  loading();
  if (!worker || newSeed) {
    worker?.terminate();
    worker = new Worker(workerURL);
    worker.onmessage = (e) => accept(e.data);
    worker.onerror = (e) =>
      report(Error(e.message || "Could not simulate the crowd."));
  }
  worker.postMessage({ nonce: ++nonce, seed, hold });
}
function quote(trace, id, t) {
  const e = trace.receipts[readGuest(trace, t, id).memory];
  if (e.from === -1) return "“My programme says West Hall.”";
  if (e.from === -2) return "“The DJ radioed me. The set is in East Hall.”";
  return "“" + guests[e.from].name + " told me the set moved to East Hall.”";
}
function trail(trace, id, t) {
  return history(trace.receipts, readGuest(trace, t, id).memory);
}
function answerAt(trace, id, t, kind) {
  const person = readGuest(trace, t, id),
    e = trace.receipts[person.memory],
    where = hall(person.x);
  if (kind === "place")
    return e.version === 2
      ? "I’m headed to East Hall."
      : "I’m headed to West Hall.";
  if (kind === "work")
    return where === 0
      ? "I’m in the foyer."
      : "I’m in " + (where === 1 ? "East" : "West") + " Hall.";
  if (kind === "source") {
    if (e.from === -1) return "I read the printed programme when I came in.";
    if (e.from === -2) return "The DJ radioed me at " + stamp(e.tick) + ".";
    return guests[e.from].name + " told me at " + stamp(e.tick) + ".";
  }
  return "Ask me where I’m headed or how I heard about the set.";
}
let questionVersion = 0;
function clearInterview() {
  questionVersion++;
  set("question-context", "");
  set("response-a", "");
  set("response-b", "");
}
$("question-form").onsubmit = async (event) => {
  event.preventDefault();
  if (!ready) return;
  const q = $("question").value.trim();
  if (!q) return;
  seek(Math.floor(clock));
  const token = ++questionVersion,
    t = Math.floor(clock),
    id = witness;
  set("response-a", "");
  set("response-b", "");
  set("question-context", "Asking " + guests[id].name + "…");
  try {
    const response = await fetch("/interpret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw Error();
    const { kind } = await response.json();
    if (token !== questionVersion) return;
    set(
      "question-context",
      guests[id].name + " at " + stamp(t) + " · “" + q + "”",
    );
    set("response-a", "Original run · " + answerAt(original, id, t, kind));
    set("response-b", "Second run · " + answerAt(result, id, t, kind));
  } catch {
    if (token === questionVersion)
      set(
        "question-context",
        "The local model is unavailable. The evidence trail above shows what this guest knew.",
      );
  }
};
$("interview").hidden =
  pitch || slide || !document.documentElement.hasAttribute("data-interviews");
function populateTrail(id, path) {
  $(id).replaceChildren(
    ...path.map((e) => {
      const li = document.createElement("li");
      const source =
        e.from === -2
          ? "Radio"
          : e.from === -1
            ? "Printed programme"
            : guests[e.from].name;
      const jump = document.createElement("button");
      jump.textContent = stamp(e.tick);
      jump.type = "button";
      jump.setAttribute(
        "aria-label",
        "Replay " +
          source +
          " to " +
          guests[e.to].name +
          " at " +
          stamp(e.tick),
      );
      jump.onclick = () => seek(e.tick);
      li.append(
        jump,
        document.createTextNode(" · " + source + " → " + guests[e.to].name),
      );
      return li;
    }),
  );
}
function locations(trace, t) {
  const counts = { west: 0, east: 0, foyer: 0 };
  for (let i = 0; i < COUNT; i++) {
    const zone = hall(trace.frames[(t * COUNT + i) * STRIDE]);
    counts[zone === 1 ? "east" : zone === -1 ? "west" : "foyer"]++;
  }
  return counts;
}
function describe(t) {
  const who = guests[result.hold].name,
    count = result.changed.length;
  if (slide) {
    const lost = locations(original, END).east - result.east;
    return [
      lost > 0 && lost === count
        ? lost +
          (lost === 1 ? " guest misses" : " guests miss") +
          " the new venue."
        : count +
          (count === 1 ? " guest changes" : " guests change") +
          " halls.",
      "The DJ moved to East Hall. Holding " +
        who +
        " for four seconds is the only change between these two runs.",
    ];
  }
  if (clock < FORK) {
    return [
      "The set moves to East Hall.",
      "All " +
        COUNT +
        " guests have the old programme. Only " +
        guests[manager].name +
        " gets the update by radio.",
    ];
  }
  if (clock < FORK + HOLD) {
    const receipt =
      original.receipts[readGuest(original, FORK, result.hold).memory];
    const clue =
      receipt.from >= 0
        ? guests[receipt.from].name +
          " told " +
          who +
          " about East Hall at " +
          stamp(receipt.tick) +
          "."
        : receipt.from === -2
          ? who + " received the radio update."
          : who + " still has the printed programme at the checkpoint.";
    return [
      who + " is stopped for four seconds.",
      clue + " Everyone else continues from the same checkpoint.",
    ];
  }
  if (clock < END - 1) {
    const before = original.receipts[readGuest(original, t, witness).memory];
    const after = result.receipts[readGuest(result, t, witness).memory];
    if (before.version !== after.version) {
      return [
        guests[witness].name + " heads to a different hall.",
        "In one run " +
          guests[witness].name +
          " heard the venue change. In the other, the printed programme is still their latest information.",
      ];
    }
    return [
      "The guests choose their halls.",
      "Guests pass on the venue change when they meet. Each walks to the hall they believe is right.",
    ];
  }
  return [
    count === 1 ? "1 guest changes halls." : count + " guests change halls.",
    "The set moved from West Hall to East Hall. At " +
      stamp(FORK) +
      ", the second run held " +
      who +
      " for four seconds.",
  ];
}
function updateUI(t) {
  const key = [t, result.hold, witness, playing, pitchTime >= 22].join("/");
  if (key === lastUI) return;
  lastUI = key;
  const [title, caption] = describe(t);
  set("headline", title);
  set("caption", caption);
  set("seed-label", COUNT + " guests · Crowd " + seed);
  set("hold-label", "Hold " + guests[result.hold].name + " for 4 s");
  set("rank-note", "All " + COUNT + " possible holds tested");
  set("count-a", String(locations(original, t).east));
  set("count-b", String(locations(result, t).east));
  set("clock", stamp(t));
  $("seek").value = String(t);
  $("progress").value = t;
  set(
    "method",
    "Each of the " +
      COUNT +
      " possible interruptions was simulated from the same checkpoint.",
  );
  set("play", playing ? "Pause" : clock >= END ? "Replay" : "Play");
  set("witness-title", "What does " + guests[witness].name + " know?");
  set("answer-a", quote(original, witness, t));
  set("answer-b", quote(result, witness, t));
  const memoryA = readGuest(original, t, witness).memory,
    memoryB = readGuest(result, t, witness).memory;
  const trailKey = [witness, result.hold, memoryA, memoryB].join("/");
  if (lastTrail !== trailKey) {
    populateTrail("trail-a", trail(original, witness, t));
    populateTrail("trail-b", trail(result, witness, t));
    lastTrail = trailKey;
  }
}
function paint(force = false) {
  if (!view || !ready) return;
  if (!dirty && !force) return;
  dirty = false;
  view.draw(original, result, clock, { guests, witness, hold: result.hold });
  updateUI(Math.floor(clock));
}
function advance(ms) {
  if (playing && ready) {
    if (pitch) {
      pitchTime += ms / 1000;
      if (pitchTime <= 5) clock = (pitchTime * FORK) / 5;
      else if (pitchTime <= 9) clock = FORK + ((pitchTime - 5) * HOLD) / 4;
      else
        clock = Math.min(
          END,
          FORK + HOLD + ((pitchTime - 9) * (END - FORK - HOLD)) / 9,
        );
      if (pitchTime >= 23) {
        playing = false;
        $("start-pitch").hidden = false;
        set("start-pitch", "Replay film");
      }
      music(true, true);
    } else {
      clock = Math.min(END, clock + (ms * HZ * 2) / 1000);
      if (clock === END) playing = false;
    }
    dirty = true;
  }
  paint(ms === 0);
}
function frame(now) {
  advance(last ? Math.min(150, now - last) : 0);
  last = now;
  requestAnimationFrame(frame);
}
function seek(t) {
  if (!ready) return;
  playing = false;
  clock = Math.max(0, Math.min(END, t));
  dirty = true;
  paint();
}
function toggle() {
  if (!ready) return;
  if (clock >= END) clock = 0;
  playing = !playing;
  dirty = true;
  paint();
}
$("play").onclick = toggle;
$("seek").oninput = (e) => seek(Number(e.target.value));
$("checkpoint").onclick = () => seek(FORK);
$("end").onclick = () => seek(END);
$("messenger").onchange = (e) => calculate(Number(e.target.value));
$("best").onclick = () => calculate(ranks[0].hold);
$("new").onclick = () => {
  seed = (seed + 1) >>> 0;
  calculate(undefined, true);
};
function inspect(id) {
  if (!ready || id == null) return;
  clearInterview();
  witness = id;
  $("witness").value = id;
  dirty = true;
  paint();
}
$("witness").onchange = (e) => inspect(Number(e.target.value));
canvas.onclick = (e) => {
  if (!ready) return;
  const r = canvas.getBoundingClientRect();
  inspect(view.pick(e.clientX - r.left, e.clientY - r.top));
};
$("start-pitch").onclick = () => {
  if (!view || !ready) return;
  wake();
  pitchTime = clock = 0;
  dirty = playing = true;
  $("start-pitch").hidden = true;
  paint();
};
window.addEventListener("resize", () => {
  dirty = true;
  paint();
});
document.addEventListener("keydown", (e) => {
  if (
    e.repeat ||
    ["INPUT", "SELECT", "BUTTON", "SUMMARY"].includes(e.target.tagName)
  )
    return;
  if (e.key.toLowerCase() === "f") {
    if (document.fullscreenElement) document.exitFullscreen();
    else
      document
        .querySelector("main")
        .requestFullscreen()
        .catch(() => {});
  }
  if (e.key === " " && !pitch) {
    e.preventDefault();
    toggle();
  }
});
window.advanceTime = advance;
window.render_game_to_text = () => {
  if (!view || !ready) return JSON.stringify({ ready: false });
  const t = Math.floor(clock),
    describeTrace = (trace) => ({
      counts: locations(trace, t),
      answer: quote(trace, witness, t),
      evidence: trail(trace, witness, t),
      people: guests.map((g) => ({
        id: g.id,
        name: g.name,
        ...readGuest(trace, t, g.id),
      })),
    });
  return JSON.stringify({
    ready: true,
    origin: "metres; x east, z toward front",
    seed,
    tick: t,
    checkpoint: FORK,
    playing,
    held: guests[result.hold].name,
    holdUntil: FORK + HOLD,
    runsTested: ranks.length,
    changed: result.changed.map((i) => guests[i].name),
    witness: guests[witness].name,
    original: describeTrace(original),
    alternative: describeTrace(result),
  });
};
const requestedHold = query.get("hold");
calculate(
  requestedHold !== null &&
    /^\d{1,2}$/.test(requestedHold) &&
    Number(requestedHold) < COUNT
    ? Number(requestedHold)
    : undefined,
);
createView(canvas)
  .then((v) => {
    view = v;
    if (ready) $("loading").hidden = true;
    dirty = true;
    paint();
    requestAnimationFrame(frame);
  })
  .catch(report);
