import { crew, TICKS_PER_SECOND as HZ, points } from "./scenario.js";
import { stance as handle } from "./floor.js";
import { execute } from "./execution.js";
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const copy = (p) => ({ x: p.x, z: p.z });
const mix = (a, b, k) => ({
  x: a.x + (b.x - a.x) * k,
  z: a.z + (b.z - a.z) * k,
});
const travel = (from, to, pace) =>
  Math.ceil((Math.hypot(to.x - from.x, to.z - from.z) * HZ) / pace - 1e-9);
function teams(roles, members) {
  const all = [];
  function fill(team) {
    if (team.length === roles.length) {
      all.push(team);
      return;
    }
    for (const m of members)
      if (!team.includes(m.id) && m.skills.includes(roles[team.length]))
        fill([...team, m.id]);
  }
  fill([]);
  return all;
}
// Each resource has a next free tick and a physical position. Enumerate eligible job orders and teams.
// Earliest feasible starts cover every resource order in this non-preemptive model.
function solve(jobs, members, available, fixed, remaining, fixedTeams) {
  const possible = new Map(
    remaining.map((j) => [
      j.id,
      fixedTeams ? [fixedTeams.get(j.id)] : teams(j.roles, members),
    ]),
  );
  let best = null,
    bestEnd = Infinity;
  function visit(pending, cursors, finishes, entries) {
    if (!pending.length) {
      const end = Math.max(0, ...Object.values(finishes));
      if (end < bestEnd) {
        bestEnd = end;
        best = entries;
      }
      return;
    }
    const options = [];
    for (const j of pending) {
      if (!j.after.every((id) => finishes[id] !== undefined)) continue;
      for (const team of possible.get(j.id)) {
        const moves = team.map((i, slot) => {
          const c = cursors[i],
            destination = handle(j.from, team.length, slot, j.id);
          return {
            id: i,
            from: c.at,
            to: destination,
            depart: c.free,
            arrive: c.free + travel(c.at, destination, members[i].pace),
          };
        });
        const start = Math.max(
          j.release ?? 0,
          ...j.after.map((id) => finishes[id]),
          ...moves.map((m) => m.arrive),
        );
        const end = start + j.ticks;
        if (end < bestEnd)
          options.push({
            job: j,
            team,
            moves,
            start,
            end,
            from: j.from,
            to: j.to,
          });
      }
    }
    options.sort((a, b) => a.end - b.end);
    for (const option of options) {
      const { job, team, end } = option;
      if (end >= bestEnd) continue;
      const nextFinishes = { ...finishes, [job.id]: end };
      // Ignore travel and resource contention for the lower bound on the remaining dependency chain.
      const optimistic = { ...nextFinishes };
      for (const j of jobs)
        if (optimistic[j.id] === undefined)
          optimistic[j.id] =
            Math.max(j.release ?? 0, ...j.after.map((id) => optimistic[id])) +
            (pending.find((w) => w.id === j.id)?.ticks ?? j.ticks);
      if (Math.max(...Object.values(optimistic)) >= bestEnd) continue;
      const next = cursors.slice();
      team.forEach((m, slot) => {
        next[m] = { free: end, at: handle(job.to, team.length, slot, job.id) };
      });
      visit(
        pending.filter((j) => j.id !== job.id),
        next,
        nextFinishes,
        [...entries, option],
      );
    }
  }
  visit(remaining, available, fixed, []);
  if (!best) throw Error("No feasible team can complete the remaining jobs.");
  return best;
}
function segment(start, end, from, to, task, kind) {
  return { start, end, from, to, task, kind };
}
function tracksFor(entries, members) {
  const tracks = members.map(() => []);
  for (const e of entries)
    for (const [slot, m] of e.team.entries()) {
      const move = e.moves[slot],
        track = tracks[m];
      if (move.arrive > move.depart)
        track.push(
          segment(
            move.depart,
            move.arrive,
            move.from,
            move.to,
            e.job.id,
            "walk",
          ),
        );
      if (e.start > move.arrive)
        track.push(
          segment(move.arrive, e.start, move.to, move.to, e.job.id, "standby"),
        );
      track.push(
        segment(
          e.start,
          e.end,
          move.to,
          handle(e.to, e.team.length, slot, e.job.id),
          e.job.id,
          "work",
        ),
      );
    }
  return tracks.map((track) => track.sort((a, b) => a.start - b.start));
}
function assemble(jobs, members, entries, tracks) {
  return {
    jobs,
    members,
    entries: entries.slice().sort((a, b) => a.start - b.start),
    tracks,
    end: Math.max(...entries.map((e) => e.end)),
  };
}
export function initialPlan(jobs, members = crew) {
  const entries = solve(
    jobs,
    members,
    members.map((m) => ({ free: 0, at: m.home })),
    {},
    jobs,
  );
  if (members === crew) {
    const physical = execute(members, entries);
    return assemble(jobs, members, physical.entries, physical.tracks);
  }
  return assemble(jobs, members, entries, tracksFor(entries, members));
}
export function positionAt(part, t) {
  return mix(
    part.from,
    part.to,
    clamp((t - part.start) / (part.end - part.start || 1), 0, 1),
  );
}
export function memberState(plan, id, t) {
  let at = plan.members[id].home,
    last = null;
  for (const part of plan.tracks[id]) {
    if (t < part.start) break;
    if (t < part.end) return { ...positionAt(part, t), part, kind: part.kind };
    at = part.to;
    last = part;
  }
  return { ...at, kind: "idle", part: last };
}
export function rackAt(plan, t) {
  let at = points.dock;
  for (const e of plan.entries) {
    if (e.job.id !== "rack" || e.start > t) continue;
    if (t < e.end) return positionAt(e, t);
    at = e.to;
  }
  return copy(at);
}
export function jobAt(plan, id, t) {
  const slices = plan.entries.filter((e) => e.job.id === id),
    task = plan.jobs.find((j) => j.id === id);
  const worked = slices.reduce(
    (n, e) => n + clamp(t - e.start, 0, e.end - e.start),
    0,
  );
  const current = slices.find((e) => e.start <= t && t < e.end);
  return { worked, total: task.ticks, current, done: worked >= task.ticks };
}
export function recover(
  base,
  t,
  absent,
  awayTicks,
  { keepTeams = false } = {},
) {
  if (
    !Number.isInteger(t) ||
    t < 0 ||
    t >= base.end ||
    !base.members[absent] ||
    !Number.isInteger(awayTicks) ||
    awayTicks < 1
  )
    throw RangeError(
      "Choose an active show tick, a crew member and a positive absence.",
    );
  // A disruption is applied to the original timeline selected by the player.
  const { jobs, members } = base,
    fixed = {},
    prefix = [],
    remainders = new Map();
  const available = members.map((m, i) => ({
    free: t + (absent === i ? awayTicks : 0),
    at: copy(memberState(base, i, t)),
  }));
  for (const e of base.entries) {
    if (e.end <= t) {
      fixed[e.job.id] = e.end;
      prefix.push(e);
      continue;
    }
    if (e.start > t) continue;
    if (!e.team.includes(absent)) {
      fixed[e.job.id] = e.end;
      prefix.push(e);
      e.team.forEach((i, s) => {
        available[i] = {
          free: e.end,
          at: handle(e.to, e.team.length, s, e.job.id),
        };
      });
    } else {
      const at = positionAt(e, t);
      if (t > e.start) prefix.push({ ...e, end: t, to: at, interrupted: true });
      remainders.set(e.job.id, { ...e.job, from: at, ticks: e.end - t });
    }
  }
  const remaining = jobs
    .filter((j) => fixed[j.id] === undefined)
    .map((j) => remainders.get(j.id) ?? j);
  const originalTeams = keepTeams
    ? new Map(base.entries.map((e) => [e.job.id, e.team]))
    : null;
  const suffix = solve(
    jobs,
    members,
    available,
    fixed,
    remaining,
    originalTeams,
  );
  const incident = { t, absent, until: t + awayTicks };
  const onStage = members === crew;
  const active = prefix.filter((entry) => entry.end > t);
  const next = onStage
    ? execute(members, suffix, {
        start: t,
        initial: members.map((m) => copy(memberState(base, m.id, t))),
        rack: rackAt(base, t),
        finished: fixed,
        active,
        incident,
      })
    : { entries: suffix, tracks: tracksFor(suffix, members) };
  const tracks = base.tracks.map((track, id) => {
    const kept = [];
    for (const part of track) {
      if (part.start > t) break;
      const continues =
        !onStage &&
        part.kind === "work" &&
        active.some((e) => e.job.id === part.task && e.team.includes(id));
      if (part.end <= t || continues) kept.push(part);
      else if (part.start < t)
        kept.push({ ...part, end: t, to: positionAt(part, t) });
    }
    if (!onStage && id === absent) {
      const at = copy(memberState(base, id, t));
      kept.push(segment(t, incident.until, at, at, null, "away"));
    }
    return [...kept, ...next.tracks[id]];
  });
  const candidate = {
    ...assemble(jobs, members, [...prefix, ...next.entries], tracks),
    incident,
  };
  if (onStage && !keepTeams) {
    const fixedPlan = recover(base, t, absent, awayTicks, { keepTeams: true });
    if (fixedPlan.end < candidate.end) return fixedPlan;
  }
  return candidate;
}
export function checkpoint(plan) {
  const rack = plan.entries.find((e) => e.job.id === "rack");
  return rack.start + Math.floor((rack.end - rack.start) / 2);
}
