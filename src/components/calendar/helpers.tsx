import {
  Box,
  Typography,
  styled,
  type SxProps,
  type Theme,
} from "@mui/material";
import {
  differenceInCalendarDays,
  differenceInMinutes,
  getHours,
  getMinutes,
} from "date-fns";
import { ReactElement } from "react";
import { CalendarEvent } from "./components/calendar_body/components/calendar_event";
import {
  CalendarEvent as CalendarEventType,
  CalendarEventWithRange,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Sx = SxProps<any>;
type ArrayType<T> = T extends ReadonlyArray<infer U> ? U[] : never;
type SxArray = ArrayType<Sx>;

/**
 * Use this function to merge sx props
 * @public
 */
export function mergeSx(...sxs: (Sx | null | undefined | boolean)[]): Sx {
  const sx: SxArray = [];

  sxs.forEach((passedSx) => {
    if (!passedSx) {
      return;
    }
    if (Array.isArray(passedSx)) {
      sx.push(...passedSx);
    } else {
      sx.push(passedSx);
    }
  });

  return sx;
}

export const variationsToColorRecord: Record<string, string> = {
  orange: "#FF7043",
  indigo: "#5C6BC0",
  pink: "#EC407A",
  teal: "#26A69A",
  red: "#EF5350",
};

export const EventTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 500,
  fontSize: "10px",
  lineHeight: "14px",
  textAlign: "center",
  whiteSpace: "nowrap",
}));

/**
 * Receives events, calculates their ranges and returns an array of GridEventsWithRanges
 *
 * @param events
 * @returns
 */
export function getEventsWithRange(
  events: CalendarEventType[],
): CalendarEventWithRange[] {
  const eventsWithRange: CalendarEventWithRange[] = [];

  events.forEach((e, i) => {
    const hours = getHours(e.start);
    const minutes = getMinutes(e.start);
    const eventDurationInMinutes = e.end
      ? differenceInMinutes(e.end, e.start, {
          roundingMethod: "floor",
        })
      : 15;
    const diffInDays = e.end ? differenceInCalendarDays(e.end, e.start) : 0;

    const topPosition = hours * 60 + minutes;

    if (diffInDays > 0) {
      eventsWithRange.push({
        start: topPosition,
        end: 1439,
        left: 1,
        height: `${1439 - topPosition}px`,
        event: e,
      });
      eventsWithRange.push({
        start: 1,
        end: 1 + eventDurationInMinutes - (1439 - topPosition),
        left: 121,
        height: `${1 + eventDurationInMinutes - (1439 - topPosition) - 1}px`,
        event: e,
      });
    } else {
      eventsWithRange.push({
        start: topPosition,
        end: topPosition + eventDurationInMinutes,
        left: 1,
        height:
          eventDurationInMinutes <= 15 ? "15px" : `${eventDurationInMinutes}px`,
        event: e,
      });
    }
  });

  return eventsWithRange;
}

export function getAllDayEventsWithRange(
  events: CalendarEventType[],
  day: Date,
): {
  left: string;
  height: string;
  event: CalendarEventType;
}[] {
  const eventsWithRange: {
    left: string;
    height: string;
    event: CalendarEventType;
  }[] = [];

  events.forEach((e, i) => {
    const diffInDays = differenceInCalendarDays(e.start, day);

    eventsWithRange.push({
      left: `${diffInDays * 120}px`,
      height: "16px",
      event: e,
    });
  });

  return eventsWithRange;
}

/**
 * Receives an array of GridEventsWithRanges and returns an array of groups of events that overlap with each other
 *
 * @param events
 * @returns
 */
export function partitionGridEventsOnRanges(
  events: CalendarEventWithRange[],
): CalendarEventWithRange[][] {
  const rangedEventsGroups = [];
  let group = 0;

  const sortedEvents = events.sort(function (a, b) {
    if (a.start < b.start && a.left < b.left) return -1;
    if (a.start > b.start && a.left > b.left) return 1;
    return 0;
  });

  rangedEventsGroups[group] = [sortedEvents[0]];

  for (let i = 1, l = sortedEvents.length; i < l; i++) {
    const maxEnd = getMaxEnd(rangedEventsGroups[group]);
    if (
      sortedEvents[i].start >= sortedEvents[i - 1].start &&
      sortedEvents[i].start < maxEnd &&
      sortedEvents[i].left === sortedEvents[i - 1].left
    ) {
      rangedEventsGroups[group].push(sortedEvents[i]);
    } else {
      group++;
      rangedEventsGroups[group] = [sortedEvents[i]];
    }
  }
  return rangedEventsGroups;
}

function getMaxEnd(events: CalendarEventWithRange[]): number {
  const sortedEvents = events.sort(function (a, b) {
    if (a.end < b.end) {
      return 1;
    }
    if (a.end > b.end) {
      return -1;
    }
    return 0;
  });
  return sortedEvents[0].end;
}

/**
 * Receives groups of grouped events, calculates the sx props
 * of overlapping groups and returns an array of events
 *
 * @param groupsOfEvents
 * @returns
 */
export function transformEventsToComponents(
  groupsOfEvents: CalendarEventWithRange[][],
) {
  const events: ReactElement[] = [];
  let numOfEvents = 0;
  if (groupsOfEvents.length > 0) {
    groupsOfEvents.forEach((group) => {
      if (group.length < 2) {
        group.forEach((event) => {
          events.push(
            <Box
              key={numOfEvents + 1}
              sx={{
                top: event.start,
                left: event.left,
                position: "absolute",
              }}
            >
              <CalendarEvent
                {...event.event}
                sx={calculateEventProperties(
                  event.event.start,
                  event.height,
                  event.event.color ?? "orange",
                  event.event.end,
                )}
              />
            </Box>,
          );
          numOfEvents += 1;
        });
      } else {
        const n = group.length;
        const b = 110 / n;
        const c = 110 - (0.8 * b) / 2;
        const a = (c / (n - 1)) * 1.5 - (0.8 * b) / 2 / 4;

        group.forEach((event, i) => {
          events.push(
            <Box
              key={numOfEvents + 1}
              sx={{
                top: event.start,
                left: event.left + i * b,
                position: "absolute",
              }}
            >
              <CalendarEvent
                {...event.event}
                sx={mergeSx(
                  calculateEventProperties(
                    event.event.start,
                    event.height,
                    event.event.color ?? "orange",
                    event.event.end,
                  ),
                  { width: n - 1 != i ? a : b },
                )}
              />
            </Box>,
          );
          numOfEvents += 1;
        });
      }
    });
  }

  return events;
}

/**
 * A function to calculate the event's CSS properties
 *
 * @param start
 * @param height
 * @param color
 * @param end
 * @returns
 */
export function calculateEventProperties(
  start: Date,
  height: string,
  color: string,
  end?: Date,
): SxProps<Theme> {
  const eventDurationInMinutes = end
    ? differenceInMinutes(end, start, {
        roundingMethod: "floor",
      })
    : 15;

  // event component base sx props
  const baseSxProps: SxProps<Theme> = {
    height,
    display: "flex",
    padding: "0px 8px",
    alignItems: "center",
    position: "absolute",
    borderRadius: "4px",
    overflow: "hidden",
    backgroundColor: variationsToColorRecord[color],
    width: "110px",
    maxWidth: "110px",
    minHeight: "15px",
    border: "1px solid #FFF",
  };

  // if the hours are 0 then there must be minutes
  if (eventDurationInMinutes <= 15) {
    const sxProps: SxProps<Theme> = {
      ...baseSxProps,
      gap: "8px",
    };

    return sxProps;
  }
  if (eventDurationInMinutes <= 29 && eventDurationInMinutes > 15) {
    const sxProps: SxProps<Theme> = {
      ...baseSxProps,
      gap: "8px",
    };

    return sxProps;
  }
  if (eventDurationInMinutes >= 30 && eventDurationInMinutes < 36) {
    const sxProps: SxProps<Theme> = {
      ...baseSxProps,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
    };

    return sxProps;
  }
  if (eventDurationInMinutes >= 36) {
    const sxProps: SxProps<Theme> = {
      ...baseSxProps,
      padding: "4px 8px",
      flexDirection: "column",
      alignItems: "flex-start",
    };

    return sxProps;
  }

  return baseSxProps;
}
