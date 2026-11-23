import * as T from "three";
function texture(draw, size) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d"), size);
  const map = new T.CanvasTexture(c);
  map.colorSpace = T.SRGBColorSpace;
  map.anisotropy = 8;
  return map;
}
export function sleeveMaterial() {
  const map = texture((g, s) => {
    g.fillStyle = "#d4bc91";
    g.fillRect(0, 0, s, s);
    g.fillStyle = "#263f44";
    g.fillRect(19, 19, s - 38, s - 38);
    g.save();
    g.beginPath();
    g.rect(28, 110, s - 56, s - 160);
    g.clip();
    for (let i = 0; i < 54; i++) {
      g.strokeStyle = i % 8 < 4 ? "#cc7b4d" : "#d6c7a2";
      g.lineWidth = 2.0;
      g.beginPath();
      g.ellipse(
        s * 0.57,
        s * 0.64,
        i * 6 + 4,
        i * 3.4 + 5,
        -0.58,
        0,
        2 * Math.PI,
      );
      g.stroke();
    }
    g.restore();
    g.fillStyle = "#eee1c0";
    g.font = "600 41px Helvetica,Arial";
    g.fillText("Night Shift", 34, 73);
    g.font = "14px Helvetica,Arial";
    g.fillText("LARK    /    AFTER HOURS", 36, 97);
  }, 512);
  return new T.MeshStandardMaterial({ map, roughness: 0.78 });
}
export function recordLabel() {
  const map = texture((g, s) => {
    const mid = s / 2;
    g.translate(mid, mid);
    const bands = g.createConicGradient(0.65, 0, 0);
    [
      [0, "#181b20"],
      [0.15, "#37383a"],
      [0.24, "#777367"],
      [0.28, "#3a3c42"],
      [0.49, "#101419"],
      [0.7, "#3c4146"],
      [0.77, "#72757a"],
      [0.85, "#31383b"],
      [1, "#181b20"],
    ].forEach(([n, c]) => bands.addColorStop(n, c));
    g.fillStyle = bands;
    g.fillRect(-mid, -mid, s, s);
    for (let i = 55; i < mid - 3; i += 1.8) {
      g.beginPath();
      g.arc(0, 0, i, 0, 2 * Math.PI);
      g.strokeStyle = i % 9 < 3 ? "#11151a94" : "#c4bba648";
      g.lineWidth = 0.65;
      g.stroke();
    }
    g.fillStyle = "#c98055";
    g.beginPath();
    g.arc(0, 0, s * 0.21, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#231c18";
    g.textAlign = "center";
    g.font = "bold 46px Helvetica,Arial";
    g.fillText("SIDE B", 0, -12);
    g.font = "12px Helvetica,Arial";
    g.fillText("LISTENING ROOM", 0, 44);
    g.fillStyle = "#211d1a";
    g.beginPath();
    g.arc(0, 0, 5, 0, Math.PI * 2);
    g.fill();
  }, 768);
  return new T.MeshStandardMaterial({ map, roughness: 0.46, metalness: 0.32 });
}
