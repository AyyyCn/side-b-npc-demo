import * as T from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createCameraPass } from "./film.js";
import city from "./art/night.webp";
import { venueMaterials } from "./material-library.js";
import { buildVenue } from "./venue.js";
import { createCast, updateCast } from "./cast.js";
import { loadModels, characterModels } from "./npc/rigs.js";
import chair from "./art/lounge-chair.glb";
import stool from "./art/stool.glb";
import plant from "./art/plant.glb";
import bottles from "./art/bottles.glb";

function lightVenue(scene, renderer) {
  scene.background = new T.Color("#121922");
  scene.fog = new T.FogExp2("#1a2226", 0.024);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.83;
  const pmrem = new T.PMREMGenerator(renderer),
    env = new RoomEnvironment();
  scene.environment = pmrem.fromScene(env, 0.03).texture;
  scene.environmentIntensity = 0.105;
  env.dispose();
  pmrem.dispose();
  scene.add(new T.HemisphereLight(0xb9c8dd, 0x73513e, 0.23));
  function spot(color, power, position, target, angle, shadow = false) {
    const l = new T.SpotLight(color, power, 23, angle, 0.72, 2);
    l.position.set(...position);
    l.target.position.set(...target);
    scene.add(l, l.target);
    if (shadow) {
      l.castShadow = true;
      l.shadow.mapSize.set(1024, 1024);
      l.shadow.normalBias = 0.012;
      l.shadow.bias = -0.0001;
    }
  }
  // Warm practical pools fall off across the floor. The cool window separates the silhouettes.
  spot(0xffcf9f, 54, [-3.1, 3.72, -0.8], [-4.7, 0.7, -2.5], 1.1, true);
  spot(0xffba78, 20, [-6.15, 2.91, -2.45], [-5.0, 1.64, -3.03], 1.05);
  spot(0xffc693, 73, [5.85, 3.9, -0.12], [4.55, 1.32, -2.54], 1.18, true);
  spot(0xffd5a8, 38, [-4.9, 3.25, 2.5], [-4.9, 0.94, 1.28], 0.81);
  spot(0xffd0ac, 34, [5.65, 3.14, 3.8], [4.66, 1.32, 1.28], 0.96);
  spot(0xffe0bc, 61, [0.6, 3.8, 2.22], [0.16, 0.9, 0.4], 1.12, true);
  spot(0x80b6dd, 81, [0.01, 2.45, -3.28], [0.9, 0.75, 0.83], 1.16);
  spot(0x8fafc5, 46, [-7.95, 2.65, 1.15], [-4.12, 0.7, 1.63], 1.0);
  const fill = new T.DirectionalLight(0xb7cfe1, 0.3);
  fill.position.set(3, 3, 5);
  scene.add(fill);
}
function contactTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 80;
  const g = c.getContext("2d"),
    r = g.createRadialGradient(40, 40, 0, 40, 40, 39);
  r.addColorStop(0, "rgba(0,0,0,.62)");
  r.addColorStop(0.38, "rgba(0,0,0,.34)");
  r.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 80, 80);
  return new T.CanvasTexture(c);
}
export async function createStage(canvas, hit) {
  const renderer = new T.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.55));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  const scene = new T.Scene();
  lightVenue(scene, renderer);
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const [rigs, assets, materials, night] = await Promise.all([
    loadModels(loader, characterModels),
    loadModels(loader, { chair, stool, plant, bottles }),
    venueMaterials(),
    new T.TextureLoader().loadAsync(city),
  ]);
  night.mapping = T.EquirectangularReflectionMapping;
  night.colorSpace = T.SRGBColorSpace;
  scene.background = night;
  scene.backgroundIntensity = 0.12;
  scene.backgroundRotation.y = 0.75;
  const props = Object.fromEntries(
    Object.entries(assets).map(([key, g]) => [key, g.scene]),
  );
  for (const p of Object.values(props))
    p.traverse((n) => {
      if (n.isMesh) {
        n.castShadow = true;
        n.receiveShadow = true;
      }
    });
  const animateVenue = buildVenue(scene, materials, props);
  const actors = createCast(scene, rigs);
  const renderCamera = createCameraPass(renderer);
  const contact = new T.MeshBasicMaterial({
    map: contactTexture(),
    transparent: true,
    depthWrite: false,
  });
  const patch = new T.PlaneGeometry(0.86, 0.71);
  for (const a of actors.values()) {
    const mesh = new T.Mesh(patch, contact);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.009;
    a.root.add(mesh);
  }
  const camera = new T.PerspectiveCamera(39, 16 / 9, 0.08, 64),
    look = new T.Vector3(),
    goal = new T.Vector3(),
    eye = new T.Vector3();
  const projected = new T.Vector3(),
    projectedHead = new T.Vector3();
  let initialized = false,
    mode = "director",
    lastPhase = "",
    seconds = 0,
    previousShot = "",
    lastRelay = "",
    lastLineAt = 0;
  function update(state, dt, selected) {
    const width = canvas.clientWidth,
      height = canvas.clientHeight;
    if (!width || !height) return;
    const px = renderer.getPixelRatio();
    if (
      Math.abs(canvas.width - width * px) > 1 ||
      Math.abs(canvas.height - height * px) > 1
    )
      renderer.setSize(width, height, false);
    camera.aspect = width / height;
    seconds += dt;
    updateCast(
      actors,
      state,
      camera,
      dt,
      state.phase === "choose" && lastPhase !== "choose",
      seconds,
    );
    animateVenue(dt, state.phase !== "choose" && state.time > 4);
    lastPhase = state.phase;
    // Every shot is composed from current positions. Cut on a new subject, then track within that shot.
    let shot = "room",
      fov = 41;
    eye.set(-3.45, 2.28, 8.48);
    goal.set(0.4, 1.32, -0.95);
    fov = 48;
    if (state.phase === "choose") {
      lastRelay = "";
      lastLineAt = 0;
    }
    if (state.speaker && !state.question) {
      lastRelay = state.speaker;
      lastLineAt = state.time;
    }
    const solo =
      state.phase === "spreading" &&
      state.people.find(
        (guest) => guest.source === "you" && !guest.recipient && !guest.arrived,
      );
    const subject =
      state.speaker ||
      (state.phase === "spreading" && state.time - lastLineAt < 0.9
        ? lastRelay
        : "") ||
      solo?.id;
    const talk = actors.get(subject),
      guest = state.people.find((p) => p.id === subject);
    if (mode === "director" && talk && state.phase !== "choose") {
      const p = talk.root.position;
      const partner = actors.get(guest.partner || guest.recipient);
      if (state.question) {
        shot = "question-" + guest.id;
        const seated = talk.seatWeight > 0.5,
          faceY = seated ? 1.15 : talk.height - 0.13;
        goal.set(p.x + 0.13, faceY - 0.11, p.z - 0.05);
        eye.set(
          p.x + (seated ? 1.22 : -1.36),
          faceY + 0.18,
          p.z + (seated ? 2.47 : 2.92),
        );
        fov = 34;
      } else if (partner) {
        shot = "relay-" + guest.id;
        const nx = partner.root.position.x,
          nz = partner.root.position.z;
        goal.set((p.x + nx) * 0.5, 1.32, (p.z + nz) * 0.5);
        const dx = nx - p.x,
          dz = nz - p.z,
          len = Math.hypot(dx, dz) || 1;
        const side = dx >= 0 ? 1 : -1;
        eye.set(
          goal.x - (dz / len) * 3.1 * side,
          1.72,
          goal.z + (dx / len) * 3.1 * side + 1.0,
        );
        fov = guest.id === "nell" ? 35 : 39;
      } else {
        shot = "solo-" + guest.id;
        const focusY = 1.06 - 0.19 * talk.seatWeight;
        goal.set(p.x, focusY, p.z);
        eye.set(p.x + 1.65, focusY + 0.57, p.z + 3.15);
        fov = 39;
      }
    } else if (mode === "director" && state.phase !== "choose") {
      shot = "audience";
      goal.set(3.47, 1.26, -0.28);
      eye.set(-0.8, 2.27, 5.94);
      fov = 42;
    }
    const blend =
      !initialized || shot !== previousShot ? 1 : 1 - Math.exp(-4 * dt);
    previousShot = shot;
    camera.position.lerp(eye, blend);
    look.lerp(goal, blend);
    camera.fov = T.MathUtils.lerp(camera.fov, fov, blend);
    camera.lookAt(look);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    initialized = true;
    renderCamera(
      scene,
      camera,
      camera.position.distanceTo(look),
      shot.startsWith("question") || shot.startsWith("relay"),
    );
    for (const p of state.people) {
      const a = actors.get(p.id);
      projected.copy(a.root.position).project(camera);
      projectedHead.copy(a.root.position);
      projectedHead.y = a.height - a.seatWeight * 0.35;
      projectedHead.project(camera);
      const b = hit.get(p.id),
        h = (projectedHead.y - projected.y) * 50,
        x = (1 + projected.x) * 50,
        y = (1 - projected.y) * 50;
      b.style.visibility =
        projected.z > 1 || x < 0 || x > 100 || y < 0 || y > 135
          ? "hidden"
          : "visible";
      b.style.left = x + "%";
      b.style.top = y + "%";
      b.style.height = h + "%";
      b.style.width = (h * 0.34 * height) / width + "%";
      b.style.zIndex = String(Math.floor((1 - projected.z) * 10000));
      b.classList.toggle("speaking", state.speaker === p.id);
      b.classList.toggle("selected", p.id === selected);
    }
  }
  return {
    update,
    toggle() {
      mode = mode === "director" ? "wide" : "director";
      return mode;
    },
  };
}
