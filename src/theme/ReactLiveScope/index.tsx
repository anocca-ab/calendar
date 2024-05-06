import React from "react";
import { CalendarEntry } from "@site/src/components/calendar/calendar_entry";
import { FlexCol, FlexRow } from "@site/src/components/wrappers";

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  CalendarEntry,
  FlexRow,
  FlexCol,
};

export default ReactLiveScope;
