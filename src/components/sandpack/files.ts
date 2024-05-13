import calendarRaw from "!!raw-loader!../calendar/build-sandpack/index.js";
import muiRaw from "!!raw-loader!./material-ui.production.min.js";

const AppTsx = `
import TestTsx from './TestTsx.tsx'
import { FlexCol, Calendar } from "@internals/calendar";

export default function App () {
  return (
    <FlexCol width="100%" p={4}>
      <TestTsx name='Anocca' />
      <Calendar />
    </FlexCol>
  );
}
`;

const TestTsx = `
export default function TestTsx ({ name }) {
  return <h1>{name} Calendar</h1>
}
`;

export const files = {
  "/App.tsx": {
    code: AppTsx,
  },
  "/TestTsx.tsx": {
    code: TestTsx,
  },
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
  "/node_modules/@mui/material/package.json": {
    hidden: true,
    code: JSON.stringify({
      name: "@mui/material",
      main: "./index.js",
    }),
  },
  "/node_modules/@mui/material/index.js": {
    hidden: true,
    code: muiRaw,
  },
};

export default files;
