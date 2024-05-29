import {
  Box,
  Typography,
  styled,
  type SxProps,
  type Theme,
} from "@mui/material";
import {
  addMinutes,
  addWeeks,
  areIntervalsOverlapping,
  compareAsc,
  compareDesc,
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  differenceInMinutes,
  format,
  getHours,
  getMinutes,
  isAfter,
  isBefore,
} from "date-fns";
import { ReactElement } from "react";
import { CalendarEvent } from "./components/calendar_body/components/calendar_event";
import {
  AllDayCalendarEventWithRange,
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
  currentFirstDayOfTheWeek: Date,
): CalendarEventWithRange[] {
  const eventsWithRange: CalendarEventWithRange[] = [];

  if (events.length > 0) {
    events.forEach((e, i) => {
      const leftPosition =
        differenceInCalendarDays(e.start, currentFirstDayOfTheWeek) * 120;
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
          left: 1 + leftPosition,
          height: `${1439 - topPosition}px`,
          event: e,
        });
        eventsWithRange.push({
          start: 1,
          end: 1 + eventDurationInMinutes - (1439 - topPosition),
          left: 121 + leftPosition,
          height: `${1 + eventDurationInMinutes - (1439 - topPosition) - 1}px`,
          event: e,
        });
      } else {
        eventsWithRange.push({
          start: topPosition,
          end: topPosition + eventDurationInMinutes,
          left: 1 + leftPosition,
          height:
            eventDurationInMinutes <= 15
              ? "15px"
              : `${eventDurationInMinutes}px`,
          event: e,
        });
      }
    });
  }

  return eventsWithRange;
}

/**
 * Receives allDayEvents, calculates their width and left position and returns an array of AllDayCalendarEventWithRange
 *
 * @param events
 * @param currentFirstDayOfTheWeek
 * @param maxWidth
 * @returns
 */
export function getAllDayEventsWithRange(
  events: CalendarEventType[],
  currentFirstDayOfTheWeek: Date,
  maxWidth: number,
): AllDayCalendarEventWithRange[] {
  const eventsWithRange: AllDayCalendarEventWithRange[] = [];
  if (events.length > 0) {
    events.forEach((event, i) => {
      const diffInWeeks = differenceInCalendarWeeks(
        event.start,
        currentFirstDayOfTheWeek,
      );

      const leftPosition =
        differenceInCalendarDays(event.start, currentFirstDayOfTheWeek) * 120;

      const eventDurationInMins = differenceInMinutes(event.end!, event.start, {
        roundingMethod: "floor",
      });

      const eventDurationInHours = Math.floor(eventDurationInMins / 60);
      const eventDurationInDays = Math.floor(eventDurationInHours / 24);

      const eventWidth =
        eventDurationInDays > 1 ? eventDurationInDays * 120 - 10 : 110;
      const eventWidthWithLeft = eventWidth + leftPosition;
      const differenceWithMaxWidth =
        eventWidthWithLeft > maxWidth ? eventWidthWithLeft - maxWidth : 0;

      if (diffInWeeks === 0) {
        eventsWithRange.push({
          left: 1 + leftPosition,
          width: eventWidth - differenceWithMaxWidth,
          event,
        });
      } else if (diffInWeeks === -1) {
        eventsWithRange.push({
          left: 1,
          width:
            (differenceInCalendarDays(event.end!, currentFirstDayOfTheWeek) +
              1) *
              120 -
            10,

          event,
        });
      }
    });
  }
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
  if (events.length > 0) {
    const sortedEvents = events.sort(function (a, b) {
      const startA = a.event.start;
      const endA = a.event.end;
      const startB = b.event.start;
      const endB = b.event.end;
      // const comparison = compareAsc(startA, startB);
      const comparisonOnStart = compareAsc(startA, startB);
      const comparisonOnEnd = compareDesc(
        endA ?? addMinutes(startA, 15),
        endB ?? addMinutes(startB, 15),
      );
      if (a.left > b.left) {
        return comparisonOnStart === 0 ? comparisonOnEnd : comparisonOnStart;
      }
      return -1;
    });

    rangedEventsGroups[group] = [sortedEvents[0]];

    for (let i = 1, l = sortedEvents.length; i < l; i++) {
      if (
        areIntervalsOverlapping(
          {
            start: sortedEvents[i].event.start,
            end:
              sortedEvents[i].event.end ??
              addMinutes(sortedEvents[i].event.start, 15),
          },
          {
            start: sortedEvents[i - 1].event.start,
            end:
              sortedEvents[i - 1].event.end ??
              addMinutes(sortedEvents[i - 1].event.start, 15),
          },
          { inclusive: true },
        ) &&
        sortedEvents[i].left === sortedEvents[i - 1].left
      ) {
        rangedEventsGroups[group].push(sortedEvents[i]);
      } else {
        group++;
        rangedEventsGroups[group] = [sortedEvents[i]];
      }
    }
  }
  return rangedEventsGroups;
}

/**
 *
 * @param filteredEvents
 * @returns
 */
export function partitionAllDayEventsOnRanges(
  filteredEvents: AllDayCalendarEventWithRange[],
): AllDayCalendarEventWithRange[][] {
  const rangedEventsGroups: AllDayCalendarEventWithRange[][] = [];
  let allDayEventsRows = 0;

  const sortedEvents = filteredEvents.sort(function (a, b) {
    if (
      isBefore(a.event.start, b.event.start) &&
      a.event.end &&
      b.event.end &&
      isBefore(a.event.end, b.event.end)
    )
      return -1;
    if (
      isAfter(a.event.start, b.event.start) &&
      a.event.end &&
      b.event.end &&
      isAfter(a.event.end, b.event.end)
    )
      return 1;
    return 0;
  });

  rangedEventsGroups[allDayEventsRows] = [sortedEvents[0]];

  for (let i = 1, l = sortedEvents.length; i < l; i++) {
    if (isAfter(sortedEvents[i].event.start, sortedEvents[i - 1].event.end!)) {
      rangedEventsGroups[allDayEventsRows].push(sortedEvents[i]);
    } else {
      allDayEventsRows++;
      rangedEventsGroups[allDayEventsRows] = [sortedEvents[i]];
    }
  }

  return rangedEventsGroups;
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
                left: event.left, //+ leftPosition,
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
        let rangedEventsGroups: CalendarEventWithRange[][] = [];

        let groupNr = 1;

        const sortedgroup = group.sort(function (a, b) {
          const startA = a.event.start;
          const endA = a.event.end;

          const startB = b.event.start;
          const endB = b.event.end;
          const comparisonOnStart = compareAsc(startA, startB);
          const comparisonOnEnd = compareDesc(
            endA ?? addMinutes(startA, 15),
            endB ?? addMinutes(startB, 15),
          );
          if (comparisonOnStart === 0) {
            return comparisonOnEnd;
          }
          return comparisonOnStart;
        });

        if (sortedgroup.length > 0) {
          rangedEventsGroups[0] = [sortedgroup[0]];
          rangedEventsGroups[1] = [sortedgroup[1]];

          for (let i = 2, l = sortedgroup.length - 1; i <= l; i++) {
            if (
              sortedgroup[i] &&
              !areIntervalsOverlapping(
                {
                  start: sortedgroup[i].event.start,
                  end:
                    sortedgroup[i].event.end ??
                    addMinutes(sortedgroup[i].event.start, 15),
                },
                {
                  start: sortedgroup[i - 1].event.start,
                  end:
                    sortedgroup[i - 1].event.end ??
                    addMinutes(sortedgroup[i - 1].event.start, 15),
                },
                { inclusive: true },
              )
            ) {
              if (rangedEventsGroups[groupNr]) {
                rangedEventsGroups[groupNr].push(sortedgroup[i]);
              } else {
                rangedEventsGroups[groupNr] = [sortedgroup[i]];
              }
            } else {
              groupNr++;
              rangedEventsGroups[groupNr] = [sortedgroup[i]];
            }
          }
        }

        const n = rangedEventsGroups.length;
        const b = 110 / n;
        const c = 110 - (0.8 * b) / 2;
        const a = (c / (n - 1)) * 1.5 - (0.8 * b) / 2 / 4;

        rangedEventsGroups.forEach((groupedEvents, groupIndex) => {
          groupedEvents.forEach((event, eventIndex) => {
            events.push(
              <Box
                key={numOfEvents + 1}
                sx={{
                  top: event.start,
                  left: event.left + groupIndex * b,
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
                    { width: n - 1 != groupIndex ? a : b },
                  )}
                />
              </Box>,
            );
            numOfEvents += 1;
          });
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

export function filterWeekEvents(
  events: CalendarEventType[],
  currentFirstDayOfTheWeek: Date,
) {
  const filteredEvents: CalendarEventType[] = [];
  events.forEach((event) => {
    const doesWeekOverlapWithEvent = areIntervalsOverlapping(
      {
        start: currentFirstDayOfTheWeek,
        end: addWeeks(currentFirstDayOfTheWeek, 1),
      },
      { start: event.start, end: event.end! },
    );
    if (doesWeekOverlapWithEvent) {
      filteredEvents.push(event);
    }
  });
  return filteredEvents;
}

/**
 * This function compiles and returns the title/duration information shown on the event component.
 *
 * @param start
 * @param end
 * @returns
 */
export function formatDuration(start: Date, end?: Date) {
  if (!end) {
    return format(start, "h:mm");
  }

  const eventDurationInMinutes = differenceInMinutes(end, start, {
    roundingMethod: "floor",
  });
  const eventDurationInHours = Math.floor(eventDurationInMinutes / 60);
  const eventDurationInDays = Math.floor(eventDurationInHours / 24);

  const updatedStart = format(start, "h:mmaaa");
  const updatedEnd = format(end, "h:mmaaa");

  const formattedDuration =
    eventDurationInDays >= 1
      ? ""
      : eventDurationInMinutes >= 30
        ? `${format(start, "h:mm")} - ${updatedEnd}`
        : updatedStart;

  return formattedDuration;
}
