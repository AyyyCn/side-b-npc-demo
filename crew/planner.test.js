import test from "node:test";
import assert from "node:assert/strict";
import {
  initialPlan,
  recover,
  memberState,
  rackAt,
  checkpoint,
  jobAt,
} from "./planner.js";
import { makeJobs, crew, readForecast, DOORS } from "./scenario.js";
const near = (a, b) => Math.hypot(a.x - b.x, a.z - b.z) < 1e-7;
function valid(plan) {
  for (const job of plan.jobs) {
    const entries = plan.entries.filter((e) => e.job.id === job.id);
    assert.equal(
      entries.reduce((s, e) => s + e.end - e.start, 0),
      job.ticks,
    );
    for (const entry of entries) {
      for (const dep of job.after)
        assert.ok(
          Math.max(
            ...plan.entries.filter((e) => e.job.id === dep).map((e) => e.end),
          ) <= entry.start,
        );
      assert.equal(new Set(entry.team).size, job.roles.length);
      entry.team.forEach((id, slot) =>
        assert.ok(crew[id].skills.includes(job.roles[slot])),
      );
    }
  }
  for (const [i, track] of plan.tracks.entries()) {
    let pos = crew[i].home,
      end = 0;
    for (const part of track) {
      assert.ok(part.start >= end);
      assert.ok(
        near(part.from, pos),
        "Track must have no teleport for " + crew[i].name,
      );
      if (part.kind === "walk")
        assert.ok(
          Math.hypot(part.to.x - pos.x, part.to.z - pos.z) <=
            (crew[i].pace * (part.end - part.start)) / 10 + 0.0001,
        );
      pos = part.to;
      end = part.end;
    }
  }
}
test("every assigned job has the required skills, predecessor, work and travel time", () => {
  for (const n of [15, 40]) {
    const p = initialPlan(makeJobs(n));
    valid(p);
    assert.deepEqual(initialPlan(makeJobs(n)), p);
  }
});
test("interruption preserves positions, accomplished work and unrelated tasks at a live checkpoint", () => {
  const p = initialPlan(makeJobs(40)),
    t = checkpoint(p),
    repaired = recover(p, t, 1, 120);
  valid(repaired);
  assert.equal(jobAt(repaired, "rack", t).worked, 35);
  for (let i = 0; i <= t; i += 0.5) {
    assert.ok(near(rackAt(p, i), rackAt(repaired, i)));
    crew.forEach((m) =>
      assert.ok(near(memberState(p, m.id, i), memberState(repaired, m.id, i))),
    );
  }
  const transfers = repaired.entries.filter((e) => e.job.id === "rack");
  assert.deepEqual(
    transfers.map((e) => e.team),
    [
      [1, 0],
      [2, 0],
    ],
  );
  assert.equal(transfers[1].start, 69);
  assert.ok(near(rackAt(repaired, 68), rackAt(repaired, t)));
  assert.equal(memberState(repaired, 1, 158).kind, "away");
  assert.deepEqual(
    repaired.entries.find((e) => e.job.id === "feed"),
    p.entries.find((e) => e.job.id === "feed"),
  );
  assert.equal(repaired.end, 253);
  assert.equal(recover(p, t, 1, 120, { keepTeams: true }).end, 368);
  assert.ok(repaired.end < DOORS);
});
test("reassignment can always match or improve the fixed-team comparison for this work order", () => {
  for (const n of [15, 40]) {
    const p = initialPlan(makeJobs(n));
    for (const t of [0, checkpoint(p), 58, 105, p.end - 1])
      for (const m of crew) {
        const adaptive = recover(p, t, m.id, 120),
          fixed = recover(p, t, m.id, 120, { keepTeams: true });
        assert.ok(adaptive.end <= fixed.end);
        valid(adaptive);
        valid(fixed);
        assert.ok(
          adaptive.tracks[m.id].every(
            (s) => s.kind !== "work" || s.end <= t || s.start >= t + 120,
          ),
        );
      }
  }
});
test("East Hall demand comes from the selected social simulation", () => {
  const f = readForecast(new URLSearchParams("seed=133&hold=9"));
  assert.deepEqual([f.original, f.altered], [37, 10]);
  assert.ok(makeJobs(f.original).some((j) => j.id === "zone"));
  assert.ok(!makeJobs(f.altered).some((j) => j.id === "zone"));
  const f2 = readForecast(new URLSearchParams("seed=722&hold=16"));
  assert.deepEqual([f2.original, f2.altered], [33, 34]);
});
test("the solver chooses the earliest finishing team across a small independently enumerated schedule", () => {
  const point = { x: 0, z: 0 },
    members = [
      { id: 0, home: point, pace: 1, skills: ["A", "B"] },
      { id: 1, home: point, pace: 1, skills: ["B"] },
    ];
  const jobs = [
    { id: "a", ticks: 4, roles: ["A"] },
    { id: "b", ticks: 9, roles: ["B"] },
    { id: "c", ticks: 6, roles: ["B"] },
  ].map((j) => ({ ...j, name: j.id, after: [], from: point, to: point }));
  const possible = [];
  for (const b of [0, 1])
    for (const c of [0, 1]) {
      const time = [4, 0];
      time[b] += 9;
      time[c] += 6;
      possible.push(Math.max(...time));
    }
  assert.equal(initialPlan(jobs, members).end, Math.min(...possible));
  assert.equal(initialPlan(jobs, members).end, 10);
});

test("Ida's observed retrieval time releases the audio check in the crew plan", async () => {
  const { simulate } = await import("../perception/search.js");
  for (const [closed, expected] of [
    [true, 252],
    [false, 227],
  ]) {
    const record = simulate(closed, "dispatch"),
      plan = initialPlan(makeJobs(40, record.end));
    assert.equal(
      plan.entries.find((e) => e.job.id === "sound").start,
      record.end,
    );
    assert.equal(plan.end, expected);
    const fixed = recover(plan, checkpoint(plan), 1, 120, { keepTeams: true });
    assert.ok(
      fixed.entries.find((e) => e.job.id === "sound").start >= record.end,
    );
  }
});
