import harper from "../art/harper.glb";
import maya from "../art/maya.glb";
import sam from "../art/sam.glb";
import jordan from "../art/jordan.glb";
export const characterModels = { harper, maya, sam, jordan };
export async function loadModels(loader, files) {
  const entries = await Promise.all(
    Object.entries(files).map(async ([key, bytes]) => [
      key,
      await loader.parseAsync(
        bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength,
        ),
        "",
      ),
    ]),
  );
  return Object.fromEntries(entries);
}
