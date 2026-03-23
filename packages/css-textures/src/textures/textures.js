import { createTexture } from "../createTexture.js";
import leatherCSS from "./css/leather.css";

export const leather = createTexture({
  id: "leather",
  css: leatherCSS,
  vars: {
    "--texture-scale": "Tile size in px (default: 200px)",
    "--texture-intensity": "Overlay opacity 0–1 (default: 0.6)",
  },
});
