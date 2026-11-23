import { build } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const path = (name) => fileURLToPath(new URL(name, import.meta.url));
const worker = await build({
  entryPoints: [path("comparison/worker.js")],
  bundle: true,
  minify: true,
  write: false,
  platform: "browser",
});
const built = await build({
  entryPoints: [path("entry.js")],
  bundle: true,
  minify: true,
  banner: {
    js:
      "/*!\n" +
      (await readFile(path("THIRD_PARTY_NOTICES.txt"), "utf8")) +
      "\n*/",
  },
  define: { CROWD_WORKER_SOURCE: JSON.stringify(worker.outputFiles[0].text) },
  write: false,
  platform: "browser",
  loader: { ".glb": "binary", ".webp": "dataurl", ".html": "text" },
});
const shell = await readFile(path("frame.html"), "utf8");
await writeFile(
  process.argv[2] || path("play.html"),
  shell.replace("/* GAME */", () =>
    built.outputFiles[0].text.replace(/<\/script/gi, "<\\/script"),
  ),
);
