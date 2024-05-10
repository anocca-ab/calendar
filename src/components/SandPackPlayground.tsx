import { Sandpack } from "@codesandbox/sandpack-react";
import calendarRaw from "@site/src/components/calendar/build-sandpack/index";

const codeString = `import { FlexRow, Calendar } from "@internals/calendar";

export default function () {
  return (
    <FlexRow width="100%" p={4}>
      <Calendar />
    </FlexRow>
  );
}`;

export function SandPackPlayground() {
  return (
    <Sandpack
      template="react-ts"
      files={{
        "/components/index.js": `import { FlexRow, Calendar } from "@internals/calendar";

        export default function () {
          return (
            <FlexRow width="100%" p={4}>
              <Calendar />
            </FlexRow>
          );
        }`,
        "/node_modules/@internals/calendar/package.json": {
          hidden: true,
          code: JSON.stringify({
            name: "@calendar",
            main: "./index.js",
          }),
        },
        "/node_modules/@internals/calendar/index.js": {
          hidden: true,
          code: calendarRaw,
        },
      }}
    />
  );
}
