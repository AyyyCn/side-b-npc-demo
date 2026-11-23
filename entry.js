import listening from "./listening-layout.html";
import comparison from "./comparison/layout.html";
import home from "./suite/layout.html";
import lab from "./npc/lab.html";
import navStyle from "./npc/nav.html";
import { navigation } from "./npc/navigation.js";
const query = new URLSearchParams(location.search);
const mode = query.has("crew")
  ? "crew"
  : query.has("perception")
    ? "perception"
    : query.has("room") || query.has("screening")
      ? "room"
      : query.has("home") || query.has("deck")
        ? "home"
        : ["crowd", "seed", "pitch", "slide"].some((k) => query.has(k))
          ? "social"
          : "home";
const guided = ["screening", "pitch", "slide", "deck", "film"].some((k) =>
  query.has(k),
);
document.title =
  {
    home: "NPC Systems",
    social: "Social memory",
    room: "Listening room",
    crew: "Crew coordination",
    perception: "Perception & search",
  }[mode] + " · Side B";
document.querySelector("#app").outerHTML =
  mode === "room"
    ? listening
    : mode === "social"
      ? comparison
      : mode === "home"
        ? home
        : lab;
if (!guided) {
  document.head.insertAdjacentHTML("beforeend", navStyle);
  document.body.prepend(navigation(mode === "room" ? "social" : mode));
}
if (query.has("deck")) document.body.classList.add("deck");
if (query.has("film")) document.body.classList.add("film");
if (mode === "room") import("./play.js");
else if (mode === "social") import("./comparison/app.js");
else if (mode === "crew") import("./crew/app.js");
else if (mode === "perception") import("./perception/app.js");
else import("./suite/home.js");
