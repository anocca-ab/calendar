import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["./src/components/calendar/index.ts"], // your library path
    treeshake: true,
    minify: true,
    verbose: true,
    dts: true,
    external: ["react", "react-dom"],
    clean: true,
    outDir: "./src/components/calendar/build-sandpack/", // build output
    tsconfig: "./tsup.tsconfig.json",
  },
]);
