import { Box, BoxProps, Button, Typography, useTheme } from "@mui/material";
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
import React from "react";
import {
  DEFAULT_COLOR,
  getEventEnd,
  getEventStart,
  mergeSx,
  tuple,
} from "../helpers";
import { useMeasureHeight } from "../measure_height";
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
import { ModifiableEvent } from "../week_calendar/types";
import { Grid } from "./grid";
import { Header } from "./header";
import { timelineHeaderHeight } from "./timeline_height";
import { widthToPct } from "./to_pct";

export type TimelineProps<T> = {
  /**
   * Events for the calendar. Memoize this prop for better performance
   * @default []
   */
  events?: CalendarEvent<T>[];

  /**
   * Define how to group the events. Memoize this prop for better performance
   */
  group?: {
    /**
     * return the group key of the event
     */
    getGroup: (event: CalendarEvent<T>) => string;
    /**
     * a list of groups
     */
    groups: {
      /**
       * group key
       */
      key: string;
      /**
       * title of the group
       */
      title: string;
      /**
       * color of the group
       */
      color: string;
    }[];
  };

  /**
   * If you want to maintain the position of the events when they are dragged
   * the timeline must know what id to use for the event. This is used to keep track of the event
   */
  getId?: (event: CalendarEvent<T>) => string;

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
    group: props.group,
    getId: props.getId,
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
    group,
    getId,
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

  // const [allEvents, draggedEvent, setDraggedEvent] = useDragableEvents(
  //   sourceEvents,
  //   snapFn
  // );

  const [draggedEvent, setDraggedEvent] = React.useState<
    DraggedEvent<ModifiableEvent<T>> | undefined
  >(undefined);

  const allEvents = React.useMemo(() => {
    return sourceEvents.map((sourceEvent) => ({
      sourceEvent,
      start: getEventStart(sourceEvent),
      end: getEventEnd(sourceEvent),
    }));
  }, [sourceEvents]);

  if (draggedEvent?.dragged) {
    const newDragged = {
      ...draggedEvent.source,
      ...draggedEvent.dragged,
    };
    newDragged.start = getEventStart(newDragged);
    newDragged.end = getEventEnd(newDragged);

    const snap = snapFn(newDragged.start, newDragged.end);
    newDragged.start = snap.start;
    newDragged.end = snap.end;

    const index = allEvents.findIndex(
      (ev) => ev.sourceEvent === draggedEvent.source.sourceEvent
    );
    if (index !== -1) {
      // it is a new event
      allEvents.splice(index, 1, newDragged);
    } else {
      // we are moving an existing event
      allEvents.push(newDragged);
    }
  }

  const events: ModifiableEvent<T>[] = React.useMemo(
    () => parseEventsInTimeline(allEvents, resolution, startTime),
    [allEvents, resolution, startTime]
  );

  const verticalPositionsRef = React.useRef<
    Record<number, number> | undefined
  >();

  const [timelineStart, timelineEnd] = React.useMemo(
    () => getTimelineRange(resolution, startTime),
    [resolution, startTime]
  );

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

  // half a screen of rows
  const padding = Math.floor(height / 17 / 2);

  const [direction, setDirection] = React.useState<"up" | "down">("down");
  const windowSize = !hasMeasuredHeight
    ? 0
    : Math.ceil(height / 17) + padding * 2;

  const [topRowIndex, setTopRowIndex] = React.useState(0);

  const startIndex = Math.max(topRowIndex - padding, 0);
  const endIndex = Math.min(topRowIndex + windowSize, events.length - 1);

  const eventsStickedToRows = React.useRef<Record<number, string[]>>({});

  const { persistedRows, assignedEvents, finishedRows, unassignedEvents } =
    React.useMemo(() => {
      const persistedRows: { index: number; ev: ModifiableEvent<T> }[][] = [[]];
      const assignedEvents = new Set<number>();
      const unassignedEvents = new Set<number>();
      for (let j = 0; j < events.length; j++) {
        unassignedEvents.add(j);
      }
      const finishedRows = new Set<number>();
      return { persistedRows, assignedEvents, finishedRows, unassignedEvents };
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

    let numCheckedEvents = 0;

    const stickyRows = Object.entries(eventsStickedToRows.current);

    const stickyEvents = new Map<string, number>();

    if (getId && stickyRows.length > 0) {
      for (let i = startIndex; i <= endIndex; i++) {
        if (eventsStickedToRows.current[i]) {
          eventsStickedToRows.current[i].forEach((evId) => {
            stickyEvents.set(evId, i);
          });
        }
      }
    }

    // go through each event and assign it to an eligble row if possible
    eventLoop: for (let j of unassignedEvents) {
      if (assignedEvents.has(j)) {
        continue;
      }
      const event = events[j];

      if (getId && stickyEvents.has(getId(event.sourceEvent))) {
        const rowIndex = stickyEvents.get(getId(event.sourceEvent));
        if (typeof rowIndex !== "undefined") {
          rows[rowIndex] = rows[rowIndex] ?? [];
          rows[rowIndex].push({ ev: event, index: j });
          assignedEvents.add(j);
          unassignedEvents.delete(j);
          continue;
        }
      }

      numCheckedEvents++;
      if (numCheckedEvents > 100 && assignedRowsToAllIndices) {
        break;
      }

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
            unassignedEvents.delete(j);
            assignedEvents.add(j);
            continue eventLoop;
          }
        }
        assignedRowsToAllIndices = true;
      } else {
        eligbleRow.push({ ev: event, index: j });
        assignedEvents.add(j);
        unassignedEvents.delete(j);
      }
    }
    for (let i = startIndex; i <= endIndex; i++) {
      finishedRows.add(i);
    }

    return rows;
  }, [
    events,
    startIndex,
    endIndex,
    persistedRows,
    finishedRows,
    unassignedEvents,
  ]);

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
    const emit = () => {
      const scrollTop = scrollableRef.scrollTop;
      setDirection(scrollTop > current ? "down" : "up");
      current = scrollTop;
      const newStartIndex = Math.floor(scrollTop / 17);
      setTimeout(() => {
        setTopRowIndex(newStartIndex);
      }, 0);
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) {
        return;
      }
      t = requestAnimationFrame(() => {
        emit();
        ticking = false;
      });
      ticking = true;
    };
    scrollableRef.addEventListener("scroll", onScroll, { passive: true });

    onScroll();

    // const i = setInterval(() => {
    //   const scrollTop = scrollableRef.scrollTop;
    //   setTopRowIndex((i) => i + 1);
    // }, 1000);

    return () => {
      // clearInterval(i);
      scrollableRef.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(t);
    };
  }, [scrollableRef, events.length]);

  const scrollLength =
    rows.length * 17 + (unassignedEvents.size === 0 ? 0 : padding);

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
              position: "absolute",
              pointerEvents: "none",
            }}
          ></Box>
          {/* <Box sx={{ height: startIndex * 17, backgroundColor: "red" }} /> */}
          <Box
            style={{
              transform: `translateY(${startIndex * 17}px)`,
              pointerEvents: "all",
            }}
          >
            {rows.slice(startIndex, endIndex + 1).map((row, index) => {
              let draggedEventForRow:
                | DraggedEvent<ModifiableEvent<T>>
                | undefined;
              if (
                row.some(
                  (r) => r.ev.sourceEvent === draggedEvent?.source.sourceEvent
                )
              ) {
                draggedEventForRow = draggedEvent;
                if (draggedEvent?.source.sourceEvent && getId) {
                  const stickyRow =
                    eventsStickedToRows.current[startIndex + index] ?? [];
                  eventsStickedToRows.current[startIndex + index] = stickyRow;

                  stickyRow.push(getId(draggedEvent?.source.sourceEvent));
                }
              }
              return (
                <Row
                  row={row}
                  key={startIndex + index}
                  draggedEvent={draggedEventForRow}
                  timelineStart={timelineStart}
                  timelineEnd={timelineEnd}
                  snapFn={snapFn}
                />
              );
            })}
          </Box>
        </Box>
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

const initial = Symbol();
/**
 * Use like `console.log(useDebugDeps([a, b, c]))` where `[a, b, c]` are the dependencies to e.g. a useEffect. This will log when one of the deps change
 * @public
 */
export const useDebugDeps = (...deps: unknown[]) => {
  const previousDeps = React.useRef<unknown[]>(deps.map(() => initial));
  const diffingDeps: unknown[] = [];
  deps.forEach((dep, index) => {
    const prev = previousDeps.current[index];
    if (prev === initial) {
      diffingDeps.push(tuple("initial_render", index, dep));
    } else if (prev !== dep) {
      diffingDeps.push(tuple(index, prev, dep));
    }
  });
  previousDeps.current = deps;
  return diffingDeps;
};

const Row = React.memo(function Row<T>({
  row,
  draggedEvent,
  timelineStart,
  timelineEnd,
  snapFn,
}: {
  row: { ev: ModifiableEvent<T>; index: number }[];
  draggedEvent?: DraggedEvent<ModifiableEvent<T>>;
  timelineStart: Date;
  timelineEnd: Date;
  snapFn: (start: Date, end: Date) => { start: Date; end: Date };
}) {
  const start = timelineStart.getTime();
  const end = timelineEnd.getTime();
  const totalSecondsOfMonth = end - start;
  const theme = useTheme();

  return (
    <Box
      style={{
        display: "flex",
        position: "relative",
        height: "17px",
        overflow: "hidden",
      }}
    >
      {row.map(({ ev: event, index }, rowEvIndex) => {
        const dragged = draggedEvent?.source.sourceEvent === event.sourceEvent;

        let evStart = event.start;
        let evEnd = event.end;

        if (dragged) {
          const newDragged = {
            ...draggedEvent.source,
            ...draggedEvent.dragged,
          };

          newDragged.start = getEventStart(newDragged);
          newDragged.end = getEventEnd(newDragged);

          if (snapFn) {
            const snap = snapFn(newDragged.start, newDragged.end);
            newDragged.start = snap.start;
            newDragged.end = snap.end;
          }

          evStart = newDragged.start;
          evEnd = newDragged.end;
        }

        const x = widthToPct(
          (720 * (evStart.getTime() - start)) / totalSecondsOfMonth
        );
        const w = widthToPct(
          (720 * (evEnd.getTime() - evStart.getTime())) / totalSecondsOfMonth
        );

        let width = differenceInCalendarDays(evEnd, evStart);
        if (evEnd.getTime() === endOfDay(evEnd).getTime()) {
          width += 1;
        }

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
              style={{
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
                paddingLeft: dragged ? "1px" : 0,
                paddingRight: dragged ? "1px" : 0,
                background: "white",
              }}
            >
              <Box
                style={{
                  borderRadius: "4px",
                  height: "16px",
                  overflow: "hidden",
                  boxShadow: dragged ? theme.shadows[4] : "none",
                  backgroundColor: color,
                  display: "flex",
                  justifyContent: "center",
                  flex: 1,
                  alignItems: "center",
                  flexShrink: 1,
                  whiteSpace: "nowrap",
                  padding: 0,
                  pointerEvents: "none",
                }}
              >
                <Box
                  style={{
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
                    style={{ color: theme.palette.primary.contrastText }}
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
});

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
