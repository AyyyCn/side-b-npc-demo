import { build } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const path = (name) => fileURLToPath(new URL(name, import.meta.url));
const built = await build({
  entryPoints: [path("play.js")],
  bundle: true,
  minify: true,
  banner: {
    js:
      "/*!\n" +
      (await readFile(path("THIRD_PARTY_NOTICES.txt"), "utf8")) +
      "\n*/",
  },
  write: false,
  platform: "browser",
  loader: { ".glb": "binary", ".webp": "dataurl" },
});
const shell = await readFile(path("frame.html"), "utf8");
const html = shell.replace("/* GAME */", () =>
  built.outputFiles[0].text.replace(/<\/script/gi, "<\\/script"),
);
await writeFile(process.argv[2] || path("play.html"), html);
