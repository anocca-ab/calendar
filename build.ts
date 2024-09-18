import { Glob, $ } from "bun";
import { mkdir, rmdir } from "node:fs/promises";
import path from "node:path";

const baseDir = "lib-out";

const glob = new Glob("**/*.{ts,tsx}");

for await (const file of new Glob("**").scan({
  cwd: baseDir,
  absolute: true,
  dot: true,
})) {
  if (file.includes("node_modules")) {
    continue;
  }
  await $`rm -rf ${file}`;
}

await mkdir(baseDir, { recursive: true });

const packageJson = await Bun.file("package.json").json();

await Bun.write(
  path.join(baseDir, "package.json"),
  JSON.stringify(
    {
      name: packageJson.name,
      version: packageJson.version,
      license: "MIT",
      main: "dist/cjs/index.js",
      module: "dist/esm/index.js",
      exports: {
        ".": {
          import: "./dist/esm/index.js",
          require: "./dist/cjs/index.js",
        },
      },
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
    2
  )
);
for (const props of [
  {
    type: "esm",
    compilerOptions: { module: "esnext", outDir: "dist/esm", target: "esnext" },
  },
  {
    type: "cjs",
    compilerOptions: {
      module: "commonjs",
      outDir: "dist/cjs",
      target: "es2015",
    },
  },
]) {
  await Bun.write(
    path.join(baseDir, `tsconfig-${props.type}.json`),
    JSON.stringify(
      {
        compilerOptions: {
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: false,
          skipLibCheck: true,
          strict: true,
          noEmit: false,
          sourceMap: false,
          esModuleInterop: true,
          moduleResolution: "node",
          resolveJsonModule: true,
          isolatedModules: false,
          downlevelIteration: true,
          jsx: "react-jsx",
          pretty: true,
          incremental: true,
          declaration: true,
          declarationMap: true,
          paths: {
            "@/components/*": ["./*"],
          },
          ...props.compilerOptions,
        },
        include: ["**/*.ts", "**/*.tsx", "global.d.ts"],
        exclude: ["node_modules"],
      },
      null,
      2
    )
  );
}

async function replaceAsync(
  str: string,
  regex: RegExp,
  asyncFn: (...args: any[]) => Promise<any>
) {
  const promises: Promise<any>[] = [];

  str.replaceAll(regex, (full, ...args) => {
    promises.push(asyncFn(full, ...args));
    return full;
  });

  const data = await Promise.all(promises);
  return str.replaceAll(regex, () => data.shift());
}

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
    `from $1${relPath === "" ? "." : relPath}/`
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
    "export { CalendarNav } from './nav/calendar_nav';",
    "export { TimelineNav, allResolutions, speeds } from './nav/timeline_nav';",
    "export { calendarTheme } from './theme';",
    "export type { CalendarEvent, StartDay, TimelineResolution, TimelineSpeed } from './types';",
    "export type { WeekCalendarProps } from './week_calendar/week_calendar';",
    "export type { MonthCalendarProps } from './month_calendar/month_calendar';",
    "export type { TimelineProps } from './timeline/timeline';",
    "export { minRenderedEventDuration, eventsOverlaps, eventsToRows } from './events_to_rows';",
    "export type { PartialEvent } from './events_to_rows';",
  ].join("\n") + "\n"
);

const extraDateType = `
interface PickerValidDateLookup {
  "date-fns": Date;
}
`;
$`${extraDateType} >> ${path.join(
  baseDir,
  "node_modules/@mui/x-date-pickers/models/pickers.d.ts"
)}`;

await Bun.write(
  path.join(baseDir, "global.d.ts"),
  Bun.file("nextjs/global.d.ts")
);

await Bun.write(
  path.join(baseDir, ".npmrc"),
  [
    "registry=https://verdaccio--kube.anocca.com/",
    "//verdaccio--kube.anocca.com/:_authToken=fake",
    "always-auth=false",
  ].join("\n") + "\n"
);

await Bun.write(path.join(baseDir, "README.md"), Bun.file("README.md"));

await $`cd ${baseDir} && bunx tsc -p tsconfig-esm.json && bunx tsc -p tsconfig-cjs.json`;

for (const type of ["esm", "cjs"]) {
  await Bun.write(
    path.join(baseDir, "dist", type, "package.json"),
    JSON.stringify(
      {
        type: type === "esm" ? "module" : "commonjs",
      },
      null,
      2
    )
  );
}

await Bun.write(
  path.join(baseDir, ".npmignore"),
  [".npmrc", "tsconfig.json", "tsconfig-esm.json", "tsconfig-cjs.json"].join(
    "\n"
  ) + "\n"
);

for await (const file of new Glob("**/*.js").scan(
  path.join(baseDir, "dist/esm")
)) {
  const dir = path.parse(file).dir;

  const fileDir = path.join(baseDir, "dist/esm", dir);
  const f = Bun.file(path.join(baseDir, "dist/esm", file));

  const content = await replaceAsync(
    await f.text(),
    /from (["'])([^"']+)(["'])/gm,
    async (match, p1, p2, p3) => {
      if (!p2.startsWith(".")) {
        return match;
      }

      const fPaths = ["js"].map((ext) => [
        path.join(fileDir, p2) + "." + ext,
        ext,
      ]);
      for (const [fPath, ext] of fPaths) {
        if (await Bun.file(fPath).exists()) {
          return `from ${p1}${p2}.${ext}${p3}`;
        }
      }

      return match;
    }
  );

  await Bun.write(path.join(baseDir, "dist/esm", file), content);
}

await $`cd ${baseDir} && npm publish --always-auth=false --registry=https://verdaccio--kube.anocca.com/ --access=public`;

// publish using cd lib-out && npm publish --always-auth=false --registry=https://verdaccio--kube.anocca.com/ --access=public
