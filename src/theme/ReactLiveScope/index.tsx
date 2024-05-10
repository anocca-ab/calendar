import React from "react";
import * as Calendar from "@site/src/components/calendar/index";
import * as MUI from "@mui/material";
import * as ReactIcons from "react-icons/md";

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  ...Calendar,
  ...MUI,
  ...ReactIcons,
};

export default ReactLiveScope;
