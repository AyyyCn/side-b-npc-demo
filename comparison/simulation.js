import { people } from "../npc/people.js";
// Measurements are in metres. Each tick is 100 ms; each branch uses the same clock.
export const HZ = 10;
export const CHANGE = 28;
export const FORK = 67;
export const HOLD = 40;
export const END = 400;
export const COUNT = people.length;
export const DEFAULT_SEED = 133;
export const DEFAULT_HOLD = 9;
export const WALL = 4.7;
export const DOOR = 1.45;
export const HEARING = 2.35;
export const PERSONAL_SPACE = 0.56;
const TALK = 6;
const BOUND_X = 12.3,
  BOUND_Z = 4.4;

function random(seed) {
  let n = seed >>> 0;
  return () => {
    n = (Math.imul(1664525, n) + 1013904223) >>> 0;
    return n / 4294967296;
  };
}
function shuffle(list, rand) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
export function lineOfSight(a, b) {
  for (const wall of [-WALL, WALL]) {
    if (a.x < wall === b.x < wall) continue;
    const z = a.z + ((b.z - a.z) * (wall - a.x)) / (b.x - a.x);
    if (Math.abs(z) > DOOR) return false;
  }
  return true;
}
export function hall(x) {
  return x < -WALL ? -1 : x > WALL ? 1 : 0;
}

export function makeWorld(seed) {
  const rand = random(seed),
    order = shuffle(
      Array.from({ length: COUNT }, (_, i) => i),
      rand,
    );
  const tickets = shuffle(order.slice(), rand);
  const starts = shuffle(order.slice(), rand);
  const guests = people.map(({ name, index: id }) => {
    const position = starts[id],
      ticket = tickets[id];
    return {
      id,
      name,
      group: Math.floor(position / 5),
      rig: Math.floor(rand() * 4),
      shirt: Math.floor(rand() * 10),
      height: 0.94 + rand() * 0.13,
      x: -3.75 + (position % 8) * 1.07 + (rand() - 0.5) * 0.4,
      z: -3.45 + Math.floor(position / 8) * 1.68 + (rand() - 0.5) * 0.48,
      yaw: rand() * Math.PI * 2,
      velocity: 0,
      walked: 0,
      walkMix: 0,
      seatX: 5.75 + (ticket % 5) * 1.25 + (rand() - 0.5) * 0.25,
      seatZ: -3.4 + Math.floor(ticket / 5) * 0.94 + (rand() - 0.5) * 0.19,
      lane: (rand() - 0.5) * 1.75,
      pace: 1.12 + rand() * 0.48,
      leaves: 48 + Math.floor(rand() * 50),
      generosity: 2 + Math.floor(rand() * 4),
      // Read the printed programme on entry. Every further belief has a parent receipt.
      memory: id,
      told: [],
      nextTalk: 0,
      partner: -1,
      doneAt: 0,
      outgoing: false,
    };
  });
  // A floor manager is on radio duty. Their location and identity vary with the crowd.
  const manager = order[0];
  const receipts = guests.map((g) => ({
    tick: 0,
    version: 1,
    from: -1,
    to: g.id,
    parent: -1,
    x: g.x,
    z: g.z,
    fromX: g.x,
    fromZ: g.z,
  }));
  return { seed, tick: 0, manager, guests, receipts };
}

function issue(world, who, from) {
  const guest = world.guests[who],
    teller = world.guests[from];
  guest.memory = world.receipts.length;
  world.receipts.push({
    tick: world.tick,
    version: 2,
    from,
    to: who,
    parent: teller ? teller.memory : -1,
    x: guest.x,
    z: guest.z,
    fromX: teller?.x ?? guest.x,
    fromZ: teller?.z ?? guest.z,
  });
  guest.nextTalk = world.tick + 3;
}
function busy(g, t) {
  return g.partner >= 0 && g.doneAt >= t;
}
const held = (world, id, hold) =>
  id === hold && world.tick > FORK && world.tick <= FORK + HOLD;

function finishExchanges(w, hold) {
  for (const speaker of w.guests) {
    if (!speaker.outgoing || speaker.doneAt > w.tick) continue;
    const listener = w.guests[speaker.partner];
    if (
      !held(w, speaker.id, hold) &&
      !held(w, listener.id, hold) &&
      distance(speaker, listener) <= HEARING &&
      lineOfSight(speaker, listener)
    ) {
      speaker.told.push(listener.id);
      if (
        w.receipts[speaker.memory].version > w.receipts[listener.memory].version
      )
        issue(w, listener.id, speaker.id);
    }
    speaker.outgoing = false;
    speaker.partner = listener.partner = -1;
    speaker.nextTalk = w.tick + 5;
  }
}

function neighbors(guests) {
  // Nine grid cells cover the maximum hearing distance.
  const grid = new Map(),
    size = HEARING;
  const key = (x, z) => (x + 16) * 64 + z + 16;
  for (const g of guests) {
    const k = key(Math.floor(g.x / size), Math.floor(g.z / size));
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push(g);
  }
  return (g, fn) => {
    const x = Math.floor(g.x / size),
      z = Math.floor(g.z / size);
    for (let i = x - 1; i <= x + 1; i++)
      for (let j = z - 1; j <= z + 1; j++) {
        const cell = grid.get(key(i, j));
        if (cell) for (const other of cell) if (other.id !== g.id) fn(other);
      }
  };
}

function findListeners(w, near, hold) {
  for (let k = 0; k < w.guests.length; k++) {
    const speaker = w.guests[(k + w.tick) % w.guests.length];
    const message = w.receipts[speaker.memory];
    if (
      message.version < 2 ||
      held(w, speaker.id, hold) ||
      busy(speaker, w.tick) ||
      speaker.nextTalk > w.tick ||
      speaker.told.length >= speaker.generosity
    )
      continue;
    let target = null,
      best = Infinity;
    near(speaker, (other) => {
      if (
        held(w, other.id, hold) ||
        busy(other, w.tick) ||
        other.id === message.from ||
        speaker.told.includes(other.id)
      )
        return;
      const d = distance(speaker, other);
      if (d > HEARING || !lineOfSight(speaker, other)) return;
      // Select by proximity and familiarity. A speaker cannot inspect another guest's memory.
      const score = d - (other.group === speaker.group ? 0.78 : 0);
      if (score < best) {
        best = score;
        target = other;
      }
    });
    if (!target) continue;
    speaker.partner = target.id;
    target.partner = speaker.id;
    speaker.doneAt = target.doneAt = w.tick + TALK;
    speaker.outgoing = true;
  }
}

function walk(w, g, hold) {
  const partner = w.guests[g.partner];
  if (held(w, g.id, hold) || busy(g, w.tick) || w.tick < g.leaves) {
    const yaw = partner ? Math.atan2(partner.x - g.x, partner.z - g.z) : g.yaw;
    return [g.x, g.z, yaw, 0];
  }
  const side = w.receipts[g.memory].version === 2 ? 1 : -1;
  let x = side * g.seatX,
    z = g.seatZ;
  // Cross partitions through the opening; keep the lane until the whole body has cleared the wall.
  for (const wall of side === 1 ? [-WALL, WALL] : [WALL, -WALL]) {
    if (side * (g.x - wall) >= 0.49 || side * (x - wall) <= 0) continue;
    x = wall + side * 0.75;
    z = g.lane;
    if (side * (g.x - wall) < -0.65 && Math.abs(g.z) > DOOR - 0.25)
      x = wall - side * 0.52;
    break;
  }
  let dx = x - g.x,
    dz = z - g.z;
  const d = Math.hypot(dx, dz);
  if (d < 0.09) return [g.x, g.z, Math.atan2(side * 8.8 - g.x, -4.7 - g.z), 0];
  const stride = Math.min(g.pace / HZ, d);
  dx = (dx / d) * stride;
  dz = (dz / d) * stride;
  const next = {
    x: Math.max(-BOUND_X, Math.min(BOUND_X, g.x + dx)),
    z: Math.max(-BOUND_Z, Math.min(BOUND_Z, g.z + dz)),
  };
  if (!lineOfSight(g, next)) next.x = g.x;
  const speed = Math.hypot(next.x - g.x, next.z - g.z) * HZ;
  return [
    next.x,
    next.z,
    speed > 0.03 ? Math.atan2(next.x - g.x, next.z - g.z) : g.yaw,
    speed,
  ];
}

// Reserve continuous relative movement, including where the neighbour has already committed
// to walk this tick. Checking endpoints alone lets two people pass through one another.
function motionClear(g, nx, nz, others, accepted) {
  for (const o of others) {
    const rx = g.x - o.x,
      rz = g.z - o.z,
      q = accepted[o.id];
    const dx = nx - g.x - (q ? q[0] - o.x : 0),
      dz = nz - g.z - (q ? q[1] - o.z : 0);
    const u = Math.max(
      0,
      Math.min(1, -(rx * dx + rz * dz) / (dx * dx + dz * dz || 1)),
    );
    if ((rx + u * dx) ** 2 + (rz + u * dz) ** 2 < PERSONAL_SPACE ** 2)
      return false;
  }
  for (const wall of [-WALL, WALL]) {
    const d = 0.12 + PERSONAL_SPACE / 2;
    if (Math.min(g.x, nx) > wall + d || Math.max(g.x, nx) < wall - d) continue;
    if (Math.max(Math.abs(g.z), Math.abs(nz)) > DOOR - d) return false;
  }
  return Math.abs(nx) <= BOUND_X && Math.abs(nz) <= BOUND_Z;
}
const turns = [0, 0.36, -0.36, 0.76, -0.76, 1.18, -1.18, 1.52, -1.52].map(
  (a) => [Math.cos(a), Math.sin(a)],
);
function reserveStep(g, intent, near, accepted) {
  const dx = intent[0] - g.x,
    dz = intent[1] - g.z;
  if (Math.abs(dx) + Math.abs(dz) < 1e-8) return intent;
  const others = [];
  near(g, (o) => {
    if (Math.abs(g.x - o.x) < 1.15 && Math.abs(g.z - o.z) < 1.15)
      others.push(o);
  });
  for (const [c, s] of turns) {
    const x = g.x + dx * c - dz * s,
      z = g.z + dx * s + dz * c;
    if (motionClear(g, x, z, others, accepted))
      return [
        x,
        z,
        Math.atan2(x - g.x, z - g.z),
        Math.hypot(x - g.x, z - g.z) * HZ,
      ];
  }
  return [g.x, g.z, g.yaw, 0];
}

export function step(w, hold = -1) {
  w.tick++;
  if (w.tick === CHANGE) issue(w, w.manager, -2);
  if (w.tick === FORK + 1 && hold >= 0) {
    // Cancel a conversation already in flight. A partially delivered fact creates no receipt.
    const guest = w.guests[hold],
      other = w.guests[guest.partner];
    if (other) {
      guest.partner = other.partner = -1;
      guest.outgoing = other.outgoing = false;
    }
  }
  finishExchanges(w, hold);
  const near = neighbors(w.guests);
  findListeners(w, near, hold);
  const next = new Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const g = w.guests[(i + w.tick) % COUNT];
    next[g.id] = reserveStep(g, walk(w, g, hold), near, next);
  }
  for (let i = 0; i < w.guests.length; i++) {
    const g = w.guests[i];
    const [x, z, yaw, speed] = next[i];
    g.walked += speed / HZ;
    g.walkMix += Math.max(
      -0.34,
      Math.min(0.34, Math.min(1, speed / 0.72) - g.walkMix),
    );
    const delta = Math.atan2(Math.sin(yaw - g.yaw), Math.cos(yaw - g.yaw));
    g.yaw += Math.max(-0.57, Math.min(0.57, delta));
    g.x = x;
    g.z = z;
    g.velocity = speed;
  }
}
// Store presentation samples independently from the full checkpoint needed to restart the simulation.
export const STRIDE = 7;
function sample(w, frames) {
  const offset = w.tick * COUNT * STRIDE;
  for (const g of w.guests) {
    const i = offset + g.id * STRIDE;
    frames[i] = g.x;
    frames[i + 1] = g.z;
    frames[i + 2] = g.yaw;
    frames[i + 3] = g.velocity;
    frames[i + 4] = g.memory;
    frames[i + 5] = g.walked;
    frames[i + 6] = g.walkMix;
  }
}
function run(w, hold, frames) {
  while (w.tick < END) {
    step(w, hold);
    if (frames) sample(w, frames);
  }
}
export function prepare(seed) {
  const w = makeWorld(seed),
    frames = new Float32Array((END + 1) * COUNT * STRIDE);
  sample(w, frames);
  while (w.tick < FORK) {
    step(w);
    sample(w, frames);
  }
  const checkpoint = structuredClone(w);
  run(w, -1, frames);
  return {
    checkpoint,
    original: { frames, receipts: w.receipts },
    finalHalls: w.guests.map((g) => hall(g.x)),
  };
}
export function branch(session, hold, record = true) {
  const w = structuredClone(session.checkpoint);
  const frames = record
    ? new Float32Array(session.original.frames.length)
    : null;
  if (frames)
    frames.set(
      session.original.frames.subarray(0, (FORK + 1) * COUNT * STRIDE),
    );
  run(w, hold, frames);
  const changed = w.guests
    .filter((g) => hall(g.x) * session.finalHalls[g.id] === -1)
    .map((g) => g.id);
  return {
    hold,
    changed,
    east: w.guests.filter((g) => hall(g.x) === 1).length,
    ...(frames ? { frames, receipts: w.receipts } : {}),
  };
}
export function history(receipts, memory) {
  const result = [];
  for (let i = memory; i >= 0; i = receipts[i].parent)
    result.unshift(receipts[i]);
  return result;
}
export function readGuest(trace, tick, id) {
  const offset = (tick * COUNT + id) * STRIDE,
    f = trace.frames;
  return {
    x: f[offset],
    z: f[offset + 1],
    yaw: f[offset + 2],
    speed: f[offset + 3],
    memory: f[offset + 4],
  };
}
