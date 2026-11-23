import { systems } from "../npc/navigation.js";
import social from "./previews/social.webp";
import crew from "./previews/crew.webp";
import perception from "./previews/perception.webp";
import { readForecast, makeJobs } from "../crew/scenario.js";
import { initialPlan, recover, checkpoint } from "../crew/planner.js";
import { simulate } from "../perception/search.js";
const f = readForecast(new URLSearchParams()),
  base = initialPlan(makeJobs(f.original)),
  t = checkpoint(base);
const open = simulate(false, "dispatch"),
  screen = simulate(true, "dispatch");
const data = [
  [
    social,
    "Two guests exchange news in the listening room.",
    "Hold one messenger for four seconds and follow the news through a crowd of forty.",
    f.original + " → " + f.altered,
    "guests reach East Hall",
  ],
  [
    crew,
    "Two crew members move the sound rack across the stage.",
    "Pull a handler off a moving PA rack. The crew must finish the work and still make doors.",
    (recover(base, t, 1, 120, { keepTeams: true }).end / 10).toFixed(1) +
      " → " +
      (recover(base, t, 1, 120).end / 10).toFixed(1) +
      " s",
    "to finish the show setup",
  ],
  [
    perception,
    "Ida searches the record archive behind a folding screen.",
    "Move a screen while a record is filed. Ida’s next move depends on what she saw.",
    screen.visits.length + " → " + open.visits.length,
    "bins checked for the same sleeve",
  ],
];
const gallery = document.getElementById("gallery");
for (const [i, s] of systems.entries()) {
  const [img, alt, desc, value, label] = data[i],
    card = document.createElement("article");
  card.className = "card";
  card.innerHTML =
    '<a href="' +
    s.route +
    '" aria-label="Open ' +
    s.name +
    '" id="open-' +
    s.id +
    '"><figure><img alt="' +
    alt +
    '" src="' +
    img +
    '"></figure><h2>' +
    s.name +
    "</h2></a><p>" +
    desc +
    '</p><div class="measure"><strong>' +
    value +
    "</strong><span>" +
    label +
    "</span></div>";
  gallery.append(card);
}
window.render_game_to_text = () =>
  JSON.stringify({
    ready: true,
    mode: "home",
    systems: systems.map((s) => s.id),
  });
window.advanceTime = () => {};
