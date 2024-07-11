import { Box, BoxProps, Button, Typography } from "@mui/material";
import {
  StartOfWeekOptions,
  addDays,
  addMilliseconds,
  addMinutes,
  addMonths,
  addQuarters,
  addWeeks,
  addYears,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  endOfDay,
  endOfYear,
  format,
  isSameDay,
  isSameMonth,
  isSameQuarter,
  isSameWeek,
  isSameYear,
  max,
  min,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  subMilliseconds,
} from "date-fns";
import React from "react";
import { eventGrid } from "../event_grid";
import { DEFAULT_COLOR, getEventEnd, mergeSx } from "../helpers";
import { CalendarEvent, StartDay, TimelineResolution } from "../types";
import { ModifiableEvent } from "../week_calendar/types";
import {
  dayDiff,
  useDragableEvents,
  useEffectRefs,
  useMouse,
} from "../use_mouse";
import { FlexCol, FlexRow } from "../wrappers";
import {
  Clique,
  findAllCliques,
  findConnectedComponents,
  findEventOverlaps,
} from "../week_calendar/event_overlap_functions";
import { getPositions } from "../week_calendar/clique_grid";
import { Header } from "./header";
import { Grid } from "./grid";
import { widthToPct } from "./to_pct";

export type TimelineProps<T> = {
  /**
   * Events for the calendar
   * @default []
   */
  events?: CalendarEvent<T>[];
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
    event: CalendarEvent<T>,
    newStart: Date,
    newEnd: Date | undefined
  ) => void;

  /**
   * Triggered when an event clicked - open a modal or similar interface to edit the event
   * @param event a calendar event
   * @returns void
   */
  onClickEvent?: (event: CalendarEvent<T>, nativeEvent: MouseEvent) => void;
};

function getStartTime(
  startTime: Date,
  resolution: TimelineResolution,
  startDay: StartDay
): Date {
  const options: StartOfWeekOptions = {
    weekStartsOn: startDay === "monday" ? 1 : 0,
  };
  if (resolution === "month") {
    return startOfWeek(startTime, options);
  }
  if (resolution === "3-months") {
    return startOfMonth(startTime);
  }
  if (resolution === "year") {
    return startOfQuarter(startTime);
  }
  if (resolution === "3-years") {
    return startOfYear(startTime);
  }
  throw new Error("invalid resolution");
}

function parseDefaultProps<T>(props: TimelineProps<T>) {
  const events = props.events ?? [];
  let startDay = props.startDay ?? "monday";
  const now = props.now ?? new Date();

  const resolution = props.resolution ?? "month";

  return {
    events,
    startDay,
    startTime: getStartTime(
      props.startTime ?? new Date(),
      resolution,
      startDay
    ),
    startOfWeek,
    resolution,
    now,
    onCreateEvent: props.onCreateEvent,
    onMoveEvent: props.onMoveEvent,
    onClickEvent: props.onClickEvent,
  };
}

export function Timeline<T>(props: TimelineProps<T>) {
  const p = parseDefaultProps(props);
  const {
    startTime,
    events: sourceEvents,
    startDay,
    resolution,
    ...calendarProps
  } = p;

  const [allEvents, draggedEvent, setDraggedEvent] =
    useDragableEvents(sourceEvents);

  const events: ModifiableEvent<T>[] = parseEventsInTimeline(
    allEvents,
    resolution,
    startTime
  );

  const verticalPositionsRef = React.useRef<
    Record<number, number> | undefined
  >();

  if (!draggedEvent?.dragged || verticalPositionsRef.current === undefined) {
    const [verticalPositions] = getPositions(events);
    verticalPositionsRef.current = verticalPositions;
  }

  const verticalPositions = verticalPositionsRef.current;

  const [timelineStart, timelineEnd] = getTimelineRange(resolution, startTime);

  const [effectRefs, eventContainerRef] = useEffectRefs(
    events,
    setDraggedEvent,
    (state, dragged, container) => {
      if (state.pos && state.pos0) {
        const { pos, pos0 } = state;
        let rawDelta = pos.x + -pos0.x + pos.scrollX - pos0.scrollX;

        let addedMs =
          (timelineEnd.getTime() - timelineStart.getTime()) *
          (rawDelta / container.width);

        const minDuration =
          (4 * (timelineEnd.getTime() - timelineStart.getTime())) /
          container.width; // 4px width

        const minAddedMs =
          timelineStart.getTime() - dragged.event.end.getTime() + minDuration;

        const maxAddedMs =
          timelineEnd.getTime() - dragged.event.start.getTime() - minDuration;

        addedMs = Math.min(Math.max(addedMs, minAddedMs), maxAddedMs);

        let start = addMilliseconds(dragged.event.sourceEvent.start, addedMs);
        let end = addMilliseconds(
          getEventEnd(dragged.event.sourceEvent),
          addedMs
        );

        if (addedMs !== 0) {
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
  const indices = Object.values(verticalPositions);
  const currentMaxHeight =
    indices.length > 0 ? indices.reduce((p, c) => Math.max(p, c), 0) + 1 : 0;

  const maxHeightRef = React.useRef(currentMaxHeight);
  maxHeightRef.current = Math.max(currentMaxHeight, maxHeightRef.current);
  const height = maxHeightRef.current * (16 + 1);

  return (
    <Box sx={{ position: "relative" }}>
      <Grid {...p} height={height} empty={events.length === 0} />
      <Header {...p} />
      <Box
        sx={{
          position: "relative",
          height: height + 9,
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
            const dragged =
              draggedEvent?.source.sourceEvent === event.sourceEvent;

            const x = widthToPct(
              (720 * (event.start.getTime() - start)) / totalSecondsOfMonth
            );
            const w = widthToPct(
              (720 * (event.end.getTime() - event.start.getTime())) /
                totalSecondsOfMonth
            );

            let width = differenceInCalendarDays(event.end, event.start);
            if (event.end.getTime() === endOfDay(event.end).getTime()) {
              width += 1;
            }

            const y = verticalPositions[index];

            return (
              <React.Fragment key={index}>
                <Box
                  zIndex={2}
                  component={Button}
                  data-type={"timeline-event"}
                  data-calendar-event={JSON.stringify({
                    x: 0,
                    colX: 0,
                    index,
                    w: Math.max(width, 1),
                  })}
                  sx={{
                    minWidth: "auto",
                    width: dragged ? `calc(${w} + 2px)` : w,
                    left: dragged ? `calc(${x} - 1px)` : x,
                    top: y * (16 + 1) + 11,
                    height: "16px",
                    position: "absolute",
                    borderRadius: "4px",
                    padding: 0,
                    margin: 0,
                    zIndex: dragged ? 2 : 1,
                    paddingX: dragged ? "1px" : 0,
                    background: "white",
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "4px",
                      height: "16px",
                      overflow: "hidden",
                      boxShadow: (theme) =>
                        dragged ? theme.shadows[4] : "none",
                      backgroundColor: event.sourceEvent.color ?? DEFAULT_COLOR,
                      display: "flex",
                      justifyContent: "center",
                      flex: 1,
                      alignItems: "center",
                      flexShrink: 1,
                      whiteSpace: "nowrap",
                      padding: 0,
                      pointerEvents: "none",
                      "*": {
                        pointerEvents: "none",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        paddingLeft: "8px",
                        paddingRight: "8px",
                        flexShrink: 1,
                        height: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        width: "100%",
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
                </Box>
              </React.Fragment>
            );
          })}
        </Box>
        {events.length > 0 && (
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
                height: "100%",
                left: widthToPct(
                  (720 * (calendarProps.now.getTime() - start)) /
                    totalSecondsOfMonth
                ),
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

const getTimelineRange = (
  resolution: TimelineResolution,
  startTime: Date
): [Date, Date] => {
  if (resolution === "month") {
    return [startTime, addWeeks(startTime, 6)];
  }
  if (resolution === "year") {
    return [startTime, endOfYear(startTime)];
  }
  if (resolution === "3-months") {
    return [startTime, addMonths(startTime, 3)];
  }
  if (resolution === "3-years") {
    return [startTime, addYears(startTime, 3)];
  }
  throw new Error("Invalid resolution");
};

const constrainEvent = (
  resolution: TimelineResolution,
  startTime: Date,
  _start: Date,
  _end: Date
) => {
  const [timelineStart, timelineEnd] = getTimelineRange(resolution, startTime);

  const minDuration =
    (4 * (timelineEnd.getTime() - timelineStart.getTime())) / 720; // 4px width

  // start will be within timeline
  // more than left bound
  let start = max([_start, timelineStart]);
  // less than right - 4px
  start = min([start, subMilliseconds(timelineEnd, minDuration)]);

  // less than right bound
  let end = min([_end, timelineEnd]);
  // more than left + 4px
  end = max([end, addMilliseconds(timelineStart, minDuration)]);

  // event width must be at least 4px
  end = max([addMilliseconds(start, minDuration), end]);

  return {
    start: start,
    end: end,
  };
};

function parseEventsInTimeline<T>(
  events: ModifiableEvent<T>[],
  resolution: TimelineResolution,
  startTime: Date
) {
  const [timelineStart, timelineEnd] = getTimelineRange(resolution, startTime);

  const eventsInTimeline: ModifiableEvent<T>[] = events
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
      const { start, end } = constrainEvent(
        resolution,
        startTime,
        event.start,
        getEventEnd(event)
      );
      return { sourceEvent: event.sourceEvent, start, end };
    });
  return eventsInTimeline;
}

function TimeIndicator(boxProps: BoxProps) {
  return (
    <Box
      className="time-indicator"
      {...boxProps}
      sx={mergeSx(boxProps.sx, {
        width: "13px",
        marginLeft: "-6.5px",
        marginTop: "0px",
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
