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
  compareAsc,
  differenceInCalendarDays,
  differenceInMilliseconds,
  endOfDay,
  max,
  min,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  subMilliseconds,
} from "date-fns";
import { FixedSizeList as VirtualizedList } from "react-window";
import React from "react";
import { DEFAULT_COLOR, getEventEnd, getEventStart, mergeSx } from "../helpers";
import {
  CalendarEvent,
  ScrollContainer,
  StartDay,
  TimelineResolution,
} from "../types";
import {
  DraggedEvent,
  useDragableEvents,
  useEffectRefs,
  useMouse,
} from "../use_mouse";
import { getPositions, timelinePositions } from "../week_calendar/clique_grid";
import { ModifiableEvent } from "../week_calendar/types";
import { Grid } from "./grid";
import { Header } from "./header";
import { timelineHeaderHeight } from "./timeline_height";
import { widthToPct } from "./to_pct";
import { useMeasureHeight } from "../measure_height";

export type TimelineProps<T> = {
  /**
   * Events for the calendar
   * @default []
   */
  events?: CalendarEvent<T>[];

  /**
   * Define how to group the events
   */
  group?: {
    getGroup: (event: CalendarEvent<T>) => string;
    groups: { key: string; title: string; color: string }[];
  };

  /**
   * To increase performance we need to know the key of the event
   */
  getKey?: (event: CalendarEvent<T>) => string;

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
  onCreateEvent?: (start: Date, end?: Date) => void;

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

  /**
   * Provide elements that scroll around the calendar so that events can be moved while the user is scrolling
   * @default [window]
   */
  scrollContainers?: ScrollContainer[];

  /**
   * If you remove the header it will not render the week / month / year / 3 years header
   */
  noHeader?: boolean;
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
    return startOfWeek(startTime, options);
  }
  if (resolution === "year") {
    return startOfQuarter(startTime);
  }
  if (resolution === "3-years") {
    return startOfYear(startTime);
  }
  throw new Error("invalid resolution");
}

function useParseDefaultProps<T>(props: TimelineProps<T>) {
  const events = React.useMemo(() => props.events ?? [], [props.events]);
  let startDay = props.startDay ?? "monday";
  const now = props.now ?? new Date();

  const resolution = props.resolution ?? "month";

  const scrollContainers = props.scrollContainers ?? [];
  if (scrollContainers.length === 0) {
    scrollContainers.push(window);
  }

  return {
    events,
    startDay,
    startTime: React.useMemo(
      () => getStartTime(props.startTime ?? new Date(), resolution, startDay),
      [props.startTime, resolution, startDay]
    ),
    startOfWeek,
    resolution,
    now,
    onCreateEvent: props.onCreateEvent,
    onMoveEvent: props.onMoveEvent,
    onClickEvent: props.onClickEvent,
    scrollContainers,
    noHeader: props.noHeader,
    getKey: props.getKey,
  };
}

export function Timeline<T>(props: TimelineProps<T>) {
  const p = useParseDefaultProps(props);
  const {
    startTime,
    events: sourceEvents,
    startDay,
    resolution,
    noHeader,
    getKey,
    ...calendarProps
  } = p;

  const options: StartOfWeekOptions = React.useMemo(() => {
    return {
      weekStartsOn: startDay === "monday" ? 1 : 0,
    };
  }, [startDay]);

  const snapFn = React.useCallback(
    (start: Date, end: Date) => {
      const snapToMonth = () => {
        const delta = differenceInMilliseconds(end, start);

        const monthDelta = differenceInMilliseconds(
          startOfMonth(addMonths(start, 1)),
          startOfMonth(start)
        );

        const middleOfTheMonth = addMilliseconds(
          startOfMonth(start),
          monthDelta / 2
        );
        const newStart =
          compareAsc(start, middleOfTheMonth) === -1
            ? startOfMonth(start)
            : startOfMonth(addMonths(start, 1));

        const newEnd = addMilliseconds(newStart, delta);
        return {
          start: newStart,
          end: newEnd,
        };
      };
      const snapToDay = () => {
        const delta = differenceInMilliseconds(end, start);
        const middleOfTheDay = addMinutes(startOfDay(start), 720 / 2);
        const newStart =
          compareAsc(start, middleOfTheDay) === -1
            ? startOfDay(start)
            : startOfDay(addDays(start, 1));

        const newEnd = addMilliseconds(newStart, delta);
        return {
          start: newStart,
          end: newEnd,
        };
      };

      // doesn't feel that good, but could be used
      const snapToWeek = () => {
        const delta = differenceInMilliseconds(end, start);
        const middleOfTheWeek = addMinutes(
          startOfWeek(start, options),
          (7 * 720) / 2
        );
        const newStart =
          compareAsc(start, middleOfTheWeek) === -1
            ? startOfWeek(start, options)
            : startOfWeek(addWeeks(start, 1), options);

        const newEnd = addMilliseconds(newStart, delta);
        return {
          start: newStart,
          end: newEnd,
        };
      };

      if (resolution === "month") {
        return snapToDay();
      }
      if (resolution === "3-months") {
        return snapToDay();
      }
      if (resolution === "year") {
        return snapToDay();
      }
      if (resolution === "3-years") {
        return snapToMonth();
      }
      return { start, end };
    },
    [options, resolution]
  );

  const [allEvents, draggedEvent, setDraggedEvent] = useDragableEvents(
    sourceEvents,
    snapFn
  );

  const events: ModifiableEvent<T>[] = React.useMemo(
    () => parseEventsInTimeline(allEvents, resolution, startTime),
    [allEvents, resolution, startTime]
  );

  const verticalPositionsRef = React.useRef<
    Record<number, number> | undefined
  >();

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

        let start = addMilliseconds(
          getEventStart(dragged.event.sourceEvent),
          addedMs
        );
        let end = addMilliseconds(
          getEventEnd(dragged.event.sourceEvent),
          addedMs
        );

        if (state.hasDragged) {
          return snapFn(start, end);
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

  const headerHeight = timelineHeaderHeight({
    resolution,
  });

  const { height, setWrapperRef, hasMeasuredHeight } = useMeasureHeight(0);

  const evOverlaps = (a: ModifiableEvent<T>, b: ModifiableEvent<T>) => {
    return (
      (a.start.getTime() <= b.end.getTime() &&
        a.end.getTime() >= b.start.getTime()) ||
      (b.start.getTime() <= a.end.getTime() &&
        b.end.getTime() >= a.start.getTime())
    );
  };

  const padding = Math.floor(height / 17);

  const [direction, setDirection] = React.useState<"up" | "down">("down");
  const windowSize = !hasMeasuredHeight
    ? 0
    : Math.ceil(height / 17) + padding * 2;

  const [topRowIndex, setTopRowIndex] = React.useState(0);

  const startIndex = Math.max(topRowIndex - padding, 0);
  const endIndex = Math.min(topRowIndex + windowSize, events.length - 1);

  const { persistedRows, assignedEvents, finishedRows } = React.useMemo(() => {
    const persistedRows: { index: number; ev: ModifiableEvent<T> }[][] = [[]];
    const assignedEvents = new Set<number>();
    const finishedRows = new Set<number>();
    return { persistedRows, assignedEvents, finishedRows };
  }, [events]);

  const rows = React.useMemo(() => {
    if (!hasMeasuredHeight) {
      return [];
    }

    const rows = persistedRows;

    let assignedRowsToAllIndices = false;

    const candidateRows: (
      | {
          index: number;
          ev: ModifiableEvent<T>;
        }[]
      | undefined
    )[] = [];

    for (let i = startIndex; i <= endIndex; i++) {
      if (!finishedRows.has(startIndex + i)) {
        const row = rows[startIndex + i] ?? undefined;
        candidateRows.push(row);
      }
    }

    if (candidateRows.length === 0) {
      return rows;
    }
    // go through each event and assign it to an eligble row if possible
    eventLoop: for (let j = 0; j < events.length; j++) {
      if (assignedEvents.has(j)) {
        continue;
      }
      const event = events[j];
      const eligbleRow = candidateRows
        // if the row is empty or if the events doesn't overlap with some of the events in the row
        .find(
          (row) => !row || !row.some((evInRow) => evOverlaps(event, evInRow.ev))
        );
      if (!eligbleRow) {
        // we need to add a row

        if (assignedRowsToAllIndices) {
          // there is no space for the event in this window, check the next event
          continue;
        }
        // find first row that is empty
        for (let i = startIndex; i <= endIndex; i++) {
          if (!rows[i]) {
            rows[i] = [{ ev: event, index: j }];
            assignedEvents.add(j);
            continue eventLoop;
          }
        }
        assignedRowsToAllIndices = true;
      } else {
        eligbleRow.push({ ev: event, index: j });
        assignedEvents.add(j);
      }
    }
    for (let i = startIndex; i <= endIndex; i++) {
      finishedRows.add(i);
    }

    return rows;
  }, [events, startIndex, endIndex, persistedRows, finishedRows]);

  const [scrollableRef, setScrollableRef] = React.useState<HTMLElement | null>(
    null
  );

  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (!scrollableRef) {
      return;
    }
    let t: number;
    let current = 0;
    const onScroll = () => {
      cancelAnimationFrame(t);
      t = requestAnimationFrame(() => {
        const scrollTop = scrollableRef.scrollTop;
        setDirection(scrollTop > current ? "down" : "up");
        current = scrollTop;
        const newStartIndex = Math.floor(scrollTop / 17);
        setTopRowIndex(newStartIndex);
      });
    };
    scrollableRef.addEventListener("scroll", onScroll, { passive: true });

    onScroll();

    return () => {
      scrollableRef.removeEventListener("scroll", onScroll);
    };
  }, [scrollableRef, events.length]);

  const scrollLength =
    rows.length * 17 + (events.length - assignedEvents.size) * 17;

  return (
    <Box
      sx={{ position: "relative", display: "flex", height: "100%", flex: 1 }}
    >
      <Box
        className="timeline"
        sx={{
          position: "relative",
          flex: 1,
          overflow: "auto",
        }}
        component="div"
        ref={(el: HTMLDivElement | null) => {
          setScrollableRef(el);
          eventContainerRef.current = el;
        }}
      >
        <Box
          ref={setWrapperRef}
          sx={{
            position: "absolute",
            overflow: "hidden",
            bottom: 0,
            left: 0,
            right: 0,
            top: `${noHeader ? 0 : headerHeight}px`,
          }}
        />
        <Box
          sx={{
            width: "100%",
            position: "sticky",
            top: 0,
            left: 0,
            height: "100%",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <Grid {...p} empty={events.length === 0} noHeader={noHeader} />
          {!noHeader && (
            <Box
              sx={{
                background: (theme) => theme.palette.background.paper,
                height: `${noHeader ? 0 : headerHeight}px`,
                pointerEvents: "all",
                overflow: "hidden",
              }}
            >
              <Header
                {...p}
                empty={events.length === 0}
                onCreateEvent={props.onCreateEvent}
              />
            </Box>
          )}
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            top: `${noHeader ? 0 : headerHeight}px`,
            // backgroundColor: "yellow",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              height: `${scrollLength}px`,
              width: "64px",
              backgroundColor: "red",
              position: "absolute",
            }}
          ></Box>
          {rows.slice(startIndex, endIndex + 1).map((row, index) => {
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  position: "relative",
                  height: "17px",
                  top: startIndex * 17,
                }}
              >
                {row.map(({ ev: event, index }, rowEvIndex) => {
                  const dragged =
                    draggedEvent?.source.sourceEvent === event.sourceEvent;

                  const x = widthToPct(
                    (720 * (event.start.getTime() - start)) /
                      totalSecondsOfMonth
                  );
                  const w = widthToPct(
                    (720 * (event.end.getTime() - event.start.getTime())) /
                      totalSecondsOfMonth
                  );

                  let width = differenceInCalendarDays(event.end, event.start);
                  if (event.end.getTime() === endOfDay(event.end).getTime()) {
                    width += 1;
                  }

                  const key = index;

                  const color = event.sourceEvent.color ?? DEFAULT_COLOR;
                  const title = event.sourceEvent.title ?? "(No title)";

                  return (
                    <React.Fragment key={rowEvIndex}>
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
                          // top: y * (16 + 1) + (noHeader ? 0 : headerHeight),
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
                            backgroundColor: color,
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
                              color={(theme) =>
                                theme.palette.primary.contrastText
                              }
                            >
                              {title}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </React.Fragment>
                  );
                })}
              </Box>
            );
          })}
        </Box>

        {/* {events.map((event, index) => {
        const dragged = draggedEvent?.source.sourceEvent === event.sourceEvent;

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

        const key = index;

        return (
          <TlEvent
            key={key}
            color={event.sourceEvent.color ?? DEFAULT_COLOR}
            title={event.sourceEvent.title ?? "(No title)"}
            index={index}
            width={width}
            dragged={dragged}
            w={w}
            x={x}
            y={y}
            noHeader={!!noHeader}
            headerHeight={headerHeight}
          />
        );
      })}
      {events.length > 0 && (
        <TimeIndicator
          sx={{
            top: `${noHeader ? 0 : headerHeight}px`,
            pointerEvents: "none",
            zIndex: 2,
            height: `${gridHeight}px`,
            left: widthToPct(
              (720 * (calendarProps.now.getTime() - start)) /
                totalSecondsOfMonth
            ),
          }}
        />
      )} */}
      </Box>
      <Box
        sx={{
          position: "absolute",
          zIndex: 3,
          inset: 0,
          backdropFilter: "blur(5px)",
          top: `${noHeader ? 0 : headerHeight}px`,
          display: "none",
          pointerEvents: "none",
        }}
      ></Box>
    </Box>
  );
}

const TlEvent = React.memo(function TlEvent({
  index,
  width,
  dragged,
  w,
  x,
  y,
  noHeader,
  headerHeight,
  color,
  title,
}: {
  index: number;
  width: number;
  dragged: boolean;
  w: string;
  x: string;
  y: number;
  noHeader: boolean;
  headerHeight: number;
  color: string;
  title: string;
}) {
  return (
    <React.Fragment>
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
          top: y * (16 + 1) + (noHeader ? 0 : headerHeight),
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
            boxShadow: (theme) => (dragged ? theme.shadows[4] : "none"),
            backgroundColor: color,
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
              {title}
            </Typography>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
});

const getTimelineRange = (
  resolution: TimelineResolution,
  startTime: Date
): [Date, Date] => {
  if (resolution === "month") {
    return [startTime, addWeeks(startTime, 6)];
  }
  if (resolution === "3-months") {
    return [startTime, addWeeks(startTime, 15)];
  }
  if (resolution === "year") {
    return [startTime, addQuarters(startTime, 4)];
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
        { start: getEventStart(event), end: getEventEnd(event) }
      );
    })
    .map((event) => {
      const { start, end } = constrainEvent(
        resolution,
        startTime,
        getEventStart(event),
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
        width: "3px",
        marginLeft: "-1.5px",
        marginTop: "0px",
        position: "absolute",
        overflow: "hidden",
      })}
    >
      <Box
        sx={{
          position: "absolute",
          backgroundColor: (theme) => theme.palette.background.default,
          width: "3px",
          height: "100%",
          left: 0,
          top: "0px",
        }}
      ></Box>
      <Box
        sx={{
          position: "absolute",
          background: "#FFA000",
          width: "1px",
          height: "100%",
          left: "1px",
          top: "0px",
          borderRadius: "1px",
        }}
      ></Box>
    </Box>
  );
}
