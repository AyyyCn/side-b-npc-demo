import test from "node:test";
import assert from "node:assert/strict";
import { motionTrack } from "./gait.js";
import { createRoom } from "../room.js";
import {
  initialPlan,
  recover,
  memberState,
  rackAt,
  checkpoint,
} from "../crew/planner.js";
import { makeJobs, crew } from "../crew/scenario.js";
import { cart, BODY_GAP, CART_GAP, cuts, stance } from "../crew/floor.js";
import {
  prepare,
  branch,
  readGuest,
  DEFAULT_SEED,
  DEFAULT_HOLD,
  COUNT,
  STRIDE,
  END,
  PERSONAL_SPACE,
  WALL,
  DOOR,
} from "../comparison/simulation.js";

// Minimize relative separation along the entire linearly interpolated visual frame.
function checkSpacing(before, after, gap) {
  for (let i = 0; i < before.length; i++) {
    for (let j = i + 1; j < before.length; j++) {
      const x = before[i].x - before[j].x,
        z = before[i].z - before[j].z;
      const dx = after[i].x - after[j].x - x,
        dz = after[i].z - after[j].z - z;
      const speed = dx * dx + dz * dz;
      const t = speed
        ? Math.max(0, Math.min(1, -(x * dx + z * dz) / speed))
        : 0;
      assert.ok(
        (x + t * dx) ** 2 + (z + t * dz) ** 2 >= (gap - 0.00001) ** 2,
        "Two bodies cross inside a rendered frame",
      );
    }
  }
}
const relative = (p, r) => ({ x: p.x - r.x, z: p.z - r.z });
function checkStage(plan) {
  const x = cart.halfX + CART_GAP - 0.00001,
    z = cart.halfZ + CART_GAP - 0.00001;
  const box = { left: -x, right: x, back: -z, front: z };
  let last = crew.map((m) => memberState(plan, m.id, 0)),
    rack = rackAt(plan, 0);
  const end = Math.max(plan.end, plan.incident?.until ?? 0);
  for (let t = 1; t <= end; t++) {
    const next = crew.map((m) => memberState(plan, m.id, t)),
      nextRack = rackAt(plan, t);
    checkSpacing(last, next, BODY_GAP);
    for (const m of crew) {
      assert.equal(
        cuts(relative(last[m.id], rack), relative(next[m.id], nextRack), box),
        false,
        "A crew member crosses the moving rack footprint",
      );
    }
    last = next;
    rack = nextRack;
  }
}

test("both work orders keep physical clearance through interrupted work, walking and returning from the radio", () => {
  for (const attendance of [10, 37]) {
    const base = initialPlan(makeJobs(attendance));
    checkStage(base);
    for (const t of [0, checkpoint(base), 78, base.end - 1])
      for (const m of crew)
        for (const duration of [60, 120, 200])
          for (const keepTeams of [false, true])
            checkStage(recover(base, t, m.id, duration, { keepTeams }));
  }
});
test("a relieved handler vacates the grip before the incoming handler takes it", () => {
  const base = initialPlan(makeJobs(37)),
    t = checkpoint(base);
  const plan = recover(base, t, 1, 120),
    rack = rackAt(plan, t);
  const handoff = plan.entries.find((e) => e.job.id === "rack" && e.start >= t);
  const grip = stance(rack, 2, handoff.team.indexOf(2), "rack");
  const atGrip = (id, tick) => {
    const p = memberState(plan, id, tick);
    return Math.hypot(p.x - grip.x, p.z - grip.z);
  };
  assert.ok(atGrip(1, t) < 0.00001);
  let cleared = null;
  for (let tick = t; tick <= handoff.start; tick += 0.25) {
    if (cleared === null && atGrip(1, tick) >= BODY_GAP) cleared = tick;
    if (cleared === null) assert.ok(atGrip(2, tick) > 0.01);
    assert.deepEqual(rackAt(plan, tick), rack);
  }
  assert.ok(cleared > t && cleared < handoff.start);
  assert.ok(
    atGrip(1, handoff.start) >= BODY_GAP && atGrip(2, handoff.start) < 0.00001,
  );
});
test("crowd bodies clear every other trajectory and door jamb while stride follows distance", () => {
  const radius = PERSONAL_SPACE / 2 + 0.12;
  for (const seed of [DEFAULT_SEED, 722, 746]) {
    const session = prepare(seed);
    for (const trace of [
      session.original,
      branch(session, DEFAULT_HOLD),
      branch(session, 16),
    ]) {
      const frame = (t) =>
        Array.from({ length: COUNT }, (_, id) => readGuest(trace, t, id));
      let last = frame(0);
      for (let t = 1; t <= END; t++) {
        const next = frame(t);
        checkSpacing(last, next, PERSONAL_SPACE);
        for (let id = 0; id < COUNT; id++) {
          const a = last[id],
            b = next[id],
            offset = (t * COUNT + id) * STRIDE + 5;
          const strideDelta =
            trace.frames[offset] - trace.frames[offset - COUNT * STRIDE];
          assert.ok(
            Math.abs(strideDelta - Math.hypot(a.x - b.x, a.z - b.z)) < 0.00001,
          );
          for (const wall of [-WALL, WALL]) {
            if (
              Math.min(a.x, b.x) <= wall + radius &&
              Math.max(a.x, b.x) >= wall - radius
            )
              assert.ok(
                Math.max(Math.abs(a.z), Math.abs(b.z)) <=
                  DOOR - radius + 0.00001,
              );
          }
        }
        last = next;
      }
    }
  }
});
test("gait advances with displacement, settles at rest, and is identical when scrubbing backwards", () => {
  const position = (t) => ({ x: Math.min(1, t / 10), z: 0, facing: 0 });
  const sample = motionTrack(16, position, 0),
    mid = sample(7.25);
  assert.ok(Math.abs(mid.travel - 0.725) < 1e-8);
  assert.equal(sample(16).travel, 1);
  assert.equal(sample(16).weight, 0);
  assert.ok(Math.abs(sample(1).yaw - sample(0).yaw) <= 0.62);
  assert.deepEqual(sample(7.25), mid);
  const pushing = motionTrack(
    16,
    (t) => ({ ...position(t), pushing: true }),
    0,
  );
  assert.ok(
    pushing(7).travel > sample(7).travel &&
      pushing(7).weight < sample(7).weight,
  );
});
test("the chair exit and both invitation routes preserve personal space and finish the show", () => {
  for (const guest of ["silas", "nell"]) {
    let state;
    const room = createRoom((s) => {
      state = s;
    });
    room.act("whisper", { person: guest });
    for (let i = 0; i < 16 / room.interval; i++) {
      const last = state.people;
      room.step();
      checkSpacing(last, state.people, 0.65);
      const silas = state.people.find((p) => p.id === "silas");
      if (guest === "silas" && state.time < 1.65) assert.equal(silas.walked, 0);
    }
    assert.equal(state.phase, "concert");
    assert.deepEqual(
      state.people.filter((p) => p.arrived).map((p) => p.id),
      guest === "silas" ? ["silas"] : ["kit", "finn", "ida"],
    );
  }
});
