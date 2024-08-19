import { TimelineResolution } from "../types";

export const timelineGridHeight = (props: {
  resolution: TimelineResolution;
  empty: boolean;
  height: number;
}) => {
  let height = props.height;
  return height;
};

export const timelineHeaderHeight = (props: {
  resolution: TimelineResolution;
}) => {
  if (props.resolution === "month") {
    return 56 + 18;
  }
  if (props.resolution === "3-months") {
    return 60 + 20 + 2 + 4;
  }
  if (props.resolution === "year" || props.resolution === "3-years") {
    return 56 + 20 + 2 + 4;
  }
  return 0;
};
