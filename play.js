import { createRoom } from "./room.js";
import { createStage } from "./stage.js";
import { music, wake } from "./sound.js";

const $ = (s) => document.querySelector(s);
const canvas = $("canvas");
const screening = new URLSearchParams(location.search).has("screening");
if (screening) document.body.classList.add("screening");
const ids = ["nell", "kit", "finn", "ida", "silas", "lark"];
const hit = new Map();
let showStep = "ready",
  nextInterview = 0,
  introLeft = 0;
let room,
  scene,
  stage,
  lag = 0,
  last = 0,
  sound = true,
  selected = "",
  model = false,
  turn = 0;
function send(action, payload = {}) {
  room.act(action, payload);
}
function render(dt) {
  if (!scene || !stage) return;
  stage.update(scene, dt, selected);
  music(scene.phase !== "choose" && scene.time > 4, sound);
  if (screening) advanceScreening(dt);
}
function choose(person) {
  wake();
  send("whisper", { person });
}
function ask(person, kind = "source", question) {
  selected = person;
  wake();
  send("ask", { person, kind, question });
  updateControls();
}
function setText(node, text) {
  if (node.textContent !== text) node.textContent = text;
}
function invitationPath(people) {
  const last = people
    .filter((p) => p.source)
    .sort((a, b) => b.learned - a.learned)[0];
  if (!last) return "";
  const names = [];
  let person = last;
  while (person && names.length < people.length) {
    names.unshift(person.name);
    person = people.find((p) => p.id === person.source);
  }
  return ["You", ...names].join("  ›  ");
}
// The presentation sends the same actions as a player. Interviews wait for attendance.
function advanceScreening(dt) {
  if (showStep === "intro") {
    introLeft -= dt;
    if (introLeft <= 0) {
      showStep = "invited";
      choose("nell");
    }
  } else if (
    showStep === "invited" &&
    scene.phase === "concert" &&
    scene.time >= 11.3
  ) {
    showStep = "first-answer";
    nextInterview = scene.time + 3.45;
    ask("ida");
  } else if (showStep === "first-answer" && scene.time >= nextInterview) {
    showStep = "last-answer";
    nextInterview = scene.time + 4.5;
    ask("silas");
  } else if (showStep === "last-answer" && scene.time >= nextInterview) {
    showStep = "done";
    $("#screen-play").textContent = "Replay";
    $("#screen-controls").hidden = false;
  }
}
$("#screen-play").onclick = () => {
  if (!scene) return;
  wake();
  selected = "";
  turn++;
  showStep = "intro";
  introLeft = 1.65;
  if (scene.phase !== "choose") send("again");
  $("#screen-controls").hidden = true;
  updateControls();
};
function updateControls() {
  const choosing = scene.phase === "choose";
  document.body.dataset.phase = scene.phase;
  const path = invitationPath(scene.people);
  setText($("#path"), path);
  $("#chain").hidden = !path;
  $("#cast").hidden = choosing;
  for (const b of $("#cast").children)
    b.setAttribute("aria-pressed", String(b.dataset.person === selected));
  $("#nell").hidden = $("#silas").hidden = !choosing;
  $("#reset").hidden = choosing;
  for (const p of scene.people) {
    const b = hit.get(p.id);
    b.disabled = choosing && !["nell", "silas"].includes(p.id);
    b.setAttribute("aria-label", (choosing ? "Tell " : "Speak with ") + p.name);
  }
  const arrivals = scene.people.filter((p) => p.arrived).length;
  $("#label").textContent = choosing
    ? "The invitation"
    : scene.phase === "concert"
      ? "At the booth · " + arrivals + " listening"
      : "Word is spreading";
  const person = scene.people.find((p) => p.id === selected);
  $("#prompt").textContent = choosing
    ? "Lark has a secret set. Who hears first?"
    : scene.question ||
      (person
        ? "Speaking with " + person.name
        : "Select a guest to check their memory.");
  const speaker = scene.people.find((p) => p.id === scene.speaker);
  const reply = speaker ? speaker.name + " · " + scene.line : "";
  if ($("#reply").textContent !== reply) $("#reply").textContent = reply;
  const inConcert = scene.phase === "concert";
  const cue =
    screening &&
    !scene.question &&
    !speaker &&
    scene.phase !== "choose" &&
    scene.people.some((p) => p.arrived || (p.walking && !p.partner));
  const action = cue
    ? inConcert
      ? arrivals + " guests came to hear Lark."
      : "The guests head toward Lark’s booth."
    : "";
  setText(
    $("#context"),
    scene.question ||
      (screening && scene.time < 2.5 && !choosing
        ? "You tell Nell about Lark’s secret set."
        : ""),
  );
  setText($("#speaker"), speaker ? speaker.name : "");
  setText(
    $("#quote"),
    speaker
      ? scene.line
      : choosing && showStep === "intro"
        ? "Lark is playing a secret set after close."
        : action,
  );
  $("#queries").hidden = choosing || !person;
  $("form").hidden = !model;
}
function advance(ms) {
  if (!room) return;
  const step = room.interval;
  lag += ms / 1000;
  while (lag >= step) {
    room.step();
    lag -= step;
  }
  render(ms / 1000);
}
function frame(now) {
  advance(Math.min(120, last ? now - last : 0));
  last = now;
  requestAnimationFrame(frame);
}
for (const id of ids) {
  const b = document.createElement("button"),
    name = document.createElement("span");
  name.textContent = id[0].toUpperCase() + id.slice(1);
  b.append(name);
  b.disabled = true;
  $("#actors").append(b);
  hit.set(id, b);
  b.onclick = () => {
    turn++;
    if (scene.phase === "choose") choose(id);
    else ask(id);
  };
}
for (const id of ids) {
  const b = document.createElement("button");
  b.textContent = id[0].toUpperCase() + id.slice(1);
  b.setAttribute("aria-label", "Ask " + b.textContent);
  b.dataset.person = id;
  b.onclick = () => {
    turn++;
    ask(id);
  };
  $("#cast").append(b);
}
$("#camera").onclick = (e) => {
  const mode = stage.toggle();
  e.currentTarget.textContent =
    mode === "director" ? "Camera · Auto" : "Camera · Wide";
};
$("#nell").onclick = () => choose("nell");
$("#silas").onclick = () => choose("silas");
$("#reset").onclick = () => {
  turn++;
  selected = "";

  $("input").value = "";
  send("again");
};
$("#sound").onclick = (e) => {
  wake();
  sound = !sound;
  e.currentTarget.textContent = sound ? "Sound on" : "Sound off";
  e.currentTarget.setAttribute("aria-pressed", String(sound));
};
for (const b of document.querySelectorAll("[data-kind]"))
  b.onclick = () => {
    turn++;
    ask(selected, b.dataset.kind);
  };
$("form").onsubmit = async (e) => {
  e.preventDefault();
  const input = $("input"),
    question = input.value.trim(),
    person = selected,
    token = ++turn;
  if (!question) return;
  input.setCustomValidity("");
  try {
    const res = await fetch("/interpret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw Error();
    const { kind } = await res.json();
    if (token === turn) {
      ask(person, kind, question);
      input.value = "";
    }
  } catch {
    if (token === turn) {
      input.setCustomValidity(
        "The local model is unavailable. Use one of the three question buttons.",
      );
      input.reportValidity();
    }
  }
};
$("input").oninput = (e) => e.target.setCustomValidity("");
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "f" && e.target.tagName !== "INPUT") {
    if (document.fullscreenElement) document.exitFullscreen();
    else
      $("main")
        .requestFullscreen()
        .catch(() => {});
  }
});
async function boot() {
  stage = await createStage(canvas, hit);
  room = await createRoom((state) => {
    scene = state;
    updateControls();
  });
  render(0);
  $("#stage-status").hidden = true;
  if (screening) $("#screen-controls").hidden = false;
  requestAnimationFrame(frame);
  model = document.documentElement.hasAttribute("data-interviews");
  updateControls();
}
window.advanceTime = advance;
window.render_game_to_text = () =>
  JSON.stringify({
    origin: "floor plane in metres; x toward the decks, +z toward the lounge",
    selected,
    freeText: model,
    ...scene,
  });
boot().catch((err) => {
  const message =
    "The listening room needs a browser with WebGL 2 and hardware acceleration.";
  $("#prompt").textContent = message;
  $("#stage-status").textContent = message;
  console.error(err);
});
