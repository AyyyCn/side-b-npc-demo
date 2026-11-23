import test from "node:test";
import assert from "node:assert/strict";
import {
  prepare,
  branch,
  history,
  readGuest,
  lineOfSight,
  hall,
  COUNT,
  END,
  FORK,
  HOLD,
  CHANGE,
  HEARING,
  STRIDE,
  DEFAULT_SEED,
} from "./simulation.js";

test("branching without an intervention reproduces every frame and every receipt", () => {
  const s = prepare(DEFAULT_SEED),
    copy = branch(s, -1);
  assert.deepEqual(copy.frames, s.original.frames);
  assert.deepEqual(copy.receipts, s.original.receipts);
  assert.deepEqual(copy.changed, []);
});

test("every intervention shares its prefix and leaves the checkpoint and original immutable", () => {
  const s = prepare(DEFAULT_SEED),
    checkpoint = structuredClone(s.checkpoint),
    original = structuredClone(s.original);
  const prefix = (FORK + 1) * COUNT * STRIDE;
  for (let id = 0; id < COUNT; id++) {
    const lite = branch(s, id, false),
      full = branch(s, id);
    assert.deepEqual(lite.changed, full.changed);
    assert.equal(lite.east, full.east);
    assert.deepEqual(
      full.frames.subarray(0, prefix),
      original.frames.subarray(0, prefix),
    );
    const start = readGuest(full, FORK, id);
    for (let tick = FORK + 1; tick <= FORK + HOLD; tick++) {
      const g = readGuest(full, tick, id);
      assert.equal(g.x, start.x);
      assert.equal(g.z, start.z);
      assert.equal(g.speed, 0);
    }
    const changes = s.finalHalls.flatMap((zone, g) =>
      zone * hall(readGuest(full, END, g).x) === -1 ? [g] : [],
    );
    assert.deepEqual(full.changed, changes);
  }
  assert.deepEqual(s.checkpoint, checkpoint);
  assert.deepEqual(s.original, original);
});

test("a fact has a traceable physical exchange and no receipt can travel through a partition", () => {
  assert.equal(lineOfSight({ x: 4.4, z: 2 }, { x: 5.0, z: 2 }), false);
  assert.equal(lineOfSight({ x: 4.4, z: 0 }, { x: 5, z: 0 }), true);
  for (const seed of [DEFAULT_SEED, 722, 17421]) {
    const s = prepare(seed),
      alt = branch(s, 2);
    for (const trace of [s.original, alt]) {
      for (const [i, e] of trace.receipts.entries()) {
        if (e.from === -1) {
          assert.equal(e.tick, 0);
          assert.equal(e.version, 1);
          continue;
        }
        if (e.from === -2) {
          assert.equal(e.tick, CHANGE);
          assert.equal(e.to, s.checkpoint.manager);
          continue;
        }
        const parent = trace.receipts[e.parent];
        assert.ok(e.parent < i && parent.tick < e.tick);
        assert.equal(parent.version, e.version);
        assert.equal(parent.to, e.from);
        const a = { x: e.fromX, z: e.fromZ },
          b = { x: e.x, z: e.z };
        assert.ok(Math.hypot(a.x - b.x, a.z - b.z) <= HEARING);
        assert.ok(lineOfSight(a, b));
        const before = readGuest(trace, e.tick - 1, e.to);
        assert.equal(trace.receipts[before.memory].version, 1);
        assert.equal(readGuest(trace, e.tick, e.to).memory, i);
      }
      for (let id = 0; id < COUNT; id++) {
        let last = readGuest(trace, 0, id);
        for (let t = 1; t <= END; t++) {
          const next = readGuest(trace, t, id);
          assert.ok(lineOfSight(last, next));
          last = next;
        }
        assert.equal(history(trace.receipts, last.memory).at(-1).to, id);
      }
    }
  }
});

test("the displayed example is computed, and other crowds can gain arrivals when someone is delayed", () => {
  const s = prepare(DEFAULT_SEED),
    alternatives = Array.from({ length: COUNT }, (_, id) =>
      branch(s, id, false),
    );
  const best = alternatives.toSorted(
      (a, b) => b.changed.length - a.changed.length,
    )[0],
    alt = branch(s, best.hold);
  assert.equal(s.checkpoint.guests[best.hold].name, "Ada");
  assert.equal(s.finalHalls.filter((x) => x === 1).length, 37);
  assert.equal(alt.east, 10);
  assert.equal(alt.changed.length, 27);
  const witness = s.checkpoint.guests.find((g) => g.name === "Ida").id;
  const before =
    s.original.receipts[readGuest(s.original, END, witness).memory];
  assert.equal(before.from, best.hold);
  assert.equal(before.tick, 84);
  assert.equal(alt.receipts[readGuest(alt, END, witness).memory].from, -1);
  const second = prepare(722),
    other = branch(
      second,
      second.checkpoint.guests.find((g) => g.name === "Inez").id,
      false,
    );
  assert.ok(other.east > second.finalHalls.filter((x) => x === 1).length);
  assert.ok(alternatives.some((r) => r.changed.length === 0));
});
