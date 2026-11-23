import { byKey } from "../npc/people.js";

export const observer = byKey.ida;
export const origin = { x: -3.25, z: 2.25 };
const archiveLog = [
  { id: "intake", name: "Intake", x: -3, z: -2, filings: 19 },
  { id: "catalog", name: "Catalogue", x: 0, z: -2, filings: 23 },
  { id: "dispatch", name: "Dispatch", x: 3, z: -2, filings: 8 },
];
const totalFilings = archiveLog.reduce((sum, bin) => sum + bin.filings, 0);
export const stations = archiveLog.map((bin) => ({
  ...bin,
  prior: bin.filings / totalFilings,
}));
export const PLACEMENT = 18,
  START_SEARCH = 32,
  INSPECT = 15;
const pace = 1.48,
  reach = 8.5,
  halfFOV = Math.cos((42 * Math.PI) / 180);
const dist = (a, b) => Math.hypot(b.x - a.x, b.z - a.z);
const approach = (s) => ({ x: s.x, z: -1.25 });
export function screenRect(closed) {
  return closed
    ? { left: -2.15, right: 1.04, back: 0.03, front: 0.22 }
    : { left: 3.55, right: 4.68, back: -0.03, front: 0.28 };
}
// Clip a segment to the screen footprint. The same geometry feeds sight, navigation and rendering.
export function crosses(a, b, box, padding = 0) {
  let low = 0,
    high = 1;
  for (const [p, d, min, max] of [
    [a.x, b.x - a.x, box.left - padding, box.right + padding],
    [a.z, b.z - a.z, box.back - padding, box.front + padding],
  ]) {
    if (Math.abs(d) < 1e-10) {
      if (p < min || p > max) return false;
      continue;
    }
    const u = (min - p) / d,
      v = (max - p) / d;
    low = Math.max(low, Math.min(u, v));
    high = Math.min(high, Math.max(u, v));
    if (low > high) return false;
  }
  return true;
}
export function canSee(from, target, box) {
  const length = dist(from, target);
  if (length > reach || length === 0) return false;
  const facing = { x: 2.6, z: -4.25 };
  const cosine =
    ((target.x - from.x) * facing.x + (target.z - from.z) * facing.z) /
    (length * Math.hypot(facing.x, facing.z));
  return cosine >= halfFOV && !crosses(from, target, box);
}
const dirs = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];
export const WALK_CLEARANCE = 0.4;
export function route(a, b, box) {
  const clear = (p, q) => !crosses(p, q, box, WALK_CLEARANCE);
  if (clear(a, b)) return [a, b];
  const key = (p) => p.x + "," + p.z;
  const start = { p: a, g: 0, f: dist(a, b), parent: null },
    open = [start],
    best = new Map([[key(a), 0]]);
  while (open.length) {
    open.sort((u, v) => v.f - u.f);
    const n = open.pop();
    if (n.g > best.get(key(n.p))) continue;
    if (n.p.x === b.x && n.p.z === b.z) {
      const raw = [];
      for (let node = n; node; node = node.parent) raw.unshift(node.p);
      const result = [a];
      for (let i = 0; i < raw.length - 1; ) {
        let j = raw.length - 1;
        while (j > i + 1 && !clear(raw[i], raw[j])) j--;
        result.push(raw[j]);
        i = j;
      }
      return result;
    }
    for (const [dx, dz] of dirs) {
      const p = { x: n.p.x + dx * 0.25, z: n.p.z + dz * 0.25 };
      if (
        p.x < -4.75 ||
        p.x > 4.75 ||
        p.z < -1.25 ||
        p.z > 2.75 ||
        !clear(n.p, p)
      )
        continue;
      const g = n.g + dist(n.p, p),
        k = key(p);
      if (g + 1e-8 >= (best.get(k) ?? Infinity)) continue;
      best.set(k, g);
      open.push({ p, g, f: g + dist(p, b), parent: n });
    }
  }
  throw Error("The record bins must be reachable.");
}
const length = (path) =>
  path.slice(1).reduce((sum, p, i) => sum + dist(path[i], p), 0);
const walkTicks = (path) => Math.ceil((length(path) / pace) * 10);
const normalize = (weights) => {
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => w / sum);
};
// The policy receives the posterior and traversable geometry. It has no access to the sleeve's location.
export function searchOrder(weights, from, paths) {
  let best = null,
    lowest = Infinity;
  function visit(at, unseen, elapsed, cost, order) {
    if (!unseen.length) {
      if (cost < lowest) {
        lowest = cost;
        best = order;
      }
      return;
    }
    for (const i of unseen) {
      const finish = elapsed + walkTicks(paths(at, i)) + INSPECT;
      visit(
        i,
        unseen.filter((j) => j !== i),
        finish,
        cost + finish * weights[i],
        [...order, i],
      );
    }
  }
  visit(
    from,
    weights.flatMap((w, i) => (w > 0 ? [i] : [])),
    0,
    0,
    [],
  );
  return best;
}
export function simulate(closed = true, destination = "dispatch") {
  const actual = stations.findIndex((s) => s.id === destination);
  if (actual < 0) throw RangeError("Choose a record bin.");
  const screen = screenRect(closed),
    prior = stations.map((s) => s.prior);
  const visible = stations.map((s) => canSee(origin, s, screen)),
    seen = visible[actual];
  const sight = seen
    ? stations.map((_, i) => Number(i === actual))
    : normalize(prior.map((p, i) => (visible[i] ? 0 : p)));
  const observations = [
    { t: 0, weights: prior, text: "Ida is watching the archive." },
    {
      t: PLACEMENT,
      weights: sight,
      text: seen
        ? "Ida saw the sleeve go into " + stations[actual].name + "."
        : "The filing was out of sight. Ida can rule out the bins she could see.",
    },
  ];
  const routes = new Map();
  const path = (a, b) => {
    const k = a + "/" + b;
    if (!routes.has(k))
      routes.set(
        k,
        route(
          a === -1 ? origin : approach(stations[a]),
          approach(stations[b]),
          screen,
        ),
      );
    return routes.get(k);
  };
  let weights = sight,
    t = START_SEARCH,
    at = -1;
  const visits = [],
    moves = [],
    decisions = [];
  while (true) {
    const order = searchOrder(weights, at, path),
      next = order[0],
      walk = path(at, next);
    decisions.push({ t, order, weights: weights.slice() });
    const total = length(walk),
      travel = walkTicks(walk);
    let walked = 0;
    for (let i = 1; i < walk.length; i++) {
      const start = t + (total ? (travel * walked) / total : 0);
      walked += dist(walk[i - 1], walk[i]);
      moves.push({
        from: walk[i - 1],
        to: walk[i],
        start,
        end: t + (total ? (travel * walked) / total : 0),
      });
    }
    const arrival = t + travel;
    t = arrival + INSPECT;
    const found = next === actual;
    visits.push({
      i: next,
      depart: decisions.at(-1).t,
      arrive: arrival,
      end: t,
      found,
    });
    if (found) {
      observations.push({
        t,
        weights: stations.map((_, i) => Number(i === next)),
        text: "Ida opened " + stations[next].name + " and found the sleeve.",
      });
      break;
    }
    weights = normalize(weights.map((p, i) => (i === next ? 0 : p)));
    observations.push({
      t,
      weights,
      text: stations[next].name + " was empty. Ida updates her search.",
    });
    at = next;
  }
  return {
    closed,
    destination,
    screen,
    visible,
    seen,
    observations,
    moves,
    visits,
    decisions,
    end: t,
  };
}
export function searchState(run, t) {
  const evidence = run.observations.filter((o) => o.t <= t);
  const decision = run.decisions.filter((d) => d.t <= t).at(-1);
  const visit = run.visits.find((v) => v.depart <= t && t < v.end);
  let pos = { ...origin },
    speed = 0,
    yaw = Math.atan2(2.6, -4.25);
  for (const leg of run.moves) {
    if (t < leg.start) break;
    const f = Math.min(1, (t - leg.start) / (leg.end - leg.start || 1));
    pos = {
      x: leg.from.x + (leg.to.x - leg.from.x) * f,
      z: leg.from.z + (leg.to.z - leg.from.z) * f,
    };
    if (t < leg.end) {
      speed = pace;
      yaw = Math.atan2(leg.to.x - leg.from.x, leg.to.z - leg.from.z);
      break;
    }
    yaw = Math.PI;
  }
  return {
    pos,
    speed,
    yaw,
    evidence,
    weights: evidence.at(-1).weights,
    decision,
    visit,
    found: t >= run.end,
    inspected: run.visits.filter((v) => v.end <= t),
  };
}
