// Physical dimensions in metres, shared by the route planner, contact targets and rendered rack.
export const cart = {
  halfX: 0.48,
  halfZ: 0.62,
  stanceX: 1.05,
  stanceZ: 0.43,
  barX: -0.61,
  barY: 1.045,
};
export const BODY_GAP = 0.59,
  CART_GAP = 0.3;
export const floor = { left: -6.45, right: 5.55, back: -1.48, front: 3.52 };
export const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
export function stance(point, size, slot, id) {
  if (id === "rack")
    return {
      x: point.x - cart.stanceX,
      z: point.z + (slot === 0 ? -cart.stanceZ : cart.stanceZ),
    };
  if (size === 2)
    return { x: point.x + (slot === 0 ? -0.44 : 0.44), z: point.z };
  return { ...point };
}
export function rect(a, b = a, x = 0, z = x) {
  return {
    left: Math.min(a.x, b.x) - x,
    right: Math.max(a.x, b.x) + x,
    back: Math.min(a.z, b.z) - z,
    front: Math.max(a.z, b.z) + z,
  };
}
export const cartBox = (a, b = a) =>
  rect(a, b, cart.halfX + CART_GAP, cart.halfZ + CART_GAP);
export const inside = (p, r) =>
  p.x > r.left && p.x < r.right && p.z > r.back && p.z < r.front;
// Open rectangles allow tangency. The visibility graph uses a small margin at each corner.
export function cuts(a, b, r) {
  let from = 0,
    to = 1;
  for (const [p, v, lo, hi] of [
    [a.x, b.x - a.x, r.left, r.right],
    [a.z, b.z - a.z, r.back, r.front],
  ]) {
    if (Math.abs(v) < 1e-10) {
      if (p <= lo || p >= hi) return false;
      continue;
    }
    const u = (lo - p) / v,
      w = (hi - p) / v;
    from = Math.max(from, Math.min(u, w));
    to = Math.min(to, Math.max(u, w));
    if (to - from < 1e-9) return false;
  }
  return true;
}
export function nextFootstep(from, goal, obstacles, stride) {
  const clear = (a, b) => obstacles.every((o) => !cuts(a, b, o));
  const step = (p) => {
    const d = distance(from, p);
    return d <= stride
      ? p
      : {
          x: from.x + ((p.x - from.x) * stride) / d,
          z: from.z + ((p.z - from.z) * stride) / d,
        };
  };
  if (distance(from, goal) < 1e-6) return from;
  if (clear(from, goal)) return step(goal);
  if (obstacles.some((o) => inside(goal, o))) return from;
  const nodes = [from, goal],
    border = 0.022;
  for (const r of obstacles)
    for (const x of [r.left - border, r.right + border])
      for (const z of [r.back - border, r.front + border]) {
        const p = { x, z };
        if (inside(p, floor) && !obstacles.some((o) => inside(p, o)))
          nodes.push(p);
      }
  const costs = nodes.map(() => Infinity),
    next = nodes.map(() => -1),
    done = new Set();
  costs[1] = 0;
  for (;;) {
    let nearest = -1,
      best = Infinity;
    for (let i = 0; i < nodes.length; i++)
      if (!done.has(i) && costs[i] < best) {
        nearest = i;
        best = costs[i];
      }
    if (nearest === -1) return from;
    if (nearest === 0) return step(nodes[next[0]]);
    done.add(nearest);
    for (let i = 0; i < nodes.length; i++) {
      if (done.has(i)) continue;
      const cost = best + distance(nodes[nearest], nodes[i]);
      if (cost >= costs[i] || !clear(nodes[nearest], nodes[i])) continue;
      costs[i] = cost;
      next[i] = nearest;
    }
  }
}
