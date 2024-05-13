import { Sandpack } from "@codesandbox/sandpack-react";
import calendarRaw from "!!raw-loader!./calendar/build-sandpack/index.js";

const codeString = `
import { FlexRow, Calendar } from "@internals/calendar";

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
      customSetup={{
        dependencies: {
          "@mui/material": "latest",
          "@emotion/styled": "latest",
          "@emotion/react": "latest",
          "react-icons": "latest",
        },
      }}
      files={{
        "App.tsx": codeString,
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
