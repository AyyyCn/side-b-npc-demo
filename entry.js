import listening from "./listening-layout.html";
import comparison from "./comparison/layout.html";
const query = new URLSearchParams(location.search);
const legacy = query.has("room") || query.has("screening");
document.querySelector("#app").outerHTML = legacy ? listening : comparison;
if (legacy) {
  document.title = "Side B · Listening room";
  import("./play.js");
} else import("./comparison/app.js");
