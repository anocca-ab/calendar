import React from "react";
import * as Calendar from "@site/src/components/calendar/index";
import * as Wrappers from "@site/src/components/wrappers";
import * as MUI from "@mui/material";

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  ...Calendar,
  ...Wrappers,
  ...MUI,
};

export default ReactLiveScope;
