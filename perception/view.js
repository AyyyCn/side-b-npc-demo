import * as T from "three";
import { motionTrack } from "../npc/gait.js";
import { searchState } from "./search.js";
import { studio, box, sign, rod, paint, glow, spot } from "../npc/studio.js";
import { sleeveMaterial } from "../record-art.js";
import {
  observer,
  stations,
  origin,
  PLACEMENT,
  START_SEARCH,
} from "./search.js";

export async function archiveView(canvas) {
  const v = await studio(
      canvas,
      {
        [observer.key]: { rig: "harper", height: 1.62, top: "#6f867b", yaw: 0 },
      },
      true,
    ),
    s = v.scene;
  const wood = v.materials.wood,
    floor = v.materials.stone.clone(),
    wall = v.materials.plaster.clone();
  floor.color.set("#aba99e");
  floor.roughness = 0.9;
  floor.normalScale.set(0.16, 0.16);
  wall.color.set("#e7dabd");
  const walnut = paint("#5b4632"),
    brass = paint("#bea479", 0.38, 0.66),
    card = paint("#dbceb0"),
    shade = paint("#325349"),
    iron = paint("#46473d", 0.48, 0.42);
  box(s, floor, 0, -0.1, 0, 14, 0.2, 11);
  box(s, wall, -5.45, 2.1, 0, 0.19, 4.3, 8.7);
  box(s, wood, -5.32, 0.13, 0, 0.1, 0.25, 8.7);
  const windowFrame = paint("#697a70"),
    glass = glow("#b7c4b8");
  for (let i = 0; i < 4; i++) {
    const z = -2.22 + i * 0.85;
    box(s, windowFrame, -5.32, 2.15, z, 0.08, 1.74, 0.82);
    box(s, glass, -5.26, 2.15, z, 0.032, 1.6, 0.73);
    box(s, windowFrame, -5.23, 2.13, z, 0.027, 0.055, 0.74);
  }
  box(s, wood, -5.24, 1.22, -0.96, 0.35, 0.11, 3.7);
  const stroke = paint("#77786b");
  for (let x = -5; x < 6; x += 1.45)
    box(s, stroke, x, 0.002, 0, 0.012, 0.003, 11);
  for (let z = -4; z < 5; z += 1.45)
    box(s, stroke, 0, 0.002, z, 14, 0.003, 0.012);
  box(s, wall, 0, 1.92, -3.22, 12, 3.9, 0.24);
  box(s, wood, 0, 0.13, -3.03, 12, 0.25, 0.13);
  // Jackets on the open shelves share geometry and a single draw call.
  const spines = [];
  const colors = [
    "#625d4d",
    "#c4bca4",
    "#a77c62",
    "#46616a",
    "#cab792",
    "#746b72",
    "#747854",
    "#b2957d",
    "#333e40",
    "#be8a6f",
  ];
  for (const [j, station] of stations.entries()) {
    const x = station.x;
    for (const h of [1.41, 1.94, 2.47])
      box(s, wood, x, h, -2.83, 2.54, 0.077, 0.5);
    for (const dx of [-1.23, 0, 1.23])
      box(s, wood, x + dx, 1.92, -2.83, 0.057, 1.15, 0.5);
    for (let row = 0; row < 2; row++)
      for (let i = 0; i < 45; i++) {
        if (i % 14 === 9 || i === 22) continue;
        const h = 0.28 + ((i * 7 + j * 9) % 11) * 0.012;
        spines.push({
          x: x - 1.17 + i * 0.0525,
          y: 1.45 + row * 0.53 + h / 2,
          z: -2.68 + (i % 5) * 0.007,
          h,
          c: colors[(i * 13 + j * 7 + row * 3) % colors.length],
          tilt: i % 11 === 0 ? -0.065 : 0,
        });
      }
    box(s, wood, x, 0.52, -2.2, 1.5, 1.02, 0.75);
    box(s, brass, x, 0.94, -1.818, 1.53, 0.054, 0.048);
    box(s, card, x, 0.65, -1.814, 1.35, 0.4, 0.021);
    for (const dx of [-0.7, 0.7])
      box(s, walnut, x + dx, 1.14, -2.18, 0.085, 0.35, 0.73);
    box(s, walnut, x, 1.14, -2.52, 1.46, 0.35, 0.08);
    box(s, walnut, x, 1.1, -1.85, 1.44, 0.27, 0.065);
    sign(
      s,
      station.name.toUpperCase(),
      x,
      0.65,
      -1.788,
      1.05,
      0.22,
      "#3c4036",
      "#ded0b3",
    );
    for (let k = 0; k < 7; k++)
      box(
        s,
        k % 3 === 0 ? shade : card,
        x,
        1.15,
        -2.4 + k * 0.071,
        1.27,
        0.2 + (k % 3) * 0.035,
        0.043,
      );
  }
  const spineMat = paint("#ffffff"),
    books = new T.InstancedMesh(
      new T.BoxGeometry(1, 1, 1),
      spineMat,
      spines.length,
    ),
    transform = new T.Object3D();
  spines.forEach((b, i) => {
    transform.position.set(b.x, b.y, b.z);
    transform.scale.set(0.039, b.h, 0.29);
    transform.rotation.z = b.tilt;
    transform.updateMatrix();
    books.setMatrixAt(i, transform.matrix);
    books.setColorAt(i, new T.Color(b.c));
  });
  books.castShadow = books.receiveShadow = true;
  s.add(books);
  sign(
    s,
    "SIDE B     /     RECORD ARCHIVE",
    0,
    2.95,
    -3.076,
    4.3,
    0.35,
    "#344e44",
    "#ddd2b7",
  );
  for (const x of [-4.65, 4.68]) {
    box(s, walnut, x, 1.9, -3.04, 0.1, 3.75, 0.12);
    box(s, brass, x, 2.9, -2.93, 0.25, 0.09, 0.14);
  }
  for (const x of [-3, 0, 3]) {
    rod(s, iron, [x, 3.2, -2.8], [x, 3.2, -2.3], 0.028);
    const lamp = new T.Mesh(new T.ConeGeometry(0.23, 0.21, 22), shade);
    lamp.position.set(x, 3.12, -2.26);
    s.add(lamp);
    box(s, glow("#fff1cd"), x, 3.005, -2.26, 0.31, 0.015, 0.29);
    spot(s, 0xffdaa1, 30, [x, 2.96, -2.24], [x, 1, -2]);
  }
  const screen = new T.Group();
  s.add(screen);
  const panels = [];
  for (let i = 0; i < 3; i++) {
    const group = new T.Group();
    screen.add(group);
    panels.push(group);
    box(group, brass, 0, 1.01, 0, 1.055, 1.54, 0.08);
    box(group, shade, 0, 1.01, 0.052, 1.01, 1.49, 0.052);
    for (let k = 0; k < 12; k++)
      box(
        group,
        paint(k % 2 ? "#60746a" : "#6b7d70"),
        -0.455 + k * 0.083,
        1.02,
        0.084,
        0.031,
        1.41,
        0.035,
      );
    for (const h of [0.3, 1.71])
      box(group, walnut, 0, h, 0.098, 1.02, 0.042, 0.039);
    for (const a of [-1, 1]) {
      box(group, iron, a * 0.42, 0.14, 0, 0.04, 0.24, 0.064);
      box(group, iron, a * 0.42, 0.052, 0, 0.063, 0.065, 0.186);
    }
  }
  const record = new T.Mesh(
    new T.BoxGeometry(0.49, 0.49, 0.035),
    sleeveMaterial(),
  );
  s.add(record);
  record.rotation.x = -0.12;
  // These floor-level rays show precisely the visible bin lines at the filing instant.
  const rays = stations.map(() => {
    const geometry = new T.BufferGeometry().setFromPoints([
      new T.Vector3(),
      new T.Vector3(),
    ]);
    const line = new T.Line(
      geometry,
      new T.LineDashedMaterial({
        color: "#7db49c",
        dashSize: 0.14,
        gapSize: 0.09,
        transparent: true,
        opacity: 0.85,
      }),
    );
    s.add(line);
    return line;
  });
  const lamps = stations.map((st) =>
    box(s, glow("#decba5"), st.x, 1.1, -1.805, 0.25, 0.055, 0.012),
  );
  const wrist = new T.Vector3();
  let previousRun, gait;
  return (run, tick, state) => {
    if (previousRun !== run) {
      previousRun = run;
      gait = motionTrack(
        run.end,
        (t) => {
          const s = searchState(run, t);
          return { ...s.pos, facing: s.yaw };
        },
        Math.atan2(2.6, -4.25),
      );
    }
    const a = (run.screen.left + run.screen.right) / 2,
      w = run.screen.right - run.screen.left;
    screen.position.set(a, 0, (run.screen.front + run.screen.back) / 2);
    panels.forEach((panel, i) => {
      panel.position.x = run.closed ? ((i - 1) * w) / 3 : (i - 1) * 0.035;
      panel.position.z = run.closed ? 0 : (i - 1) * 0.058;
    });
    const target = stations.find((st) => st.id === run.destination),
      filePhase = Math.max(0, Math.min(1, (tick - PLACEMENT) / 8));
    record.visible =
      (tick >= PLACEMENT - 6 && tick < PLACEMENT + 8) || state.found;
    record.position.set(
      target.x,
      state.found ? 1.5 : 1.6 - filePhase * 0.42,
      -2.055,
    );
    lamps.forEach((m, i) =>
      m.material.color.set(
        state.inspected.some((ins) => ins.i === i && ins.found)
          ? "#a7d796"
          : state.visit?.i === i
            ? "#e6a05b"
            : "#beb494",
      ),
    );
    rays.forEach((ray, i) => {
      ray.visible = tick >= PLACEMENT && tick < START_SEARCH + 2;
      if (!ray.visible) return;
      const to = stations[i],
        zScreen = run.screen.front,
        frac = run.visible[i] ? 1 : (zScreen - origin.z) / (to.z - origin.z);
      const p = ray.geometry.attributes.position;
      p.setXYZ(0, origin.x, 0.044, origin.z);
      p.setXYZ(
        1,
        origin.x + (to.x - origin.x) * frac,
        0.044,
        origin.z + (to.z - origin.z) * frac,
      );
      p.needsUpdate = true;
      ray.computeLineDistances();
      ray.material.color.set(run.visible[i] ? "#9dcfb2" : "#d89c61");
    });
    const inspecting = state.visit && tick >= state.visit.arrive,
      bin = inspecting ? stations[state.visit.i] : null;
    const pickup = Math.max(0, Math.min(1, (tick - run.end + 6) / 6));
    const motion = gait(tick),
      hands = [];
    if (pickup > 0) {
      hands.push([
        "r",
        target.x + 0.17,
        1.14 + pickup * 0.12,
        -1.72 + pickup * 0.17,
        1,
      ]);
    } else if (bin) {
      const amount = Math.min(
        1,
        (tick - state.visit.arrive) / 2,
        state.visit.found ? 1 : (state.visit.end - tick) / 2,
      );
      hands.push(["r", bin.x + 0.15, 1.16, -1.73, amount]);
    }
    v.pose(observer.key, state.pos, motion, tick, hands);
    if (pickup > 0) {
      v.handPosition(observer.key, "r", wrist);
      record.visible = true;
      const f = pickup * pickup * (3 - 2 * pickup);
      record.position.set(
        target.x + (wrist.x - 0.13 - target.x) * f,
        1.11 + (wrist.y + 0.09 - 1.11) * f,
        -2.04 + (wrist.z - 0.015 + 2.04) * f,
      );
      record.rotation.x = -0.12 - 0.17 * f;
    } else record.rotation.x = -0.12;
    v.render([3.12, 3.83, 7.52], [-0.12, 1.18, -0.63], 36.5);
    return v.project(state.pos.x, 1.78, state.pos.z);
  };
}
