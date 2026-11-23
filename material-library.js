import * as T from "three";
import parquetDiffuse from "./art/materials/parquet-diff.webp";
import parquetNormal from "./art/materials/parquet-normal.webp";
import parquetRough from "./art/materials/parquet-rough.webp";
import walnutDiffuse from "./art/materials/wood-diff.webp";
import walnutNormal from "./art/materials/wood-normal.webp";
import walnutRough from "./art/materials/wood-rough.webp";
import stoneDiffuse from "./art/materials/stone-diff.webp";
import stoneNormal from "./art/materials/stone-normal.webp";
import stoneRough from "./art/materials/stone-rough.webp";
import wallDiffuse from "./art/materials/wall-diff.webp";
import wallNormal from "./art/materials/wall-normal.webp";
import wallRough from "./art/materials/wall-rough.webp";

export async function venueMaterials() {
  const loader = new T.TextureLoader();
  async function pbr(
    [color, normal, rough],
    repeat,
    tint,
    strength,
    roughness,
  ) {
    const maps = await Promise.all(
      [color, normal, rough].map((url) => loader.loadAsync(url)),
    );
    for (const t of maps) {
      t.wrapS = t.wrapT = T.RepeatWrapping;
      t.repeat.set(...repeat);
      t.anisotropy = 8;
    }
    maps[0].colorSpace = T.SRGBColorSpace;
    return new T.MeshStandardMaterial({
      map: maps[0],
      normalMap: maps[1],
      roughnessMap: maps[2],
      normalScale: new T.Vector2(strength, strength),
      roughness,
      color: tint,
    });
  }
  const [floor, wood, stone, plaster] = await Promise.all([
    pbr(
      [parquetDiffuse, parquetNormal, parquetRough],
      [11, 8],
      0x7b7975,
      0.55,
      0.61,
    ),
    pbr(
      [walnutDiffuse, walnutNormal, walnutRough],
      [1.8, 1],
      0xdabfa2,
      0.25,
      0.61,
    ),
    pbr([stoneDiffuse, stoneNormal, stoneRough], [3, 1], 0x8f8a80, 0.25, 0.55),
    pbr([wallDiffuse, wallNormal, wallRough], [4, 2], 0x716355, 0.37, 0.96),
  ]);
  return { floor, wood, stone, plaster };
}
