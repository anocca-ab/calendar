// /Users/richard.samuelsson/projects/aimos/front-end/common/temp/node_modules/.pnpm/file+..+..+..+..+calendar+lib-out_@mui+material@5.11.4_date-fns@2.17.0_react@18.2.0/node_modules/@anocca/calendar

import { Glob } from "bun";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const targetDir = process.env.TARGET_DIR;
if (!targetDir) {
  throw new Error("required target dir missing");
}
const baseDir = "lib-out";

const glob = new Glob("**/*");

for await (const file of glob.scan(baseDir)) {
  if (file.includes("node_modules")) {
    continue;
  }
  const dir = path.parse(file).dir;

  const outDir = path.join(targetDir, dir);

  await mkdir(outDir, { recursive: true });

  const f = Bun.file(path.join(baseDir, file));

  await Bun.write(path.join(targetDir, file), f);
}
