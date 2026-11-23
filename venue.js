import * as T from "three";
import { recordLabel, sleeveMaterial } from "./record-art.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// Build the fixed set in metres. Batch repeated fittings and records by finish.
export function buildVenue(scene, materials, props) {
  const batches = new Map();
  const temp = new T.Object3D();
  const cube = new T.BoxGeometry();
  const round = new RoundedBoxGeometry(1, 1, 1, 2, 0.045);
  const drum = new T.CylinderGeometry(0.5, 0.5, 1, 48);
  const globe = new T.SphereGeometry(0.5, 28, 16);
  let seed = 73281;
  const random = () =>
    (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  const finish = (color, roughness = 0.65, metalness = 0) =>
    new T.MeshStandardMaterial({ color, roughness, metalness });
  const lit = (color, intensity = 1) =>
    new T.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: intensity,
      roughness: 0.65,
    });
  const { floor, wood: walnut, stone, plaster } = materials;
  const bulbs = [];
  const platters = [];
  const graphite = finish("#29292b"),
    brass = finish("#ba8a4c", 0.3, 0.72),
    chrome = finish("#c7cfca", 0.26, 0.83);
  const speakerWood = finish("#724c32"),
    woofer = finish("#272728", 0.83),
    cone = finish("#434041", 0.85);
  const ink = finish("#16191c"),
    light = lit("#fbd5a2", 1.4),
    strip = lit("#ffa856", 2.0);
  const records = [
    "#a88f74",
    "#363f45",
    "#cec4aa",
    "#813f33",
    "#454d43",
    "#d7b37b",
    "#38322f",
  ].map((c) => finish(c));
  const add = (geo, mat, x, y, z, w, h, d, rx = 0, ry = 0, rz = 0) => {
    temp.position.set(x, y, z);
    temp.rotation.set(rx, ry, rz);
    temp.scale.set(w, h, d);
    temp.updateMatrix();
    const key = geo.uuid + mat.uuid;
    if (!batches.has(key)) batches.set(key, { geo, mat, items: [] });
    batches.get(key).items.push(temp.matrix.clone());
  };
  const box = (...args) => add(cube, ...args),
    soft = (...args) => add(round, ...args),
    cyl = (...args) => add(drum, ...args);
  box(floor, 0, -0.14, 1, 25, 0.28, 19);
  box(plaster, -5.4, 2.55, -3.35, 7.6, 5.1, 0.23);
  box(plaster, 4.75, 2.55, -3.35, 7.25, 5.1, 0.23);
  // A recessed window gives the library depth. Lamps beyond the glass belong to the city.
  box(ink, 0.37, 0.25, -3.27, 2.04, 0.5, 0.2);
  box(ink, 0.37, 3.98, -3.27, 2.04, 0.55, 0.2);
  for (const x of [-1.55, -0.62, 0.32, 1.26])
    box(ink, x, 2.1, -3.31, 0.041, 3.6, 0.055);
  box(ink, -0.14, 2.2, -3.31, 2.85, 0.033, 0.055);
  box(graphite, 0, 4.28, 0.8, 25, 0.19, 19);
  box(plaster, -8.32, 0.77, -0.32, 0.23, 1.54, 6.2);
  box(ink, -8.32, 3.78, -0.32, 0.23, 0.65, 6.2);
  for (const z of [-3.2, -2, -0.8, 0.4, 1.6, 2.8])
    box(ink, -8.32, 2.47, z, 0.16, 2.1, 0.05);
  // The long floating counter, brass toe kick and amber back-bar.
  box(walnut, -5.4, 0.49, -1.79, 4.6, 0.98, 0.72);
  soft(stone, -5.4, 1.01, -1.79, 4.74, 0.095, 0.82);
  box(brass, -5.4, 0.15, -1.42, 4.55, 0.03, 0.027);
  box(strip, -5.4, 0.945, -1.426, 4.52, 0.012, 0.02);
  box(ink, -4.9, 2.38, -3.16, 5.88, 2.15, 0.13);
  const panelCanvas = document.createElement("canvas");
  panelCanvas.width = 8;
  panelCanvas.height = 128;
  const pg = panelCanvas.getContext("2d");
  const panelGradient = pg.createLinearGradient(0, 0, 0, 128);
  panelGradient.addColorStop(0, "#5e351e");
  panelGradient.addColorStop(0.42, "#211911");
  panelGradient.addColorStop(0.84, "#683e24");
  panelGradient.addColorStop(1, "#c88a49");
  pg.fillStyle = panelGradient;
  pg.fillRect(0, 0, 8, 128);
  const wash = new T.CanvasTexture(panelCanvas);
  wash.colorSpace = T.SRGBColorSpace;
  const amber = new T.MeshStandardMaterial({
    color: 0x392b22,
    roughness: 0.45,
    emissive: 0xffbd80,
    emissiveIntensity: 0.65,
    emissiveMap: wash,
  });
  for (const h of [1.89, 2.63]) box(amber, -4.9, h, -3.04, 5.65, 0.72, 0.1);
  for (let row = 0; row < 2; row++) {
    const h = 1.53 + row * 0.72;
    box(walnut, -4.9, h, -2.97, 5.75, 0.075, 0.43);
    box(strip, -4.9, h + 0.05, -3.01, 5.57, 0.017, 0.027);
    for (let j = 0; j < 8; j++) {
      if ((row === 1 && [1, 3, 4, 6].includes(j)) || (row === 0 && j === 5))
        continue;
      const group = props.bottles.clone();
      group.position.set(-7.62 + j * 0.69, h + 0.045, -2.91);
      group.rotation.y = ((j % 3) - 1) * 0.3;
      group.scale.setScalar(0.85 + random() * 0.19);
      scene.add(group);
    }
  }
  for (const x of [-6.8, -5.55, -4.45]) {
    const stool = props.stool.clone();
    stool.position.set(x, 0, -1.04);
    stool.rotation.y = x;
    scene.add(stool);
  }
  // Cut-glass tumblers, an ice bucket and a folded linen towel on the work surface.
  const glass = finish("#ac997e", 0.15, 0.49),
    crystal = finish("#bdb9ae", 0.19, 0.56),
    cloth = finish("#c5b4a0", 0.96);
  for (const [x, z] of [
    [-3.57, -1.76],
    [-3.73, -1.82],
    [-4.04, -1.91],
    [-4.19, -1.89],
    [-6.48, -1.64],
  ]) {
    cyl(glass, x, 1.121, z, 0.074, 0.122, 0.074);
    cyl(crystal, x, 1.182, z, 0.078, 0.009, 0.078);
  }
  cyl(chrome, -4.68, 1.16, -1.89, 0.182, 0.205, 0.182);
  box(cloth, -3.82, 1.072, -1.59, 0.25, 0.025, 0.13, 0, 0.12);
  for (const x of [-6.55, -4.9, -3.25]) {
    cyl(ink, x, 3.81, -1.96, 0.025, 0.8, 0.025);
    cyl(brass, x, 3.37, -1.96, 0.2, 0.14, 0.2);
    add(globe, light, x, 3.16, -1.96, 0.34, 0.34, 0.34);
    bulbs.push([x, 3.16, -1.96]);
  }
  // Record library with alternating gaps and sleeves leaning against the dividers.
  box(walnut, -0.3, 0.49, -3.03, 3.1, 0.98, 0.46);
  for (const y of [0.08, 0.52]) {
    box(ink, -0.32, y + 0.18, -2.78, 2.92, 0.38, 0.075);
    for (let k = 0; k < 51; k++) {
      if (k % 18 > 14) continue;
      const x = -1.7 + k * 0.056;
      box(
        records[Math.floor(random() * records.length)],
        x,
        y + 0.16,
        -2.72,
        0.03 + random() * 0.014,
        0.29 + random() * 0.04,
        0.27,
        0,
        0,
        Math.sin(k * 0.4) * 0.04,
      );
    }
  }
  for (const [x, z, scale] of [
    [0.7, -2.8, 0.96],
    [-7.05, 3.75, 1.42],
    [7.46, 0.8, 1.35],
  ]) {
    const plant = props.plant.clone();
    plant.position.set(x, 0, z);
    plant.scale.setScalar(scale * 2.0);
    scene.add(plant);
  }
  // A pair of record jackets lean out of the library.
  const sleeve = sleeveMaterial();
  for (const [x, yaw] of [
    [-0.75, -0.08],
    [-0.24, 0.13],
  ]) {
    box(sleeve, x, 1.19, -2.7, 0.37, 0.37, 0.012, -0.23, yaw);
  }
  // A walnut acoustic wall and a designed, physical sign behind the booth.
  box(ink, 4.6, 2.1, -3.15, 6.7, 4.15, 0.16);
  for (let i = 0; i < 82; i++)
    box(
      i % 3 === 0 ? speakerWood : walnut,
      1.32 + i * 0.081,
      2.1,
      -2.99,
      0.045 + random() * 0.017,
      4.13,
      0.12 + random() * 0.05,
    );
  const disc = new T.Mesh(new T.CircleGeometry(1.02, 96), recordLabel());
  disc.position.set(4.98, 2.57, -2.78);
  scene.add(disc);
  cyl(ink, 4.98, 2.57, -2.825, 2.05, 0.055, 2.05, Math.PI / 2);
  box(strip, 4.58, 0.16, -2.845, 6.55, 0.015, 0.029);
  // Twin three-way loudspeakers. Drivers and horn sit proud of the baffle.
  function speaker(x, z) {
    box(ink, x, 0.23, z, 0.54, 0.46, 0.41);
    soft(walnut, x, 1.08, z, 0.89, 1.35, 0.57);
    box(graphite, x, 1.08, z + 0.294, 0.79, 1.24, 0.035);
    for (const [y, r] of [
      [0.86, 0.53],
      [1.36, 0.26],
    ]) {
      cyl(woofer, x, y, z + 0.322, r, 0.078, r, Math.PI / 2);
      cyl(cone, x, y, z + 0.373, r * 0.78, 0.035, r * 0.78, Math.PI / 2);
      cyl(ink, x, y, z + 0.395, r * 0.32, 0.045, r * 0.32, Math.PI / 2);
    }
    cyl(brass, x, 1.61, z + 0.33, 0.12, 0.04, 0.12, Math.PI / 2);
  }
  speaker(2.08, -1.99);
  speaker(7.12, -1.96);
  // Two turntables, visible grooves and tonearms; Lark stands on their far side.
  const deskX = 5.3,
    deskZ = -0.45;
  soft(walnut, deskX, 0.52, deskZ, 2.43, 0.97, 0.67);
  box(brass, deskX, 0.96, deskZ, 2.45, 0.024, 0.69);
  for (const x of [deskX - 0.67, deskX + 0.67]) {
    soft(graphite, x, 1.02, deskZ, 0.72, 0.09, 0.48);
    cyl(chrome, x - 0.07, 1.075, deskZ, 0.41, 0.025, 0.41);
    cyl(ink, x - 0.07, 1.095, deskZ, 0.39, 0.016, 0.39);
    const lp = new T.Mesh(new T.CircleGeometry(0.195, 64), recordLabel());
    lp.rotation.x = -Math.PI / 2;
    lp.position.set(x - 0.07, 1.105, deskZ);
    scene.add(lp);
    platters.push(lp);
    cyl(chrome, x - 0.07, 1.115, deskZ, 0.01, 0.02, 0.01);
    for (let j = 0; j < 22; j++)
      box(
        chrome,
        x + 0.17 * Math.sin(j * 0.285) - 0.07,
        1.092,
        deskZ + 0.18 * Math.cos(j * 0.285),
        0.006,
        0.004,
        0.006,
      );
    cyl(chrome, x + 0.23, 1.12, deskZ - 0.13, 0.055, 0.045, 0.055);
    box(chrome, x + 0.18, 1.15, deskZ - 0.02, 0.015, 0.015, 0.24, 0, -0.36);
  }
  box(ink, deskX, 1.026, deskZ, 0.48, 0.095, 0.47);
  for (let i = 0; i < 6; i++)
    for (let j = 0; j < 4; j++)
      cyl(
        j === 0 ? brass : graphite,
        deskX - 0.18 + i * 0.065,
        1.09,
        deskZ - 0.14 + j * 0.073,
        0.03,
        0.037,
        0.03,
      );
  // Keep the furniture fixed when Silas stands up to attend the alternate performance.
  const lounge = props.chair.clone();
  lounge.position.set(-5.45, 0, 1.31);
  lounge.rotation.y = 0.78;
  lounge.scale.setScalar(0.88);
  scene.add(lounge);
  const secondChair = props.chair.clone();
  secondChair.position.set(-7.22, 0, 0.76);
  secondChair.rotation.y = 1.29;
  scene.add(secondChair);
  cyl(ink, -6.14, 0.26, 1.7, 0.065, 0.45, 0.065);
  cyl(brass, -6.14, 0.048, 1.7, 0.34, 0.027, 0.34);
  cyl(walnut, -6.14, 0.51, 1.7, 0.8, 0.055, 0.8);
  const tumbler = finish("#bba47b", 0.19, 0.45);
  cyl(tumbler, -6.13, 0.604, 1.66, 0.085, 0.126, 0.085);
  box(records[1], -6.25, 0.548, 1.81, 0.18, 0.016, 0.27, 0, -0.4);
  // Dark aluminium glazing frames a strip of night city along the right return.
  box(ink, 8.1, 0.27, -0.12, 0.09, 0.54, 5.69);
  for (let i = 0; i < 8; i++)
    box(graphite, 8, 1.9, -2.78 + i * 0.78, 0.12, 3.82, 0.047);
  const spriteCanvas = document.createElement("canvas");
  spriteCanvas.width = spriteCanvas.height = 128;
  const gc = spriteCanvas.getContext("2d"),
    halo = gc.createRadialGradient(64, 64, 0, 64, 64, 64);
  halo.addColorStop(0, "rgba(254,211,155,.29)");
  halo.addColorStop(0.27, "rgba(238,165,101,.12)");
  halo.addColorStop(1, "rgba(235,145,85,0)");
  gc.fillStyle = halo;
  gc.fillRect(0, 0, 128, 128);
  const haloMap = new T.CanvasTexture(spriteCanvas);
  haloMap.colorSpace = T.SRGBColorSpace;
  const haloMat = new T.SpriteMaterial({
    map: haloMap,
    transparent: true,
    blending: T.AdditiveBlending,
    depthWrite: false,
  });
  for (const pos of bulbs) {
    const glow = new T.Sprite(haloMat);
    glow.position.set(...pos);
    glow.position.z += 0.17;
    glow.scale.set(1.56, 1.56, 1);
    scene.add(glow);
  }
  for (const b of batches.values()) {
    const mesh = new T.InstancedMesh(b.geo, b.mat, b.items.length);
    b.items.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.castShadow = !b.mat.emissive || b.mat.emissive.getHex() === 0;
    mesh.receiveShadow = true;
    scene.add(mesh);
  }
  return (dt, playing) => {
    if (playing)
      for (const lp of platters) lp.rotation.z -= dt * Math.PI * 1.11;
  };
}
