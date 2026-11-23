import {
  simulate,
  searchState,
  observer,
  stations,
  PLACEMENT,
  START_SEARCH,
} from "./search.js";
import { archiveView } from "./view.js";
import { timeline, el, setText, stamp } from "../npc/timeline.js";
const q = new URLSearchParams(location.search);
let closed = q.get("screen") !== "open",
  destination = stations.some((s) => s.id === q.get("bin"))
    ? q.get("bin")
    : "dispatch";
let run,
  other,
  view,
  lastEvidence = "";
function prepare() {
  run = simulate(closed, destination);
  other = simulate(!closed, destination);
  lastEvidence = "";
}
prepare();
setText("lab-title", "Perception & search");
setText(
  "premise",
  "File the same record behind a movable screen. Watch where Ida looks for it.",
);
setText("experiment", "The missing sleeve");
el("fields").innerHTML =
  '<label>File the sleeve in<select id="bin">' +
  stations
    .map((s) => '<option value="' + s.id + '">' + s.name + "</option>")
    .join("") +
  '</select></label><label>Folding screen<select id="screen"><option value="closed">Across the room</option><option value="open">Folded aside</option></select></label>';
el("actions").innerHTML =
  '<button class="main-action" id="search-start">Watch the search</button><button id="compare-screen">Fold screen aside</button>';
el("under").innerHTML =
  '<h3>Ida’s observations</h3><ol class="evidence-list" id="observations"></ol>';
el("details").innerHTML =
  '<h3>Where Ida thinks the sleeve is</h3><div id="weights"></div><p class="proof-note">Starting odds use 50 sample filings. Seeing the deposit or finding an empty bin changes Ida’s estimate.</p><p class="interactive"><a id="send-record" hidden>Send the sleeve to sound check ↗</a></p>';
el("weights").innerHTML = stations
  .map(
    (s) =>
      '<div class="prob"><span>' +
      s.name +
      "</span><i><b></b></i><span>0%</span></div>",
  )
  .join("");
const timer = timeline({
  initial: PLACEMENT,
  limit: () => run.end,
  draw,
  describe,
});
function configure(play = false) {
  prepare();
  timer.jump(PLACEMENT, play);
}
el("bin").value = destination;
el("screen").value = closed ? "closed" : "open";
el("bin").onchange = (e) => {
  destination = e.target.value;
  configure();
};
el("screen").onchange = (e) => {
  closed = e.target.value === "closed";
  configure();
};
el("compare-screen").onclick = () => {
  closed = !closed;
  el("screen").value = closed ? "closed" : "open";
  configure(true);
};
el("search-start").onclick = () => timer.jump(0, true);
function describe(t) {
  const s = searchState(run, t);
  return {
    mode: "perception",
    closed,
    bin: destination,
    seen: t < PLACEMENT ? null : run.seen,
    visible: run.visible,
    weights: s.weights,
    observer: { name: observer.name, ...s.pos },
    found: s.found,
    inspected: s.inspected.map((v) => stations[v.i].name),
    currentSearch: s.visit ? stations[s.visit.i].name : null,
    evidence: s.evidence.map((e) => e.text),
    finishedAt: run.end,
  };
}
function draw(t) {
  const state = searchState(run, t);
  view(run, t, state);
  const send = el("send-record");
  send.hidden = !state.found;
  if (state.found) {
    const work = new URLSearchParams("crew");
    work.set("archive", closed ? "closed" : "open");
    work.set("bin", destination);
    for (const k of ["run", "seed", "hold"])
      if (q.has(k)) work.set(k, q.get(k));
    send.href = "?" + work;
  }
  const target = state.visit ? stations[state.visit.i].name : null;
  const status = state.found
    ? "Ida found the sleeve in " +
      stations.find((s) => s.id === destination).name
    : t < PLACEMENT
      ? "The sleeve is about to be filed"
      : t < START_SEARCH
        ? run.seen
          ? "Ida saw the deposit"
          : "The screen blocked the deposit"
        : t < state.visit.arrive
          ? "Ida is walking to " + target
          : "Ida checks " + target;
  setText("scene-caption", status);
  setText("compare-screen", closed ? "Fold screen aside" : "Unfold screen");
  const signature = closed + "/" + destination + "/" + state.evidence.length;
  if (signature === lastEvidence) return;
  lastEvidence = signature;
  const across = closed ? run : other,
    open = closed ? other : run;
  el("result").innerHTML =
    '<div class="metrics">' +
    [
      [across, "Screen across"],
      [open, "Screen aside"],
    ]
      .map(
        ([r, label]) =>
          '<div class="metric"><strong>' +
          r.visits.length +
          " " +
          (r.visits.length === 1 ? "bin" : "bins") +
          "</strong><span>" +
          label +
          "</span></div>",
      )
      .join("") +
    "</div><p>Same sleeve in " +
    stations.find((s) => s.id === destination).name +
    ". The counts compare complete replays.</p>";
  const rows = el("weights").children;
  state.weights.forEach((w, i) => {
    rows[i].querySelector("b").style.width = w * 100 + "%";
    rows[i].lastChild.textContent = Math.round(w * 100) + "%";
  });
  el("observations").innerHTML = state.evidence
    .map(
      (o) =>
        "<li><time>" + stamp(o.t) + "</time><span>" + o.text + "</span></li>",
    )
    .join("");
}
archiveView(el("world"))
  .then((v) => {
    view = v;
    timer.open();
  })
  .catch(timer.fail);
