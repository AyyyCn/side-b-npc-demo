import * as T from "three";
import { WALK_DISTANCE } from "./npc/gait.js";
import { sleeveMaterial } from "./record-art.js";
import { clone } from "three/addons/utils/SkeletonUtils.js";

const profiles = {
  nell: { rig: "maya", height: 1.69, top: "#e0b782", yaw: 1.12 },
  kit: { rig: "sam", height: 1.76, top: "#98543f", yaw: -1.88 },
  finn: { rig: "jordan", height: 1.84, top: "#687c7d", yaw: -1.32 },
  ida: { rig: "harper", height: 1.62, top: "#7c8170", yaw: -1.87 },
  silas: { rig: "sam", height: 1.8, top: "#374952", yaw: 0.78 },
  lark: { rig: "maya", height: 1.72, top: "#484453", yaw: 0.08 },
};
const v = () => new T.Vector3();
const shoulder = v(),
  elbow = v(),
  hand = v(),
  target = v(),
  direction = v(),
  pole = v(),
  desiredElbow = v(),
  v1 = v(),
  v2 = v();
const delta = new T.Quaternion(),
  world = new T.Quaternion(),
  parent = new T.Quaternion();

function aimSegment(bone, child, point, weight) {
  bone.getWorldPosition(v1);
  child.getWorldPosition(v2);
  v2.sub(v1).normalize();
  v1.subVectors(point, v1).normalize();
  delta.setFromUnitVectors(v2, v1);
  bone.getWorldQuaternion(world);
  world.premultiply(delta);
  bone.parent.getWorldQuaternion(parent);
  world.premultiply(parent.invert());
  bone.quaternion.slerp(world, weight);
  bone.updateWorldMatrix(false, true);
}
// Two-bone reach, layered over the native clips. All distances are in character-local metres.
export function reach(a, side, x, y, z, weight) {
  if (weight < 0.005) return;
  const [upper, lower, wrist] = a.arms[side],
    sign = side === "l" ? 1 : -1;
  upper.getWorldPosition(shoulder);
  lower.getWorldPosition(elbow);
  wrist.getWorldPosition(hand);
  const upperLength = shoulder.distanceTo(elbow),
    lowerLength = elbow.distanceTo(hand);
  target.set(x, y, z);
  a.root.localToWorld(target);
  direction.subVectors(target, shoulder);
  const distance = T.MathUtils.clamp(
    direction.length(),
    0.11,
    upperLength + lowerLength - 0.003,
  );
  direction.normalize();
  target.copy(shoulder).addScaledVector(direction, distance);
  pole.set(sign * 0.65, y - 0.3, -0.19);
  a.root.localToWorld(pole);
  pole.sub(shoulder);
  pole.addScaledVector(direction, -pole.dot(direction)).normalize();
  const along =
    (upperLength ** 2 + distance ** 2 - lowerLength ** 2) / (2 * distance);
  desiredElbow
    .copy(shoulder)
    .addScaledVector(direction, along)
    .addScaledVector(
      pole,
      Math.sqrt(Math.max(0, upperLength ** 2 - along ** 2)),
    );
  aimSegment(upper, lower, desiredElbow, weight);
  aimSegment(lower, wrist, target, weight);
}
function accessory(parent, geo, material, x, y, z) {
  const mesh = new T.Mesh(geo, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}
function styleActor(a, id) {
  const dark = new T.MeshStandardMaterial({
    color: "#27282b",
    metalness: 0.48,
    roughness: 0.39,
  });
  if (id === "lark") {
    const headphone = new T.Group();
    a.root.add(headphone);
    a.headphone = headphone;
    const arc = accessory(
      headphone,
      new T.TorusGeometry(0.095, 0.012, 10, 36, Math.PI),
      dark,
      0,
      0.028,
      0,
    );
    arc.scale.y = 1.1;
    for (const side of [-1, 1]) {
      const cup = accessory(
        headphone,
        new T.SphereGeometry(1, 16, 10),
        dark,
        side * 0.092,
        0.015,
        0,
      );
      cup.scale.set(0.03, 0.054, 0.043);
    }
  }
  if (id === "silas") {
    a.sleeve = accessory(
      a.root,
      new T.BoxGeometry(0.307, 0.307, 0.012),
      sleeveMaterial(),
      0,
      0.72,
      0.19,
    );
    a.sleeve.rotation.set(-0.31, 0.05, -0.06);
  }
  if (id === "kit") {
    const camera = new T.Group();
    a.root.add(camera);
    a.camera = camera;
    accessory(camera, new T.BoxGeometry(0.145, 0.082, 0.062), dark, 0, 0, 0);
    const lens = accessory(
      camera,
      new T.CylinderGeometry(0.031, 0.037, 0.066, 24),
      dark,
      0,
      0,
      0.044,
    );
    lens.rotation.x = Math.PI / 2;
    const strap = new T.CatmullRomCurve3([
      new T.Vector3(-0.071, 0.025, 0),
      new T.Vector3(-0.09, 0.27, -0.11),
      new T.Vector3(0, 0.33, -0.16),
      new T.Vector3(0.09, 0.27, -0.11),
      new T.Vector3(0.071, 0.025, 0),
    ]);
    accessory(
      camera,
      new T.TubeGeometry(strap, 28, 0.007, 5, false),
      dark,
      0,
      0,
      0,
    );
  }
}
export function createCast(scene, rigs, castProfiles = profiles) {
  const actors = new Map();
  for (const [id, profile] of Object.entries(castProfiles)) {
    const ref = rigs[profile.rig],
      model = clone(ref.scene),
      root = new T.Group();
    root.add(model);
    scene.add(root);
    const mixer = new T.AnimationMixer(model);
    const action = (name) =>
      mixer.clipAction(T.AnimationClip.findByName(ref.animations, name));
    const idle = action("Idle_Standing"),
      walk = action("Walk_Brisk");
    idle.play();
    walk.play();
    walk.weight = 0;
    idle.time = actors.size * 0.52;
    mixer.update(0.01);
    const authoredHeight = { maya: 1.7, sam: 1.79, jordan: 1.85, harper: 1.68 }[
      profile.rig
    ];
    model.scale.multiplyScalar(profile.height / authoredHeight);
    let sit;
    if (id === "silas") {
      sit = action("Sit_Stand");
      sit.play();
      sit.time = 3;
      sit.paused = true;
      sit.weight = 0;
    }
    model.traverse((n) => {
      if (!n.isMesh) return;
      n.castShadow = true;
      n.receiveShadow = true;
      n.frustumCulled = false;
      const original = n.material;
      if (
        /original top|plum satin|tailored business fabric/.test(original.name)
      ) {
        n.material = original.clone();
        n.material.color.set(profile.top);
        n.material.roughness = 0.78;
        if (original.name.includes("plum satin")) {
          n.material.map = null;
          n.material.normalScale?.set(0.06, 0.06);
        }
      }
      if (original.name.endsWith("body.body")) {
        n.material = original.clone();
        n.material.color.set(id === "silas" ? "#caa58f" : "#e4c6ad");
        n.material.roughness = 0.69;
      }
    });
    const bone = (name) => model.getObjectByName(name);
    const arm = (side) =>
      ["upperarm", "lowerarm", "hand"].map((name) => bone(name + "_" + side));
    root.rotation.y = profile.yaw;
    const a = {
      root,
      mixer,
      idle,
      walk,
      sit,
      height: profile.height,
      rigScale: profile.height / authoredHeight,
      phase: actors.size * 0.217,
      yaw: profile.yaw,
      initialized: false,
      walkWeight: 0,
      seatWeight: 0,
      talkWeight: 0,
      head: bone("head"),
      chest: bone("spine_03"),
      arms: { l: arm("l"), r: arm("r") },
    };
    a.pose = [
      a.head,
      a.chest,
      ...a.arms.l.slice(0, 2),
      ...a.arms.r.slice(0, 2),
    ].map((bone) => ({ bone, original: bone.quaternion.clone() }));
    styleActor(a, id);
    actors.set(id, a);
  }
  return actors;
}
const gaze = v(),
  local = v();
export function updateCast(actors, state, camera, dt, reset, seconds) {
  const moveMix = 1 - Math.exp(-22 * dt);
  for (const p of state.people) {
    const a = actors.get(p.id),
      pos = a.root.position;
    const dx = p.x - pos.x,
      dz = p.z - pos.z,
      fresh = reset || !a.initialized;
    let yaw = a.yaw;
    const hasQuestion = state.question && state.speaker === p.id;
    const partner = actors.get(p.partner);
    if (p.walking && Math.hypot(dx, dz) > 0.004) yaw = Math.atan2(dx, dz);
    else if (partner)
      yaw = Math.atan2(
        partner.root.position.x - pos.x,
        partner.root.position.z - pos.z,
      );
    else if (p.arrived) yaw = Math.atan2(5.33 - pos.x, -1.17 - pos.z);
    else if (p.source && p.id !== "lark" && p.id !== "nell" && p.id !== "silas")
      yaw = a.root.rotation.y;
    if (hasQuestion && !p.walking && (p.id !== "silas" || p.arrived))
      yaw = Math.atan2(camera.position.x - pos.x, camera.position.z - pos.z);
    pos.set(
      fresh ? p.x : pos.x + dx * moveMix,
      0,
      fresh ? p.z : pos.z + dz * moveMix,
    );
    a.root.rotation.y +=
      Math.atan2(
        Math.sin(yaw - a.root.rotation.y),
        Math.cos(yaw - a.root.rotation.y),
      ) * (fresh ? 1 : 1 - Math.exp(-7.5 * dt));
    a.initialized = true;
    a.walkWeight = T.MathUtils.damp(
      fresh ? 0 : a.walkWeight,
      p.walking ? 1 : 0,
      8,
      dt,
    );
    let seatedBlend = 0;
    if (a.sit) {
      const rise = p.source
        ? T.MathUtils.clamp((state.time - p.learned) / 1.65, 0, 1)
        : 0;
      a.sit.time = 3.55 + 1.65 * rise;
      seatedBlend = 1 - T.MathUtils.smoothstep(rise, 0.8, 1);
      a.sit.weight = seatedBlend;
      a.seatWeight = 1 - T.MathUtils.smoothstep(rise, 0.02, 0.88);
    }
    // The mixer skips writes for identical samples. Restore last frame's unmodified clip
    // before sampling so gestures never accumulate on a paused or constant track.
    for (const pose of a.pose) pose.bone.quaternion.copy(pose.original);
    a.walk.weight = a.walkWeight * (1 - seatedBlend);
    a.idle.weight = (1 - a.walkWeight) * (1 - seatedBlend);
    a.walk.time =
      ((p.walked / (WALK_DISTANCE * a.rigScale) + a.phase) % 1) *
      a.walk.getClip().duration;
    a.idle.time = (seconds + a.phase * 4) % a.idle.getClip().duration;
    a.mixer.update(0);
    for (const pose of a.pose) pose.original.copy(pose.bone.quaternion);
    a.root.updateWorldMatrix(true, true);
    a.talkWeight = T.MathUtils.damp(
      a.talkWeight,
      state.speaker === p.id && !p.walking ? 1 : 0,
      5,
      dt,
    );
    if (partner || hasQuestion) {
      gaze.copy(hasQuestion ? camera.position : partner.root.position);
      if (!hasQuestion) gaze.y = partner.height - 0.12;
      local.copy(gaze);
      a.root.worldToLocal(local);
      a.head.rotateY(
        T.MathUtils.clamp(Math.atan2(local.x, local.z), -0.42, 0.42) * 0.42,
      );
      a.head.rotateX(Math.sin(seconds * 6.2) * 0.038 * a.talkWeight);
    }
    if (a.sleeve) {
      a.sleeve.visible = a.seatWeight > 0.35;
      a.sleeve.position.set(0, 0.7 + Math.sin(seconds * 1.3) * 0.006, 0.17);
      a.sleeve.rotation.x = -1.0 + 0.12 * a.talkWeight;
      a.head.rotateX(0.22 * a.seatWeight * (1 - a.talkWeight));
    }
    if (p.id === "lark") {
      a.chest.rotateX(0.1 + 0.035 * Math.sin(seconds * 2.7));
      a.root.updateWorldMatrix(false, true);
      reach(a, "l", 0.24, 1.06, 0.39 + 0.024 * Math.sin(seconds * 3.6), 1);
      reach(a, "r", -0.21 + 0.09 * Math.sin(seconds * 2.4), 1.09, 0.4, 1);
    } else if (a.seatWeight > 0.01) {
      reach(a, "r", -0.144, 0.685, 0.19, a.seatWeight);
      reach(a, "l", 0.15, 0.69, 0.19, a.seatWeight);
    } else {
      const handY = 1.14 + 0.035 * Math.sin(seconds * 6.3);
      reach(
        a,
        "r",
        -0.2,
        handY,
        0.34 + 0.065 * Math.sin(seconds * 4),
        a.talkWeight * 0.94,
      );
    }
    if (a.headphone) {
      a.head.getWorldPosition(local);
      a.root.worldToLocal(local);
      a.headphone.position.copy(local);
      a.headphone.position.y += 0.114;
      a.headphone.position.z -= 0.008;
    }
    if (a.camera) {
      a.chest.getWorldPosition(local);
      a.root.worldToLocal(local);
      a.camera.position.copy(local);
      a.camera.position.y -= 0.035;
      a.camera.position.z += 0.169;
      a.camera.rotation.z = 0.085 * Math.sin(seconds * 5) * a.walkWeight;
    }
  }
}
