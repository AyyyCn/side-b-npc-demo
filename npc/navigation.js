export const systems = [
  { id: "social", route: "?crowd", name: "Social memory" },
  { id: "crew", route: "?crew", name: "Crew coordination" },
  { id: "perception", route: "?perception", name: "Perception & search" },
];
export function navigation(active) {
  const bar = document.createElement("nav");
  bar.className = "npc-nav";
  bar.setAttribute("aria-label", "NPC systems");
  const home = document.createElement("a");
  home.href = "?home";
  home.className = "npc-wordmark";
  home.textContent = "Side B";
  bar.append(home);
  const group = document.createElement("div");
  const paths = [
    { id: "home", route: "?home", name: "NPC Systems" },
    ...systems,
  ];
  for (const s of paths) {
    const a = document.createElement("a");
    a.href = s.route;
    a.textContent = s.name;
    if (s.id === active) a.setAttribute("aria-current", "page");
    group.append(a);
  }
  bar.append(group);
  return bar;
}
