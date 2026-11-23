import * as T from "three";
import { venueMaterials } from "../material-library.js";
import { recordLabel, sleeveMaterial } from "../record-art.js";
import { WALL, DOOR } from "./simulation.js";

const finish = (color, roughness = 0.72, metalness = 0) =>
  new T.MeshStandardMaterial({ color, roughness, metalness });
const glow = (color) =>
  new T.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.72,
    roughness: 0.53,
  });
function sign(text, face, color, background) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 224;
  const g = c.getContext("2d");
  g.fillStyle = background;
  g.fillRect(0, 0, c.width, c.height);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = color;
  g.font = face;
  g.fillText(text, 512, 122);
  const tex = new T.CanvasTexture(c);
  tex.colorSpace = T.SRGBColorSpace;
  tex.anisotropy = 8;
  return new T.MeshBasicMaterial({ map: tex });
}
export async function buildHalls(scene) {
  const mats = await venueMaterials();
  const plaster = finish("#d3c6a9"),
    edge = finish("#54504a"),
    black = finish("#282b2b"),
    felt = finish("#242c2b");
  const bronze = finish("#b19770", 0.34, 0.56),
    steel = finish("#788481", 0.28, 0.62);
  const warm = glow("#de9b60"),
    cool = glow("#67bdac");
  const cube = new T.BoxGeometry(1, 1, 1),
    cylinder = new T.CylinderGeometry(0.5, 0.5, 1, 24),
    sphere = new T.SphereGeometry(0.5, 16, 10);
  const batches = new Map(),
    temp = new T.Object3D();
  function add(geometry, material, x, y, z, w, h, d, rx = 0, ry = 0, rz = 0) {
    const id = geometry.uuid + material.uuid;
    if (!batches.has(id)) batches.set(id, { geometry, material, matrices: [] });
    temp.position.set(x, y, z);
    temp.rotation.set(rx, ry, rz);
    temp.scale.set(w, h, d);
    temp.updateMatrix();
    batches.get(id).matrices.push(temp.matrix.clone());
  }
  const box = (...args) => add(cube, ...args),
    cyl = (...args) => add(cylinder, ...args);
  const concrete = finish("#575b55"),
    westFloor = mats.floor.clone(),
    eastFloor = mats.floor.clone();
  westFloor.color.set("#b79b76");
  eastFloor.color.set("#a3a58e");
  // Cutaway model. Its partitions and door openings use the simulation's dimensions.
  box(black, 0, -0.48, 0, 26.24, 0.65, 10.88);
  box(concrete, 0, -0.19, 0, 26.05, 0.14, 10.72);
  box(westFloor, -8.8, -0.065, 0, 8.2, 0.13, 10.34);
  box(mats.stone, 0, -0.065, 0, WALL * 2, 0.13, 10.34);
  box(eastFloor, 8.8, -0.065, 0, 8.2, 0.13, 10.34);
  box(bronze, 0, -0.2, 5.4, 25.99, 0.022, 0.025);
  for (const x of [-12.9, 12.9]) {
    box(plaster, x, 1.13, -1.86, 0.23, 2.26, 6.54);
    box(edge, x, 0.25, 2.8, 0.24, 0.5, 4.15);
    box(bronze, x, 2.26, -1.86, 0.26, 0.045, 6.57);
  }
  for (const side of [-1, 1]) {
    const center = 8.8 * side,
      accent = side === -1 ? warm : cool;
    box(black, center, 1.31, -5.17, 8.17, 2.62, 0.25);
    const slat = side === -1 ? mats.wood : finish("#405c55");
    for (let i = 0; i < 42; i++)
      box(
        i % 4 === 0 ? bronze : slat,
        center - 3.95 + i * 0.193,
        1.35,
        -4.99,
        0.077,
        2.58,
        0.13,
      );
    box(accent, center, 0.011, 4.97, 7.95, 0.018, 0.045);
    box(accent, center, 0.83, -4.29, 4.22, 0.025, 0.021);
    box(accent, center, 2.5, -4.89, 7.75, 0.036, 0.055);
    box(mats.wood, center, 0.38, -4.73, 4.35, 0.76, 0.8);
    box(black, center, 0.78, -4.73, 4.45, 0.1, 0.83);
    for (const x of [center - 1.12, center + 1.12]) {
      box(black, x, 0.87, -4.69, 1.13, 0.1, 0.61);
      cyl(steel, x - 0.07, 0.95, -4.67, 0.45, 0.037, 0.45);
      cyl(felt, x - 0.07, 0.98, -4.67, 0.428, 0.025, 0.428);
      cyl(accent, x - 0.07, 1.001, -4.67, 0.12, 0.01, 0.12);
      box(bronze, x + 0.36, 0.98, -4.72, 0.027, 0.025, 0.21, 0, -0.28);
    }
    for (const x of [center - 3.05, center + 3.05]) {
      box(mats.wood, x, 0.89, -4.68, 0.72, 1.74, 0.7);
      box(felt, x, 0.91, -4.315, 0.65, 1.66, 0.045);
      for (const [y, size] of [
        [0.65, 0.49],
        [1.28, 0.25],
      ]) {
        cyl(black, x, y, -4.275, size, 0.075, size, Math.PI / 2);
        cyl(steel, x, y, -4.226, size * 0.53, 0.015, size * 0.53, Math.PI / 2);
      }
    }
    const wallX = side * WALL,
      backLength = 5.1 - DOOR;
    box(plaster, wallX, 0.94, -(DOOR + backLength / 2), 0.25, 1.88, backLength);
    box(bronze, wallX, 1.91, -(DOOR + backLength / 2), 0.28, 0.046, backLength);
    box(edge, wallX, 0.32, DOOR + backLength / 2, 0.26, 0.64, backLength);
    box(accent, wallX, 0.66, DOOR + backLength / 2, 0.26, 0.035, backLength);
    for (const z of [-DOOR, DOOR]) {
      box(black, wallX, 0.73, z, 0.25, 1.46, 0.1);
      box(accent, wallX, 0.71, z, 0.28, 1.4, 0.045);
    }
    box(accent, wallX, 0.009, 0, 0.1, 0.015, DOOR * 2);
    const panel = new T.Mesh(
      new T.PlaneGeometry(4.65, 1.01),
      sign(
        side === -1 ? "WEST HALL" : "EAST HALL",
        "600 123px Helvetica, Arial",
        side === -1 ? "#efd5ab" : "#b6e1cd",
        "#242b28",
      ),
    );
    panel.position.set(center, 1.79, -4.84);
    scene.add(panel);
  }
  // The record shop and glazing along the rear of the concourse.
  box(black, 0, 1.24, -5.14, 9.18, 2.48, 0.17);
  for (let i = 0; i < 9; i++) {
    box(
      i % 3 === 0 ? finish("#77644e") : finish("#58665e"),
      -3.99 + i * 0.99,
      1.28,
      -5.025,
      0.91,
      2.27,
      0.03,
    );
    box(bronze, -4.45 + i * 0.99, 1.24, -4.96, 0.04, 2.5, 0.14);
  }
  box(mats.wood, 0, 0.52, -4.82, 5.85, 1.04, 0.44);
  for (let i = 0; i < 62; i++) {
    const mat = [plaster, edge, bronze, black][
      (i * 29 + Math.floor(i / 6)) % 4
    ];
    box(
      mat,
      -2.77 + i * 0.089,
      0.48,
      -4.56,
      0.049,
      0.49 + (i % 4) * 0.027,
      0.19,
      0,
      0,
      i % 7 === 0 ? -0.07 : 0,
    );
  }
  const sleeve = sleeveMaterial();
  box(sleeve, -1.73, 1.34, -4.7, 0.51, 0.51, 0.022, -0.12, 0.04);
  box(sleeve, -1.12, 1.3, -4.7, 0.43, 0.43, 0.022, -0.16, -0.02);
  const record = new T.Mesh(new T.CircleGeometry(0.59, 64), recordLabel());
  record.position.set(1.55, 1.77, -4.9);
  scene.add(record);
  for (const x of [-3.3, 0, 3.3]) {
    cyl(bronze, x, 2.81, -4.53, 0.022, 0.57, 0.022);
    add(sphere, glow("#eacda1"), x, 2.47, -4.53, 0.36, 0.31, 0.36);
  }
  for (const { geometry, material, matrices } of batches.values()) {
    const mesh = new T.InstancedMesh(geometry, material, matrices.length);
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  }
}
