import * as T from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { createCast, reach } from "../cast.js";
import { loadModels, characterModels } from "./rigs.js";
import { sampleRig } from "./gait.js";
import { venueMaterials } from "../material-library.js";

export const paint = (color, roughness = 0.75, metalness = 0) =>
  new T.MeshStandardMaterial({ color, roughness, metalness });
export const glow = (color) => new T.MeshBasicMaterial({ color });
const cube = new T.BoxGeometry(1, 1, 1);
export function box(parent, material, x, y, z, w, h, d) {
  const mesh = new T.Mesh(cube, material);
  mesh.position.set(x, y, z);
  mesh.scale.set(w, h, d);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
export function rod(parent, mat, a, b, r = 0.028) {
  const v = new T.Vector3(...a),
    w = new T.Vector3(...b),
    dir = w.clone().sub(v);
  const mesh = new T.Mesh(new T.CylinderGeometry(r, r, dir.length(), 9), mat);
  mesh.position.copy(v.add(w).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir.normalize());
  parent.add(mesh);
  return mesh;
}
export function sign(
  parent,
  words,
  x,
  y,
  z,
  width,
  height,
  fg = "#f2e9d1",
  bg = "#24352f",
) {
  const c = document.createElement("canvas");
  c.width = 768;
  c.height = Math.max(48, Math.round((c.width * height) / width));
  const g = c.getContext("2d");
  g.fillStyle = bg;
  g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = fg;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font =
    "bold " +
    Math.floor(c.height * 0.6) +
    "px Helvetica Neue, Arial, sans-serif";
  g.fillText(words, c.width / 2, c.height * 0.52, c.width * 0.92);
  const tex = new T.CanvasTexture(c);
  tex.colorSpace = T.SRGBColorSpace;
  tex.anisotropy = 8;
  const mesh = new T.Mesh(
    new T.PlaneGeometry(width, height),
    new T.MeshStandardMaterial({ map: tex, roughness: 0.78 }),
  );
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}
export function spot(scene, color, power, at, target) {
  const light = new T.SpotLight(color, power, 22, 1.02, 0.62, 2);
  light.position.set(...at);
  light.target.position.set(...target);
  scene.add(light, light.target);
  return light;
}
export async function studio(canvas, profiles, warm) {
  const renderer = new T.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.55));
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = warm ? 1.04 : 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  const scene = new T.Scene();
  scene.background = new T.Color(warm ? "#494137" : "#24252a");
  scene.fog = new T.Fog(scene.background, 13, 27);
  const pm = new T.PMREMGenerator(renderer),
    env = new RoomEnvironment();
  scene.environment = pm.fromScene(env, 0.04).texture;
  scene.environmentIntensity = warm ? 0.24 : 0.21;
  env.dispose();
  pm.dispose();
  scene.add(
    new T.HemisphereLight(
      warm ? 0xffead0 : 0xc4d6ed,
      warm ? 0xb39976 : 0x7f6865,
      warm ? 1.15 : 0.82,
    ),
  );
  const key = new T.DirectionalLight(
    warm ? 0xffe7c8 : 0xffdbb0,
    warm ? 2.35 : 1.76,
  );
  key.position.set(-4.8, 7.8, 4.1);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, {
    left: -7,
    right: 7,
    top: 5,
    bottom: -5,
    near: 1,
    far: 22,
  });
  key.shadow.normalBias = 0.016;
  key.shadow.bias = -0.00016;
  scene.add(key, key.target);
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const used = Object.keys(profiles).map((k) => profiles[k].rig);
  const [rigs, materials] = await Promise.all([
    loadModels(
      loader,
      Object.fromEntries(
        Object.entries(characterModels).filter(([id]) => used.includes(id)),
      ),
    ),
    venueMaterials(),
  ]);
  const actors = createCast(scene, rigs, profiles),
    camera = new T.PerspectiveCamera(37, 1, 0.05, 45);
  const v = new T.Vector3();
  let width = 0,
    height = 0;
  function pose(id, position, motion, tick, hands = []) {
    const a = actors.get(id);
    a.root.position.set(position.x, 0.009, position.z);
    a.root.rotation.y = motion.yaw;
    sampleRig(a, motion, tick);
    a.root.updateWorldMatrix(true, true);
    for (const [side, x, y, z, weight = 1] of hands) {
      a.root.worldToLocal(v.set(x, y, z));
      reach(a, side, v.x, v.y, v.z, weight);
    }
  }
  function handPosition(id, side, out) {
    return actors.get(id).arms[side][2].getWorldPosition(out);
  }
  function render(eye, aim, fov = 38) {
    const w = canvas.clientWidth,
      h = canvas.clientHeight;
    if (!w || !h) return;
    if (width !== w || height !== h) {
      width = w;
      height = h;
      renderer.setSize(w, h, false);
    }
    camera.aspect = w / h;
    camera.fov = fov;
    camera.position.set(...eye);
    if (camera.aspect < 1.45)
      camera.position.lerp(new T.Vector3(...aim), 1 - 1.45 / camera.aspect);
    camera.lookAt(...aim);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }
  function project(x, y, z) {
    v.set(x, y, z).project(camera);
    return { x: (0.5 + 0.5 * v.x) * width, y: (0.5 - 0.5 * v.y) * height };
  }
  return { scene, materials, pose, handPosition, render, project };
}
