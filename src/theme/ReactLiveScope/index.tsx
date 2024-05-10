import React from "react";
import * as Calendar from "@site/src/components/calendar/index";
import * as Wrappers from "@site/src/components/wrappers";
import * as MUI from "@mui/material";
import * as ReactIcons from "react-icons/md";

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  ...Calendar,
  ...Wrappers,
  ...MUI,
  ...ReactIcons,
};

export default ReactLiveScope;
