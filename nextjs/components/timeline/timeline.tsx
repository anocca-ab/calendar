import { Box, BoxProps, Button, Typography } from "@mui/material";
import {
  StartOfWeekOptions,
  addDays,
  addMinutes,
  addMonths,
  addWeeks,
  addYears,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  endOfDay,
  endOfYear,
  format,
  isSameDay,
  isSameWeek,
  max,
  min,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import React from "react";
import { eventGrid } from "../event_grid";
import { DEFAULT_COLOR, getEventEnd, mergeSx } from "../helpers";
import { CalendarEvent, StartDay, TimelineResolution } from "../types";
import { ModifiableEvent } from "../week_calendar/types";
import { useDragableEvents, useEffectRefs, useMouse } from "../use_mouse";
import { FlexCol, FlexRow } from "../wrappers";

const parseDefaultProps = (
  props: React.ComponentPropsWithRef<typeof Timeline>
) => {
  const events = props.events ?? [];
  let startDay = props.startDay ?? "monday";
  const now = props.now ?? new Date();

  const resolution = props.resolution ?? "month";

  return {
    events,
    startDay,
    startTime: props.startTime ?? new Date(),
    startOfWeek,
    resolution,
    now,
    onCreateEvent: props.onCreateEvent,
    onMoveEvent: props.onMoveEvent,
    onEditEvent: props.onEditEvent,
  };
};

export function Timeline(props: {
  /**
   * Events for the calendar
   * @default []
   */
  events?: CalendarEvent[];
  /**
   * Will be e.g. start of the week / year / month / quarter / 3 years / 3 months depending on the resolution
   * @default new Date()
   */
  startTime?: Date;
  /**
   * What view do we want to show
   * @default "month"
   */
  resolution?: TimelineResolution;
  /**
   * The current time. It is used to render the current time indicator
   * @default new Date()
   */
  now?: Date;

  /**
   * start week on monday or sunday
   * @default 'monday'
   */
  startDay?: StartDay;

  /**
   * When provided the user can create an event by clicking on a day or dragging over areas in the calendar
   * @param start when the event starts
   * @param end when event ends
   * @returns void
   */
  onCreateEvent?: (start: Date, end: Date) => void;

  /**
   * Triggered when an event is moved
   * @param event a calendar event
   * @param newStart new start date for the event
   * @param newEnd new end date for the event
   * @returns void
   */
  onMoveEvent?: (
    event: CalendarEvent,
    newStart: Date,
    newEnd: Date | undefined
  ) => void;

  /**
   * Triggered when an event clicked - open a modal or similar interface to edit the event
   * @param event a calendar event
   * @returns void
   */
  onEditEvent?: (event: CalendarEvent) => void;
}) {
  const p = parseDefaultProps(props);

  return (
    <Box>
      <Header {...p} />
      <Grid {...p} />
    </Box>
  );
}

const getTimelineRange = (
  resolution: TimelineResolution,
  startTime: Date,
  startDay: StartDay
): [Date, Date] => {
  const weekStartsOn: StartOfWeekOptions["weekStartsOn"] =
    startDay === "monday" ? 1 : 0;
  if (resolution === "month") {
    return [startOfWeek(startTime, { weekStartsOn }), addWeeks(startTime, 6)];
  }
  if (resolution === "year") {
    return [startOfYear(startTime), endOfYear(startTime)];
  }
  if (resolution === "3-months") {
    return [startOfMonth(startTime), addMonths(startTime, 3)];
  }
  if (resolution === "3-years") {
    return [startOfYear(startTime), addYears(startTime, 3)];
  }
  throw new Error("Invalid resolution");
};

function filterEventsInTimeline(
  _events: ModifiableEvent[],
  resolution: TimelineResolution,
  startTime: Date,
  startDay: StartDay
) {
  const [timelineStart, timelineEnd] = getTimelineRange(
    resolution,
    startTime,
    startDay
  );

  const eventsInTimeline: ModifiableEvent[] = _events
    .filter((event) => {
      return areIntervalsOverlapping(
        {
          start: timelineStart,
          end: timelineEnd,
        },
        { start: event.start, end: getEventEnd(event) }
      );
    })
    .map((event) => {
      let start = max([event.start, timelineStart]);
      let end = min([getEventEnd(event), timelineEnd]);
      return {
        sourceEvent: event.sourceEvent,
        start: start,
        end: end,
      };
    });
  return eventsInTimeline;
}

function Grid({
  startTime,
  events: sourceEvents,
  startDay,
  resolution,
  ...calendarProps
}: {
  startDay: StartDay;
  startTime: Date;
  now: Date;
  resolution: TimelineResolution;
  events: CalendarEvent[];
  onCreateEvent?: (start: Date, end: Date) => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onMoveEvent?: (
    event: CalendarEvent,
    newStart: Date,
    newEnd: Date | undefined
  ) => void;
}) {
  const [allEvents, draggedEvent, setDraggedEvent] =
    useDragableEvents(sourceEvents);

  const eventsInTimeline: ModifiableEvent[] = filterEventsInTimeline(
    allEvents,
    resolution,
    startTime,
    startDay
  );

  const { eventProperties, events, moreButtons, grid } = eventGrid(
    eventsInTimeline,
    startDay,
    startTime
  );

  const [timelineStart, timelineEnd] = getTimelineRange(
    resolution,
    startTime,
    startDay
  );

  const [effectRefs, eventContainerRef] = useEffectRefs(
    events,
    setDraggedEvent,
    (state, dragged, container) => {
      if (state.pos && state.pos0) {
        // const addedDays = dayDiff(
        //   state.pos,
        //   state.pos0,
        //   dragged,
        //   daysInWeek,
        //   container
        // );
        const addedDays = 0;

        let start = dragged.event.sourceEvent.start;
        let end =
          dragged.event.sourceEvent.end ??
          addMinutes(dragged.event.sourceEvent.start, 15);

        if (addedDays !== 0) {
          start = addDays(start, addedDays);
          end = addDays(end, addedDays);
        }

        if (addedDays !== 0) {
          return {
            start,
            end,
          };
        }
      }
      return undefined;
    },
    calendarProps
  );

  useMouse("timeline-event", effectRefs, false);

  const start = timelineStart.getTime();
  const end = timelineEnd.getTime();
  const totalSecondsOfMonth = end - start;

  return (
    <Box
      sx={{
        position: "relative",
        height: "120px",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
        ref={eventContainerRef}
      >
        {events.map((event, index) => {
          const { day, row, maxRow } = eventProperties[`${index}`];

          const x =
            (720 * (event.start.getTime() - start)) / totalSecondsOfMonth;
          const w =
            (720 * (event.end.getTime() - event.start.getTime())) /
            totalSecondsOfMonth;

          let width = differenceInCalendarDays(event.end, event.start);
          if (event.end.getTime() === endOfDay(event.end).getTime()) {
            width += 1;
          }

          return (
            <React.Fragment key={index}>
              <Box
                zIndex={2}
                component={Button}
                data-type={"timeline-event"}
                data-calendar-event={JSON.stringify({
                  x: day,
                  colX: 0,
                  index,
                  w: Math.max(width, 1),
                })}
                sx={{
                  minWidth: "auto",
                  width: `${w}px`,
                  left: `${x}px`,
                  top: row * (16 + 1) + 1 + 32,
                  height: "16px",
                  position: "absolute",
                  overflow: "hidden",
                  borderRadius: "4px",
                  padding: 0,
                  margin: 0,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: event.sourceEvent.color ?? DEFAULT_COLOR,
                    display: "flex",
                    justifyContent: "flex-start",
                    padding: "0px 8px",
                    flex: 1,
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    "*": {
                      pointerEvents: "none",
                    },
                  }}
                >
                  <Typography
                    variant="event"
                    color={(theme) => theme.palette.primary.contrastText}
                  >
                    {event.sourceEvent.title ?? "(No title)"}
                  </Typography>
                </Box>
              </Box>
            </React.Fragment>
          );
        })}
      </Box>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <TimeIndicator
          sx={{
            left:
              String(
                (720 * (calendarProps.now.getTime() - start)) /
                  totalSecondsOfMonth
              ) + "px",
          }}
        />
      </Box>
    </Box>
  );
}

function TimeIndicator(boxProps: BoxProps) {
  return (
    <Box
      {...boxProps}
      sx={mergeSx(boxProps.sx, {
        width: "13px",
        marginLeft: "-6.5px",
        marginTop: "0px",
        height: "100%",
        position: "absolute",
        overflow: "hidden",
      })}
    >
      <Box
        sx={{
          position: "absolute",
          backgroundColor: (theme) => theme.palette.background.default,
          width: "11px",
          height: "11px",
          borderRadius: "11px",
          left: "1px",
          top: "1px",
        }}
      ></Box>
      <Box
        sx={{
          position: "absolute",
          backgroundColor: (theme) => theme.palette.background.default,
          width: "11px",
          height: "11px",
          borderRadius: "11px",
          left: "1px",
          top: "1px",
        }}
      ></Box>
      <Box
        sx={{
          position: "absolute",
          background: "#FFA000",
          width: "9px",
          height: "9px",
          borderRadius: "9px",
          left: "2px",
          top: "2px",
        }}
      ></Box>
      <Box
        sx={{
          position: "absolute",
          backgroundColor: (theme) => theme.palette.background.default,
          width: "3px",
          height: "100%",
          left: "5px",
          top: "11px",
        }}
      ></Box>
      <Box
        sx={{
          position: "absolute",
          background: "#FFA000",
          width: "1px",
          height: "100%",
          left: "6px",
          top: "2px",
        }}
      ></Box>
    </Box>
  );
}

function Header({
  startTime,
  now,
  resolution,
}: {
  startTime: Date;
  resolution: TimelineResolution;
  now: Date;
}) {
  if (resolution === "month") {
    const weeks: Date[] = [];
    const days: Date[] = [];
    for (let i = 0; i < 6; i += 1) {
      for (let j = 0; j < 7; j += 1) {
        if (j === 0) {
          weeks.push(addDays(startTime, i * 7));
        }
        const k = i * 7 + j;
        days.push(addDays(startTime, k));
      }
    }
    return (
      <Box>
        <FlexRow>
          {weeks.flatMap((week, index) => {
            const els = [
              <FlexRow
                key={index}
                sx={{ width: "119px", height: "44px" }}
                justifyContent={"center"}
              >
                <Box>
                  <Typography
                    variant="h4"
                    color={(theme) =>
                      theme.palette.text[
                        isSameWeek(week, now) ? "primary" : "secondary"
                        // or maybe use isSameISOWeek
                      ]
                    }
                  >
                    W{format(week, "I")}
                  </Typography>
                  {isSameWeek(week, now) && (
                    <Box
                      sx={{
                        background: (theme) => theme.palette.primary.main,
                        height: "2px",
                        width: "100%",
                        borderRadius: "2px",
                      }}
                    ></Box>
                  )}
                </Box>
              </FlexRow>,
            ];
            if (index < weeks.length - 1) {
              els.push(
                <Box
                  key={index + "divider"}
                  sx={{
                    width: "1px",
                    height: "16px",
                  }}
                >
                  <Box
                    sx={{
                      width: "1px",
                      height: "200px",
                      background: (theme) => theme.palette.divider,
                      borderRadius: "1px",
                    }}
                  ></Box>
                </Box>
              );
            }
            return els;
          })}
        </FlexRow>
        <Box sx={{ height: "16px" }} />

        <FlexRow>
          {days.map((day, index) => {
            let w = 17;
            if (index === 0) {
              w = 16;
            }
            w += 1 / 7;
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  width: `${w}px`,
                  alignItems: "center",
                  height: "16px",
                  position: "relative",
                }}
              >
                {index !== 0 && (
                  <Box
                    sx={{
                      width: "1px",
                      borderRadius: "1px",
                      height: "18px",
                      backgroundColor: (theme) => theme.palette.divider,
                      marginTop: "-1px",
                    }}
                  ></Box>
                )}
                <FlexRow
                  justifyContent="center"
                  alignItems={"center"}
                  sx={{ width: `${w - 1}px`, height: "16px" }}
                >
                  <FlexCol alignItems="center" justifyContent="center">
                    <Typography
                      variant="event"
                      sx={{ fontSize: "8px", lineHeight: "8px" }}
                      color={(theme) => {
                        return theme.palette.text[
                          isSameDay(day, now) ? "primary" : "secondary"
                        ];
                      }}
                    >
                      {format(day, "d")}
                    </Typography>
                    {isSameDay(day, now) && (
                      <Box
                        sx={{
                          background: (theme) => theme.palette.primary.main,
                          height: "1px",
                          width: "8px",
                          borderRadius: "1px",
                          position: "absolute",
                          bottom: "2px",
                        }}
                      ></Box>
                    )}
                  </FlexCol>
                </FlexRow>
              </Box>
            );
          })}
        </FlexRow>
      </Box>
    );
  }
  return <Box></Box>;
  return null;
}
