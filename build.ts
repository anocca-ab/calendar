import { Glob, $ } from "bun";
import { mkdir, rmdir } from "node:fs/promises";
import path from "node:path";

const glob = new Glob("**/*.{ts,tsx}");

await rmdir("lib-out", { recursive: true });
await mkdir("lib-out", { recursive: true });

await Bun.write(
  "lib-out/package.json",
  JSON.stringify(
    {
      name: "@anocca/calendar",
      version: "0.0.1",
      license: "MIT",
      main: "build/index.js",
      module: "build/index.js",
      types: "build/index.d.ts",
      description: "A calendar component for React",
      title: "Calendar",
      author: "Anocca",
      peerDependencies: {
        "@mui/material": "^5",
        "@mui/x-date-pickers": "^7",
        "date-fns": "^3",
        react: "^18",
      },
      devDependencies: {
        typescript: "^5",
        "@types/node": "^20",
        "@types/react": "^18",
        "@types/react-dom": "^18",
      },
    },
    null,
    2,
  ),
);
await Bun.write(
  "lib-out/tsconfig.json",
  JSON.stringify(
    {
      compilerOptions: {
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: false,
        skipLibCheck: true,
        strict: true,
        noEmit: false,
        outDir: "build",
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "node",
        resolveJsonModule: true,
        isolatedModules: false,
        downlevelIteration: true,
        jsx: "preserve",
        incremental: true,
        declaration: true,
        declarationMap: true,
        paths: {
          "@/components/*": ["./*"],
        },
      },
      include: ["**/*.ts", "**/*.tsx", "global.d.ts"],
      exclude: ["node_modules"],
    },
    null,
    2,
  ),
);

for await (const file of glob.scan("nextjs/components")) {
  if (file.includes(".test.")) {
    continue;
  }
  const dir = path.parse(file).dir;
  const outDir = path.join("lib-out", dir);
  await mkdir(outDir, { recursive: true });
  const f = Bun.file(path.join("nextjs/components", file));
  await Bun.write(path.join("lib-out", file), f);
}

await Bun.write("lib-out/bun.lockb", Bun.file("lib-out.lockb"));

await $`cd lib-out && bun install`;

await Bun.write("lib-out.lockb", Bun.file("lib-out/bun.lockb"));

await Bun.write(
  "lib-out/index.ts",
  [
    "export { WeekCalendar } from './week_calendar/week_calendar';",
    "export { MonthCalendar } from './month_calendar/month_calendar';",
    "export { Timeline } from './timeline/timeline';",
  ].join("\n") + "\n",
);

const extraDateType = `
interface PickerValidDateLookup {
  "date-fns": Date;
}
`;
$`${extraDateType} >> lib-out/node_modules/@mui/x-date-pickers/models/pickers.d.ts`;

await Bun.write("lib-out/global.d.ts", Bun.file("nextjs/global.d.ts"));

await $`cd lib-out && bunx tsc`;
