import { Glob, $ } from "bun";
import { mkdir, rmdir } from "node:fs/promises";
import path from "node:path";

const baseDir = "lib-out";

const glob = new Glob("**/*.{ts,tsx}");

await rmdir(baseDir, { recursive: true });
await mkdir(baseDir, { recursive: true });

const packageJson = await Bun.file("package.json").json();

await Bun.write(
  path.join(baseDir, "package.json"),
  JSON.stringify(
    {
      name: "@anocca/calendar",
      version: packageJson.version,
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
  path.join(baseDir, "tsconfig.json"),
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
        jsx: "react-jsx",
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
  const outDir = path.join(baseDir, dir);
  await mkdir(outDir, { recursive: true });
  const f = Bun.file(path.join("nextjs/components", file));
  const relPath = path.relative(outDir, baseDir);
  const content = (await f.text()).replaceAll(
    /from (["'])(@\/components\/)/gm,
    `from $1${relPath === "" ? "." : relPath}/`,
  );
  await Bun.write(path.join(baseDir, file), content);
}

await Bun.write(path.join(baseDir, "bun.lockb"), Bun.file("lib-out.lockb"));

await $`cd ${baseDir} && bun install`;

await Bun.write("lib-out.lockb", Bun.file(path.join(baseDir, "bun.lockb")));

await Bun.write(
  path.join(baseDir, "index.ts"),
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
$`${extraDateType} >> ${path.join(baseDir, "node_modules/@mui/x-date-pickers/models/pickers.d.ts")}`;

await Bun.write(
  path.join(baseDir, "global.d.ts"),
  Bun.file("nextjs/global.d.ts"),
);

await Bun.write(
  path.join(baseDir, ".npmrc"),
  [
    "registry=https://verdaccio--kube.anocca.com/",
    "//verdaccio--kube.anocca.com/:_authToken=fake",
    "always-auth=false",
  ].join("\n") + "\n",
);

await Bun.write(path.join(baseDir, "README.md"), Bun.file("README.md"));

await $`cd ${baseDir} && bunx tsc`;

await Bun.write(
  path.join(baseDir, ".npmignore"),
  [".npmrc", "tsconfig.json"].join("\n") + "\n",
);

await $`cd ${baseDir} && npm publish --always-auth=false --registry=https://verdaccio--kube.anocca.com/ --access=public`;

// publish using cd lib-out && npm publish --always-auth=false --registry=https://verdaccio--kube.anocca.com/ --access=public
