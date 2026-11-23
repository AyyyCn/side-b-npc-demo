import * as T from "three";
import { studio, box, rod, sign, spot, paint, glow } from "../npc/studio.js";
import { cart } from "./floor.js";
import { motionTrack } from "../npc/gait.js";
import { crew } from "./scenario.js";
import { memberState, rackAt, jobAt } from "./planner.js";

const profiles = {
  esme: { rig: "maya", height: 1.7, top: "#d9b979", yaw: 0 },
  wes: { rig: "sam", height: 1.8, top: "#637f88", yaw: 0 },
  nina: { rig: "harper", height: 1.67, top: "#a2849a", yaw: 0 },
  maya: { rig: "jordan", height: 1.76, top: "#7e9478", yaw: 0 },
};
export async function crewView(canvas) {
  const v = await studio(canvas, profiles, false),
    s = v.scene;
  const metal = paint("#b4bdc3", 0.33, 0.79),
    black = paint("#24272a"),
    edge = paint("#474d50", 0.48, 0.45),
    tape = paint("#c5a062"),
    velvet = paint("#612c35", 0.98),
    caseMat = paint("#263b40", 0.63, 0.3);
  const floor = paint("#393934", 0.89, 0.1);
  box(s, floor, 0, -0.12, 0, 17, 0.24, 11);
  const seam = paint("#262a27"),
    wax = paint("#4b4b40");
  for (let z = -3.3; z < 5.4; z += 0.66) {
    box(s, seam, 0, 0.003, z, 17, 0.005, 0.012);
    for (let x = -7 + (Math.round(z * 10) % 2) * 0.57; x < 8; x += 2.65) {
      box(s, seam, x, 0.004, z + 0.33, 0.01, 0.006, 0.66);
      box(s, wax, x + 0.029, 0.008, z + 0.038, 0.027, 0.004, 0.02);
    }
  }
  box(s, black, -7.05, 2.1, 0.2, 0.16, 4.25, 7.3);
  for (let z = -2.5; z < 3.8; z += 0.18)
    box(s, paint("#302d30"), -6.95, 1.96, z, 0.13, 3.96, 0.074);
  for (const x of [-5.48, 5.48])
    for (const z of [-2.7, -2.37]) {
      rod(s, metal, [x, 0.1, z], [x, 3.24, z], 0.05);
      for (let y = 0.12; y < 2.9; y += 0.41)
        rod(s, metal, [x, y, z], [x + 0.19, y + 0.28, z], 0.018);
    }
  box(s, black, 0, 2, -3.33, 14, 4.2, 0.25);
  // A pleated cyclorama and a braced lighting truss frame the working deck.
  const cloth = new T.PlaneGeometry(14, 4.1, 180, 3),
    p = cloth.attributes.position;
  for (let i = 0; i < p.count; i++)
    p.setZ(
      i,
      0.12 * Math.cos(p.getX(i) * 8.8) + 0.035 * Math.cos(p.getX(i) * 17.6),
    );
  cloth.computeVertexNormals();
  const drape = new T.Mesh(cloth, velvet);
  drape.position.set(0, 2.02, -3.02);
  drape.receiveShadow = true;
  s.add(drape);
  for (const z of [-2.7, -2.37])
    for (const y of [2.91, 3.24])
      rod(s, metal, [-6.2, y, z], [6.2, y, z], 0.036);
  for (let x = -6; x <= 6; x += 0.48) {
    rod(s, metal, [x, 2.91, -2.36], [x + 0.48, 3.24, -2.36], 0.019);
    rod(s, metal, [x, 3.24, -2.36], [x + 0.48, 2.91, -2.36], 0.019);
  }
  const lens = new T.CylinderGeometry(0.13, 0.16, 0.36, 16);
  for (let i = 0; i < 7; i++) {
    const x = -5.4 + i * 1.8;
    const lamp = new T.Mesh(lens, black);
    lamp.position.set(x, 2.79, -2.33);
    lamp.rotation.x = 0.58;
    s.add(lamp);
    rod(s, metal, [x, 3.04, -2.45], [x, 2.84, -2.34]);
    const face = new T.Mesh(
      new T.CircleGeometry(0.13, 24),
      glow(i % 2 ? "#eebd83" : "#8cbfc5"),
    );
    face.position.set(x, 2.63, -2.41);
    face.rotation.x = -1.06;
    s.add(face);
  }
  function roadCase(parent, x, z, w, h, d, front) {
    const root = new T.Group();
    parent.add(root);
    root.position.set(x, 0, z);
    box(root, caseMat, 0, h / 2 + 0.15, 0, w, h, d);
    for (const y of [0.16, 0.16 + h, 0.16 + h * 0.77]) {
      box(root, metal, 0, y, d / 2, w + 0.025, 0.028, 0.028);
      box(root, metal, 0, y, -d / 2, w + 0.025, 0.028, 0.028);
      for (const a of [-1, 1])
        box(root, metal, (a * w) / 2, y, 0, 0.028, 0.028, d);
    }
    for (const a of [-1, 1])
      for (const b of [-1, 1]) {
        box(
          root,
          metal,
          a * w * 0.5,
          0.16 + h * 0.5,
          b * d * 0.5,
          0.026,
          h,
          0.026,
        );
        for (const y of [0.19, 0.13 + h])
          box(
            root,
            metal,
            a * (w / 2 - 0.012),
            y,
            b * (d / 2 - 0.012),
            0.075,
            0.073,
            0.075,
          );
        const wheel = new T.Mesh(
          new T.CylinderGeometry(0.081, 0.081, 0.056, 12),
          black,
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(a * (w / 2 - 0.11), 0.073, b * (d / 2 - 0.1));
        root.add(wheel);
      }
    for (const a of [-1, 1]) {
      box(
        root,
        black,
        a * w * 0.29,
        0.16 + h * 0.6,
        d * 0.5 + 0.015,
        0.12,
        0.13,
        0.022,
      );
      box(
        root,
        metal,
        a * w * 0.29,
        0.16 + h * 0.61,
        d * 0.5 + 0.029,
        0.07,
        0.044,
        0.012,
      );
    }
    if (front)
      sign(
        root,
        front,
        0,
        0.16 + h * 0.42,
        d / 2 + 0.021,
        w * 0.66,
        h * 0.22,
        "#f0dfb7",
        "#344448",
      );
    return root;
  }
  const rack = roadCase(
    s,
    0,
    0,
    cart.halfX * 2,
    0.9,
    cart.halfZ * 2,
    "PA  /  04",
  );
  for (const side of [-1, 1]) {
    const z = side * (cart.halfZ - 0.055);
    rod(rack, metal, [-cart.halfX, 0.92, z], [cart.barX, cart.barY, z], 0.027);
  }
  rod(
    rack,
    metal,
    [cart.barX, cart.barY, -0.61],
    [cart.barX, cart.barY, 0.61],
    0.029,
  );
  box(rack, black, 0.045, 0.76, -cart.halfZ, 0.45, 0.23, 0.035);
  for (const x of [-0.08, 0.04, 0.16])
    box(rack, metal, x, 0.8, -cart.halfZ - 0.023, 0.063, 0.072, 0.029);
  roadCase(s, 0.05, -1.96, 1.24, 0.82, 0.5, "SHOW CONTROL");
  roadCase(s, -4.7, -2.15, 1.06, 0.82, 0.58, "PATCH");
  roadCase(s, -3.47, -2.23, 1.1, 0.68, 0.66);
  roadCase(s, 4.47, -2.28, 1.1, 0.64, 0.58);
  roadCase(s, 5.45, -2.2, 0.72, 1.45, 0.8, "PA");
  for (const x of [-2.1, 2.12]) {
    const table = roadCase(
      s,
      x,
      -2.15,
      1.1,
      0.81,
      0.71,
      x < 0 ? "POWER" : "LX",
    );
    for (let i = 0; i < 9; i++)
      box(
        table,
        i % 3 === 0 ? glow("#97c4a1") : black,
        -0.39 + i * 0.096,
        1.0,
        0.02,
        0.034,
        0.025,
        0.17,
      );
  }
  const panel = sign(
    s,
    "SIDE B    /    STAGE LEFT",
    -0.58,
    2.06,
    -2.83,
    3.35,
    0.39,
    "#ede2c9",
    "#352d32",
  );
  panel.rotation.x = -0.018;
  for (const side of [-1, 1])
    for (let x = -4.45; x < 2.26; x += 0.52)
      box(s, tape, x, 0.008, 0.74 + side * 0.83, 0.26, 0.008, 0.028);
  for (const x of [1.24, 2.55])
    for (const z of [0.17, 1.31]) {
      box(s, tape, x, 0.012, z, 0.21, 0.011, 0.033);
      box(s, tape, x, 0.012, z, 0.033, 0.011, 0.21);
    }
  spot(s, 0xe1ac7c, 90, [-3, 3.6, 0.2], [-1, 0.4, 0]);
  spot(s, 0x91c5df, 88, [3.4, 3.4, -0.9], [1.5, 0.6, 0.7]);
  spot(s, 0xde8480, 62, [-2.5, 0.5, -2.4], [-0.9, 2, -3.0]);
  const readyLight = box(
    s,
    glow("#557c60"),
    1.76,
    0.89,
    -1.8,
    0.19,
    0.06,
    0.025,
  );
  let cachedPlan, gait;
  const activity = (plan, i, t) => {
    const p = memberState(plan, i, t),
      push = p.kind === "work" && p.part.task === "rack";
    const job = p.part?.task;
    let facing;
    if (push || (job === "rack" && p.kind === "standby")) facing = Math.PI / 2;
    else if (p.kind === "work" || p.kind === "standby")
      facing = job === "sound" ? 0 : Math.PI;
    return { ...p, pushing: push, facing };
  };
  function contact(plan, id, t, test) {
    return [0, 0.65, 1.3, 1.95].reduce(
      (weight, lag) =>
        weight + (test(memberState(plan, id, Math.max(0, t - lag))) ? 0.25 : 0),
      0,
    );
  }
  return (plan, tick) => {
    if (plan !== cachedPlan) {
      cachedPlan = plan;
      const end = Math.max(
        plan.end,
        ...plan.tracks.map((tr) => tr.at(-1)?.end ?? 0),
      );
      gait = crew.map((m) =>
        motionTrack(end, (t) => activity(plan, m.id, t), Math.PI / 2),
      );
    }
    const r = rackAt(plan, tick);
    rack.position.set(r.x, 0, r.z);
    for (const m of crew) {
      const p = activity(plan, m.id, tick),
        motion = gait[m.id](tick),
        hands = [];
      const grip = contact(
        plan,
        m.id,
        tick,
        (a) => a.kind === "work" && a.part.task === "rack",
      );
      const radio = contact(plan, m.id, tick, (a) => a.kind === "away");
      if (grip) {
        const lane = p.z < r.z ? -cart.stanceZ : cart.stanceZ;
        hands.push(
          ["l", r.x + cart.barX, cart.barY, r.z + lane - 0.15, grip],
          ["r", r.x + cart.barX, cart.barY, r.z + lane + 0.15, grip],
        );
      }
      if (radio) {
        const yaw = motion.yaw;
        hands.push([
          "r",
          p.x - 0.15 * Math.cos(yaw) + 0.075 * Math.sin(yaw),
          profiles[m.person.key].height * 0.88,
          p.z + 0.15 * Math.sin(yaw) + 0.075 * Math.cos(yaw),
          radio,
        ]);
      } else if (p.kind === "work" && p.part.task !== "rack") {
        const sign = p.part.task === "sound" ? 1 : -1;
        const weight = contact(
          plan,
          m.id,
          tick,
          (a) => a.kind === "work" && a.part.task === p.part.task,
        );
        hands.push([
          "r",
          p.x - sign * 0.14,
          0.95 + 0.018 * Math.sin(tick * 0.25),
          p.z + sign * 0.43,
          weight * 0.9,
        ]);
      }
      v.pose(m.person.key, p, motion, tick, hands);
    }
    readyLight.material.color.set(
      jobAt(plan, "lights", tick).done ? "#a5ffb5" : "#665741",
    );
    v.render([2.85, 3.05, 7.65], [-0.58, 1.02, -0.29], 36.3);
    return v.project(r.x, 1.13, r.z);
  };
}
