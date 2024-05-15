import calendarRaw from "!!raw-loader!../calendar/build-sandpack/index.js";
import muiRaw from "!!raw-loader!./dependencies/material-ui.development.js";

export const commonFiles = {
  "/node_modules/@anocca/calendar/package.json": {
    hidden: true,
    code: JSON.stringify({
      name: "@calendar",
      main: "./index.js",
    }),
  },
  "/node_modules/@anocca/calendar/index.js": {
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
