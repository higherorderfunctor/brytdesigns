import path from "node:path";
import fs from "node:fs/promises";
import { defineConfig } from "tsup";
import { generateDtsBundle } from "dts-bundle-generator";

const outDir = "dist";

const commonConfig = {
  minify: false,
  bundle: false,
  splitting: true,
  clean: true,
  treeshake: true,
  sourcemap: true,
};

export default defineConfig([
  {
    ...commonConfig,
    format: "esm",
    entry: ["src/effect/index.ts"],
    outDir: `${outDir}/effect`,
    async onSuccess() {
      const [effectDts] = generateDtsBundle([
        {
          filePath: path.resolve("./src/effect/index.ts"),
        },
      ], { preferredConfigPath: "./tsconfig.json"});

      await fs.writeFile(
        path.resolve(outDir, "effect", "index.d.ts"),
        effectDts,
      );
    },
  },
  {
    ...commonConfig,
    format: "esm",
    entry: ["src/index.ts"],
    outDir: outDir,
    async onSuccess() {
      const [indexDts] = generateDtsBundle([
        {
          filePath: path.resolve("./src/index.ts"),
        },
      ], { preferredConfigPath: "./tsconfig.json"});

      await fs.writeFile(path.resolve(outDir, "index.d.ts"), indexDts);
    },
  },
]);
