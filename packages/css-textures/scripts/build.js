// Produces dist/index.js (ESM), dist/index.cjs (CJS), dist/textures.css

import { build } from "esbuild";
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

mkdirSync(join(root, "dist/textures"), { recursive: true });

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

// ─── CSS files ───
const cssDirectory = join(root, "src/textures/css");
const cssFiles = readdirSync(cssDirectory).filter((file) =>
  file.endsWith(".css"),
);

let allCSS =
  "/* css-textures — https://github.com/helloderin/css-textures */\n\n";

for (const file of cssFiles) {
  const id = file.replace(/\.css$/, "");
  const css = readFileSync(join(cssDirectory, file), "utf8").trim();

  writeFileSync(
    join(root, `dist/textures/${id}.css`),
    `/* css-textures/${id} */\n${css}\n`,
  );
  allCSS += `/* ${id} */\n${css}\n\n`;
}
console.log("✓  dist/textures/*.css individual textures");

writeFileSync(join(root, "dist/textures.css"), allCSS);
console.log("✓  dist/textures.css   all textures");
