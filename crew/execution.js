import { points, TICKS_PER_SECOND as HZ } from "./scenario.js";
import {
  cartBox,
  BODY_GAP,
  rect,
  inside,
  stance,
  distance,
  nextFootstep,
} from "./floor.js";

const lerp = (a, b, f) => ({
  x: a.x + (b.x - a.x) * f,
  z: a.z + (b.z - a.z) * f,
});
const rackCorridor = (from, to) => [
  cartBox(from, to),
  ...[0, 1].map((slot) =>
    rect(stance(from, 2, slot, "rack"), stance(to, 2, slot, "rack"), BODY_GAP),
  ),
];
function record(track, start, from, to, task, kind) {
  const last = track.at(-1);
  if (last?.kind === kind && last.task === task && last.end === start) {
    const ticks = last.end - last.start;
    if (
      Math.abs((last.to.x - last.from.x) / ticks - (to.x - from.x)) < 1e-7 &&
      Math.abs((last.to.z - last.from.z) / ticks - (to.z - from.z)) < 1e-7
    ) {
      last.end++;
      last.to = to;
      return;
    }
  }
  track.push({ start, end: start + 1, from, to, task, kind });
}
// The resource planner proposes job order and team membership. Execute it on the floor and time
// actual arrivals. Every walker reserves its swept footprint for the complete 100 ms step.
export function execute(
  members,
  assignment,
  {
    start = 0,
    initial = members.map((m) => m.home),
    rack = points.dock,
    finished = {},
    active = [],
    incident,
  } = {},
) {
  const queues = members.map((m) =>
    assignment
      .filter((e) => e.team.includes(m.id))
      .sort((a, b) => a.start - b.start),
  );
  const pending = assignment.slice(),
    running = active.slice(),
    ends = { ...finished },
    entries = [],
    tracks = members.map(() => []);
  let positions = initial.slice(),
    lastProgress = start;
  const horizon =
    Math.max(
      start,
      incident?.until ?? 0,
      ...assignment.map((e) => e.job.release ?? 0),
    ) +
    assignment.reduce((sum, e) => sum + e.job.ticks, 0) +
    1200;
  for (let t = start; t <= horizon; t++) {
    for (let i = running.length - 1; i >= 0; i--) {
      const e = running[i];
      if (e.end === t) {
        ends[e.job.id] = t;
        running.splice(i, 1);
      }
    }
    if (
      !pending.length &&
      !running.length &&
      (!incident || t >= incident.until)
    )
      return { entries, tracks };
    const onCall = (i) => incident?.absent === i && t < incident.until;
    const atWork = (i) => running.find((e) => e.team.includes(i));
    for (let i = pending.length - 1; i >= 0; i--) {
      const e = pending[i],
        j = e.job;
      if (
        t < (j.release ?? 0) ||
        !j.after.every((dep) => ends[dep] !== undefined && ends[dep] <= t)
      )
        continue;
      if (
        !e.team.every(
          (id, slot) =>
            !onCall(id) &&
            !atWork(id) &&
            queues[id][0] === e &&
            distance(positions[id], stance(j.from, e.team.length, slot, j.id)) <
              1e-6,
        )
      )
        continue;
      if (
        j.id === "rack" &&
        positions.some(
          (p, id) =>
            !e.team.includes(id) &&
            rackCorridor(rack, j.to).some((r) => inside(p, r)),
        )
      )
        continue;
      const live = { ...e, start: t, end: t + j.ticks };
      running.push(live);
      entries.push(live);
      pending.splice(i, 1);
      e.team.forEach((id) => queues[id].shift());
      lastProgress = t;
    }
    const hauling = running.find((e) => e.job.id === "rack");
    const nextRack = hauling
      ? lerp(
          hauling.from,
          hauling.to,
          (t + 1 - hauling.start) / (hauling.end - hauling.start),
        )
      : rack;
    const transfer = hauling ?? pending.find((e) => e.job.id === "rack");
    const lane = transfer ? rackCorridor(rack, transfer.to) : [];
    const next = positions.slice(),
      types = members.map(() => ({ kind: "idle", task: null }));
    for (const [id] of members.entries()) {
      const work = atWork(id);
      if (work) {
        types[id] = { kind: "work", task: work.job.id };
        if (work === hauling)
          next[id] = stance(nextRack, 2, work.team.indexOf(id), "rack");
      }
    }
    // Give a radio recipient first chance to physically vacate a handhold.
    const order = members
      .map((m) => m.id)
      .sort((a, b) => Number(onCall(b)) - Number(onCall(a)) || a - b);
    for (const id of order) {
      if (atWork(id)) continue;
      const m = members[id],
        from = positions[id],
        job = queues[id][0],
        away = onCall(id);
      const assigned = job && !away;
      let goal = assigned
        ? stance(
            job.job.from,
            job.team.length,
            job.team.indexOf(id),
            job.job.id,
          )
        : m.park;
      const blocked = [cartBox(rack, nextRack)];
      for (const other of members)
        if (other.id !== id)
          blocked.push(rect(positions[other.id], next[other.id], BODY_GAP));
      if (transfer && !transfer.team.includes(id)) {
        if (lane.some((r) => inside(goal, r))) goal = m.park;
        if (!lane.some((r) => inside(from, r))) blocked.push(...lane);
      }
      if (
        t - lastProgress > 36 &&
        blocked.some((r) => inside(goal, r)) &&
        distance(from, m.park) > 0.01
      )
        goal = m.park;
      next[id] = nextFootstep(from, goal, blocked, m.pace / HZ);
      types[id] = {
        kind: away
          ? "away"
          : distance(from, next[id]) > 1e-6
            ? "walk"
            : assigned
              ? "standby"
              : "idle",
        task: assigned ? job.job.id : null,
      };
    }
    for (const m of members) {
      const i = m.id;
      record(tracks[i], t, positions[i], next[i], types[i].task, types[i].kind);
    }
    positions = next;
    rack = nextRack;
  }
  throw Error(
    "No clear approach to " +
      pending.map((e) => e.job.id).join(", ") +
      " from " +
      JSON.stringify(positions),
  );
}
