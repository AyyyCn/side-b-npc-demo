import * as T from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { buildHalls } from "./venue.js";
import { loadCrowd } from "./cast.js";
import { COUNT, END, FORK, HOLD, STRIDE, readGuest } from "./simulation.js";

const transforms = new T.Object3D(),
  point = new T.Vector3();
const arcColor = new T.Color("#9fe9d1");
function glowMaterial(color, opacity = 1) {
  return new T.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    side: T.DoubleSide,
  });
}
export async function createView(canvas) {
  const renderer = new T.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  const scene = new T.Scene();
  scene.background = new T.Color("#1a2423");
  const pm = new T.PMREMGenerator(renderer),
    environment = new RoomEnvironment();
  scene.environment = pm.fromScene(environment, 0.026).texture;
  scene.environmentIntensity = 0.27;
  environment.dispose();
  pm.dispose();
  scene.add(new T.HemisphereLight(0xe3e6d5, 0x777e6c, 1.62));
  const sun = new T.DirectionalLight(0xffe2b8, 2.22);
  sun.position.set(-7, 15, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 1024);
  Object.assign(sun.shadow.camera, {
    left: -17,
    right: 17,
    top: 12,
    bottom: -12,
    far: 48,
    near: 1,
  });
  sun.shadow.normalBias = 0.023;
  sun.shadow.bias = -0.0003;
  scene.add(sun, sun.target);
  const rim = new T.DirectionalLight(0xc3e1de, 1.05);
  rim.position.set(8, 7, -6);
  scene.add(rim);
  const ground = new T.Mesh(
    new T.PlaneGeometry(220, 180),
    new T.MeshStandardMaterial({ color: "#2b3632", roughness: 0.94 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.82;
  ground.receiveShadow = true;
  scene.add(ground);
  const [, drawCast] = await Promise.all([buildHalls(scene), loadCrowd(scene)]);
  const halo = new T.InstancedMesh(
    new T.RingGeometry(0.226, 0.292, 28),
    glowMaterial("#ffffff", 0.95),
    COUNT,
  );
  halo.frustumCulled = false;
  scene.add(halo);
  const oldColor = new T.Color("#dea472"),
    selectedColor = new T.Color("#fbefae");
  const who = new T.Mesh(
    new T.RingGeometry(0.44, 0.51, 40),
    glowMaterial("#fff2be", 1),
  );
  who.rotation.x = -Math.PI / 2;
  scene.add(who);
  const stopped = new T.Mesh(
    new T.CylinderGeometry(0.5, 0.5, 2.07, 32, 1, true),
    glowMaterial("#feb563", 0.32),
  );
  scene.add(stopped);
  // Only actual, completed transmissions are drawn. Endpoints are stored at delivery time.
  const segments = 9,
    capacity = COUNT * segments * 2;
  const positions = new Float32Array(capacity * 3),
    colors = new Float32Array(capacity * 3);
  const links = new T.BufferGeometry();
  links.setAttribute(
    "position",
    new T.BufferAttribute(positions, 3).setUsage(T.DynamicDrawUsage),
  );
  links.setAttribute(
    "color",
    new T.BufferAttribute(colors, 3).setUsage(T.DynamicDrawUsage),
  );
  const lines = new T.LineSegments(
    links,
    new T.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.96,
      depthTest: false,
    }),
  );
  lines.frustumCulled = false;
  lines.renderOrder = 5;
  scene.add(lines);
  const camera = new T.OrthographicCamera(-1, 1, 1, -1, 0.1, 120);
  camera.position.set(3.25, 22, 30);
  camera.lookAt(0, 0.42, 0);
  camera.updateMatrixWorld(true);
  let size = "",
    viewports = [],
    picks = [[], []];
  function layout() {
    const w = canvas.clientWidth,
      h = canvas.clientHeight,
      stacked = window.matchMedia("(max-width: 680px)").matches;
    const key = w + "/" + h + "/" + stacked;
    if (size === key) return;
    size = key;
    renderer.setSize(w, h, false);
    viewports = stacked
      ? [
          { x: 0, y: h / 2, w, h: h / 2 },
          { x: 0, y: 0, w, h: h / 2 },
        ]
      : [
          { x: 0, y: 0, w: w / 2, h },
          { x: w / 2, y: 0, w: w / 2, h },
        ];
  }
  const tags = [
    document.getElementById("tag-a"),
    document.getElementById("tag-b"),
  ];
  function render(trace, time, idx, info, zoom) {
    const rect = viewports[idx];
    const ratio = rect.w / rect.h;
    const halfHeight = Math.max(5.6, 14.15 / ratio) / (1 + zoom * 1.23);
    Object.assign(camera, {
      left: -halfHeight * ratio,
      right: halfHeight * ratio,
      top: halfHeight,
      bottom: -halfHeight,
    });
    camera.updateProjectionMatrix();
    renderer.setViewport(rect.x, rect.y, rect.w, rect.h);
    renderer.setScissor(rect.x, rect.y, rect.w, rect.h);
    const tick = Math.min(END, Math.max(0, Math.floor(time))),
      f = time - tick,
      n = Math.min(END, tick + 1);
    const poses = [];
    for (let i = 0; i < COUNT; i++) {
      const a = (tick * COUNT + i) * STRIDE,
        b = (n * COUNT + i) * STRIDE,
        buf = trace.frames;
      const mix = (j) => buf[a + j] + (buf[b + j] - buf[a + j]) * f;
      const base = buf[a + 2],
        delta = buf[b + 2] - base;
      const pose = {
        x: mix(0),
        z: mix(1),
        yaw: base + Math.atan2(Math.sin(delta), Math.cos(delta)) * f,
        speed: mix(3),
        travel: mix(5),
        weight: mix(6),
      };
      poses.push(pose);
      transforms.position.set(pose.x, 0.052, pose.z);
      transforms.rotation.set(-Math.PI / 2, 0, 0);
      transforms.scale.setScalar(1);
      transforms.updateMatrix();
      halo.setMatrixAt(i, transforms.matrix);
      halo.setColorAt(
        i,
        i === info.witness
          ? selectedColor
          : trace.receipts[buf[a + 4]].version === 2
            ? arcColor
            : oldColor,
      );
      point.set(pose.x, 1.05, pose.z).project(camera);
      picks[idx][i] = {
        x: rect.x + ((point.x + 1) * rect.w) / 2,
        y: canvas.clientHeight - rect.y - ((point.y + 1) * rect.h) / 2,
        z: point.z,
      };
    }
    halo.instanceColor.needsUpdate = halo.instanceMatrix.needsUpdate = true;
    const focus = zoom > 0.48 ? info.hold : info.witness;
    const picked = poses[focus];
    who.position.set(picked.x, 0.063, picked.z);
    const tag = tags[idx],
      showTag = zoom > 0.48 || time > END - 50;
    tag.hidden = !showTag;
    if (showTag) {
      point.set(picked.x, 1.98, picked.z).project(camera);
      tag.style.left = rect.x + ((point.x + 1) * rect.w) / 2 + "px";
      tag.style.top =
        canvas.clientHeight - rect.y - ((point.y + 1) * rect.h) / 2 - 3 + "px";
      tag.textContent =
        info.guests[focus].name +
        (zoom > 0.48 && idx === 1 && time > FORK && time <= FORK + HOLD
          ? " · held"
          : "");
    }
    stopped.visible = idx === 1 && time > FORK && time <= FORK + HOLD;
    const held = poses[info.hold];
    stopped.position.set(held.x, 1.04, held.z);
    let vertex = 0;
    for (const e of trace.receipts) {
      const age = time - e.tick;
      if (e.from < 0 || age < 0 || age > 11) continue;
      const power = 1 - age / 12;
      const write = (k) => {
        const t = k / segments;
        positions.set(
          [
            e.fromX + (e.x - e.fromX) * t,
            1.17 + Math.sin(Math.PI * t) * 0.8,
            e.fromZ + (e.z - e.fromZ) * t,
          ],
          vertex * 3,
        );
        colors.set(
          [0.3 + power * 0.6, 0.56 + power * 0.43, 0.42 + power * 0.42],
          vertex * 3,
        );
        vertex++;
      };
      for (let k = 0; k < segments; k++) {
        write(k);
        write(k + 1);
      }
    }
    links.setDrawRange(0, vertex);
    links.attributes.position.needsUpdate =
      links.attributes.color.needsUpdate = true;
    drawCast(info.guests, poses, time);
    renderer.render(scene, camera);
  }
  return {
    draw(original, alternative, time, info) {
      if (!canvas.clientWidth) return;
      layout();
      renderer.setScissorTest(true);
      const zoom =
        T.MathUtils.smoothstep(time, FORK - 16, FORK + 3) *
        (1 - T.MathUtils.smoothstep(time, FORK + HOLD + 3, FORK + HOLD + 24));
      const anchor = readGuest(original, FORK, info.hold);
      // A shared lens tracks the same checkpoint in both runs, including while scrubbing backwards.
      const cx = anchor.x * zoom,
        cz = anchor.z * zoom,
        cy = 0.42 + 0.48 * zoom;
      camera.position.set(3.25 + cx, 22 + cy - 0.42, 30 + cz);
      camera.lookAt(cx, cy, cz);
      camera.updateMatrixWorld(true);
      render(original, time, 0, info, zoom);
      render(alternative, time, 1, info, zoom);
      renderer.setScissorTest(false);
    },
    pick(x, y) {
      const candidates = picks
        .flat()
        .map((p, index) => ({
          id: index % COUNT,
          d: Math.hypot(p.x - x, p.y - y),
          z: p.z,
        }))
        .filter((p) => p.d < 16);
      candidates.sort((a, b) => a.d - b.d || a.z - b.z);
      return candidates[0]?.id;
    },
  };
}
