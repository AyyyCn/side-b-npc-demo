import test from "node:test";
import assert from "node:assert/strict";
import {
  simulate,
  searchState,
  stations,
  canSee,
  crosses,
  origin,
  screenRect,
  route,
  searchOrder,
  PLACEMENT,
  START_SEARCH,
} from "./search.js";
test("the same filing event produces a different observation when the screen moves", () => {
  const blocked = simulate(true, "dispatch"),
    clear = simulate(false, "dispatch");
  assert.deepEqual(blocked.visible, [true, false, false]);
  assert.deepEqual(clear.visible, [true, true, true]);
  assert.equal(blocked.seen, false);
  assert.equal(clear.seen, true);
  assert.deepEqual(
    searchState(blocked, PLACEMENT - 1).weights,
    searchState(clear, PLACEMENT - 1).weights,
  );
  assert.deepEqual(searchState(clear, PLACEMENT).weights, [0, 0, 1]);
  assert.ok(searchState(blocked, PLACEMENT).weights[1] > 0.74);
  assert.deepEqual(
    blocked.visits.map((v) => v.i),
    [1, 2],
  );
  assert.deepEqual(
    clear.visits.map((v) => v.i),
    [2],
  );
  assert.deepEqual([blocked.end, clear.end], [121, 96]);
});
test("a hidden destination cannot leak into the policy before the first inspection", () => {
  const a = simulate(true, "catalog"),
    b = simulate(true, "dispatch"),
    first = a.visits[0].end;
  assert.deepEqual(a.decisions[0], b.decisions[0]);
  for (let t = 0; t < first; t += 0.5) {
    const A = searchState(a, t),
      B = searchState(b, t);
    assert.deepEqual(
      [A.pos, A.evidence, A.weights, A.decision],
      [B.pos, B.evidence, B.weights, B.decision],
    );
  }
  assert.ok(searchState(a, first).found);
  assert.deepEqual(searchState(b, first).weights, [0, 0, 1]);
});
test("search remains physically reachable and consistent for every shelf and screen configuration", () => {
  for (const closed of [false, true])
    for (const s of stations) {
      const r = simulate(closed, s.id);
      assert.deepEqual(r, simulate(closed, s.id));
      for (const m of r.moves) assert.ok(!crosses(m.from, m.to, r.screen, 0.4));
      for (const e of r.observations)
        assert.ok(Math.abs(e.weights.reduce((a, b) => a + b) - 1) < 1e-9);
      for (const visit of r.visits) {
        const state = searchState(r, visit.arrive);
        assert.deepEqual(state.pos, { x: stations[visit.i].x, z: -1.25 });
      }
      assert.equal(r.visits.at(-1).i, stations.indexOf(s));
      assert.ok(searchState(r, r.end).found);
    }
  const b = screenRect(true);
  assert.ok(!canSee(origin, { x: -3.25, z: 4.5 }, b));
  assert.ok(!canSee(origin, { x: 0, z: -20 }, b));
  const path = route(origin, { x: 3, z: -1.25 }, b);
  assert.ok(path.length > 2);
});
test("the policy trades probability against walking and inspection time", () => {
  const paths = (a, b) => [
    { x: a === -1 ? 0 : a === 0 ? 1 : 8, z: 0 },
    { x: b === 0 ? 1 : 8, z: 0 },
  ];
  assert.deepEqual(searchOrder([0.48, 0.52], -1, paths), [0, 1]);
  assert.deepEqual(searchOrder([0.03, 0.97], -1, paths), [1, 0]);
  assert.ok(START_SEARCH > PLACEMENT);
});
