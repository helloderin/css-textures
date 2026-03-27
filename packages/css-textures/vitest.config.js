import { defineConfig } from "vitest/config";
import { readFileSync } from "fs";

export default defineConfig({
  test: {
    environment: "jsdom",
    css: { include: [/\.css$/] },
  },
  plugins: [
    {
      name: "css-as-text",
      enforce: "post",
      transform(_, id) {
        if (id.endsWith(".css")) {
          const content = readFileSync(id, "utf-8");
          return `export default ${JSON.stringify(content)}`;
        }
      },
    },
  ],
});
