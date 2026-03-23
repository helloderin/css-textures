// Produces dist/index.js (ESM), dist/index.cjs (CJS)

import { build } from "esbuild";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// ─── JS bundles (ESM + CJS) ───
await build({
  entryPoints: [join(root, "src/index.js")],
  bundle: true,
  format: "esm",
  outfile: join(root, "dist/index.js"),
  minify: true,
});
console.log("✓  dist/index.js       ESM bundle");

await build({
  entryPoints: [join(root, "src/index.js")],
  bundle: true,
  format: "cjs",
  outfile: join(root, "dist/index.cjs"),
  minify: true,
});
console.log("✓  dist/index.cjs      CJS bundle");
