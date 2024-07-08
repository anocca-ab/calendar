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
  onEditEvent?: (event: CalendarEvent<T>) => void;
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
    onEditEvent: props.onEditEvent,
  };
}

export function Timeline<T>(props: TimelineProps<T>) {
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

function Grid<T>({
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
  events: CalendarEvent<T>[];
  onCreateEvent?: (start: Date, end: Date) => void;
  onEditEvent?: (event: CalendarEvent<T>) => void;
  onMoveEvent?: (
    event: CalendarEvent<T>,
    newStart: Date,
    newEnd: Date | undefined
  ) => void;
}) {
  const [allEvents, draggedEvent, setDraggedEvent] =
    useDragableEvents(sourceEvents);

  const events: ModifiableEvent<T>[] = parseEventsInTimeline(
    allEvents,
    resolution,
    startTime
  );

  const [verticalPositions] = getPositions(events);

  const [timelineStart, timelineEnd] = getTimelineRange(resolution, startTime);

  const [effectRefs, eventContainerRef] = useEffectRefs(
    events,
    setDraggedEvent,
    (state, dragged, container) => {
      if (state.pos && state.pos0) {
        const { pos, pos0 } = state;
        let rawDelta = pos.x + -pos0.x + pos.scrollX - pos0.scrollX;

        let addedMs =
          (timelineEnd.getTime() - timelineStart.getTime()) * (rawDelta / 720);

        const minDuration =
          (4 * (timelineEnd.getTime() - timelineStart.getTime())) / 720; // 4px width

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
  const maxHeight = Math.max(
    Object.values(verticalPositions).reduce((p, c) => Math.max(p, c), 0),
    5
  );

  return (
    <Box
      sx={{
        position: "relative",
        height: maxHeight * (16 + 1) + 32,
        overflow: "hidden",
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
                  x: 0,
                  colX: 0,
                  index,
                  w: Math.max(width, 1),
                })}
                sx={{
                  minWidth: "auto",
                  width: `${w}px`,
                  left: `${x}px`,
                  top: verticalPositions[index] * (16 + 1) + 11,
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
            height: '100%',
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

function Header({
  startTime,
  now,
  resolution,
  startDay,
}: {
  startTime: Date;
  resolution: TimelineResolution;
  now: Date;
  startDay: StartDay;
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
        <BigTime
          now={now}
          times={weeks}
          isActive={isSameWeek}
          formatDate={(date) => {
            return `W${format(date, "I")}`;
          }}
          width={119}
        />
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
                      backgroundColor:
                        index % 7 === 0
                          ? "none"
                          : (theme) => theme.palette.divider,
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
  if (resolution === "3-months") {
    const months: Date[] = [];
    const weeks: Date[] = [];
    // 3 months
    for (let i = 0; i < 3; i += 1) {
      // 4 weeks
      for (let j = 0; j < 4; j += 1) {
        if (j === 0) {
          months.push(addMonths(startTime, i));
        }
        weeks.push(addWeeks(addMonths(startTime, i), j));
      }
    }
    return (
      <Box>
        <BigTime
          now={now}
          times={months}
          isActive={isSameMonth}
          formatDate={(date) => {
            return format(date, "MMM");
          }}
          width={239}
        />
        <Box sx={{ height: "16px" }} />
        <SmallTime
          formatDate={(date) => "W" + format(date, "I")}
          times={weeks}
          noBorderMod={4}
          isActive={(d) => {
            const options: StartOfWeekOptions = {
              weekStartsOn: startDay === "monday" ? 1 : 0,
            };
            return isSameWeek(d, now, options);
          }}
        />
      </Box>
    );
  }
  if (resolution === "year") {
    const quarters: Date[] = [];
    const months: Date[] = [];
    // 4 quarters
    for (let i = 0; i < 4; i += 1) {
      // 3 months
      for (let j = 0; j < 3; j += 1) {
        if (j === 0) {
          quarters.push(addMonths(startTime, i * 3));
        }
        const k = i * 3 + j;
        months.push(addMonths(startTime, k));
      }
    }
    return (
      <Box>
        <BigTime
          now={now}
          times={quarters}
          isActive={isSameQuarter}
          formatDate={(date) => {
            return format(date, "qqq");
          }}
          width={179}
        />
        <Box sx={{ height: "16px" }} />
        <SmallTime
          formatDate={(date) => format(date, "MMM")}
          times={months}
          noBorderMod={3}
          isActive={(d) => isSameMonth(d, now)}
        />
      </Box>
    );
  }
  if (resolution === "3-years") {
    const years: Date[] = [];
    const quarters: Date[] = [];
    // 3 years
    for (let i = 0; i < 3; i += 1) {
      // 4 quarters per year
      for (let j = 0; j < 4; j += 1) {
        if (j === 0) {
          years.push(addYears(startTime, i));
        }
        quarters.push(addQuarters(addYears(startTime, i), j));
      }
    }
    return (
      <Box>
        <BigTime
          now={now}
          times={years}
          isActive={isSameYear}
          formatDate={(date) => {
            return format(date, "yyyy");
          }}
          width={239}
        />
        <Box sx={{ height: "16px" }} />
        <SmallTime
          formatDate={(date) => format(date, "qqq")}
          times={quarters}
          noBorderMod={4}
          isActive={(d) => isSameQuarter(d, now)}
        />
      </Box>
    );
  }
  return <Box></Box>;
  return null;
}

function BigTime({
  now,
  times,
  isActive,
  formatDate,
  width,
}: {
  now: Date;
  times: Date[];
  isActive: (a: Date, now: Date) => boolean;
  formatDate: (date: Date) => string;
  width: number;
}) {
  return (
    <FlexRow>
      {times.flatMap((month, index) => {
        const els = [
          <FlexRow
            key={index}
            sx={{ width: `${width}px`, height: "44px" }}
            justifyContent={"center"}
          >
            <Box>
              <Typography
                variant="h4"
                color={(theme) =>
                  theme.palette.text[
                    isActive(month, now) ? "primary" : "secondary"
                  ]
                }
              >
                {formatDate(month)}
              </Typography>
              {isActive(month, now) && (
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
        if (index < times.length - 1) {
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
  );
}

function SmallTime({
  times,
  formatDate,
  noBorderMod,
  isActive,
}: {
  times: Date[];
  formatDate: (date: Date) => string;
  noBorderMod: number;
  isActive: (date: Date) => boolean;
}) {
  return (
    <FlexRow justifyContent="space-between">
      {times.flatMap((week, index) => {
        const els = [
          <FlexRow key={index} justifyContent="center" flex="1">
            <Box>
              <Typography
                variant="body2"
                color={(theme) => theme.palette.text.secondary}
              >
                {formatDate(week)}
              </Typography>
              {isActive(week) ? (
                <Box
                  sx={{
                    background: (theme) => theme.palette.primary.main,
                    height: "2px",
                    borderRadius: "2px",
                    width: "100%",
                  }}
                ></Box>
              ) : null}
            </Box>
          </FlexRow>,
        ];
        if (index !== 0) {
          els.unshift(
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
                  height: 140,
                  background:
                    index % noBorderMod === 0
                      ? "none"
                      : (theme) => theme.palette.divider,
                  borderTopLeftRadius: "1px",
                  borderTopRightRadius: "1px",
                }}
              ></Box>
            </Box>
          );
        }
        return els;
      })}
    </FlexRow>
  );
}
