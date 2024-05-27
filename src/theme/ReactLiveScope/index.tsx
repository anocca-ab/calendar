import React from "react";
import * as Calendar from "@site/src/components/calendar/index";
import * as MUI from "@mui/material";
import * as datefns from "date-fns";

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  ...Calendar,
  ...MUI,
  ...datefns,
};

export default ReactLiveScope;
