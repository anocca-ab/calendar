import { Box, Button, Divider, Typography, useTheme } from "@mui/material";
import {
  StartOfWeekOptions,
  addDays,
  addMinutes,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  differenceInDays,
  differenceInMinutes,
  endOfDay,
  startOfWeek as fnsStartOfWeek,
  format,
  getHours,
  getMinutes,
  isSameDay,
  startOfDay,
} from "date-fns";
import React from "react";
import { CalendarEvent, StartDay } from "../types";
import { FlexCol, FlexRow } from "../wrappers";
import { getAllDayOverlaps, isAllDayEvent, mergeSx } from "./helpers";
import { TimeIndicator } from "./time_indicator";
import {
  Graph,
  findAllCliques,
  findConnectedComponents,
} from "./find_sub_day_event_overlaps";
import { subDayEventSize } from "./sub_day_event_size";

export const CalendarConfigContext = React.createContext<
  | undefined
  | {
      startDay: StartDay;
      workWeek: boolean;
      startOfWeek: Date;
      now: Date;
      onCreateEvent?: (start: Date, end: Date) => void;
      onMoveEvent?: (
        event: CalendarEvent,
        newStart: Date,
        newEnd: Date | undefined,
      ) => void;
    }
>(undefined);

const useCalendar = () => {
  const ctx = React.useContext(CalendarConfigContext);
  if (!ctx) {
    throw new Error("useCalendar must be used within a CalendarConfigContext");
  }
  return ctx;
};

const parseDefaultProps = (
  props: React.ComponentPropsWithRef<typeof WeekCalendar>,
) => {
  const events = props.events ?? [];
  let startDay = props.startDay ?? "monday";
  let workWeek = props.workWeek ?? false;
  const now = props.now ?? new Date();
  if (workWeek) {
    startDay = "monday";
  }
  const startOpts: StartOfWeekOptions = {
    weekStartsOn: startDay === "monday" ? 1 : 0,
  };
  const startOfWeek = props.startOfWeek
    ? fnsStartOfWeek(props.startOfWeek, startOpts)
    : fnsStartOfWeek(new Date(), startOpts);
  return {
    events,
    startDay,
    workWeek,
    startOfWeek,
    now,
    onCreateEvent: props.onCreateEvent,
    onMoveEvent: props.onMoveEvent,
  };
};

export function WeekCalendar(props: {
  /**
   * Events for the calendar
   * @default []
   */
  events?: CalendarEvent[];
  /**
   * start week on monday or sunday. if workWeek is true, startDay will be monday
   * @default 'monday'
   */
  startDay?: StartDay;
  /**
   * Will render 5 days, mon-fri if true
   * @default false
   */
  workWeek?: boolean;
  /**
   * Some date during the week. We use the date-fns `startOfWeek` to derive the first day of the week
   * @default new Date()
   */
  startOfWeek?: Date;
  /**
   * The current time. It is used to render the current time indicator
   * @default new Date()
   */
  now?: Date;

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
    newEnd: Date | undefined,
  ) => void;
}) {
  const {
    events,
    startDay,
    workWeek,
    startOfWeek,
    now,
    onCreateEvent,
    onMoveEvent,
  } = parseDefaultProps(props);

  const allDayEvents: CalendarEvent[] = [];
  const gridEvents: CalendarEvent[] = [];

  events.forEach((event) => {
    const eventOverlapWithWeek = areIntervalsOverlapping(
      {
        start: startOfWeek,
        end: addDays(startOfWeek, workWeek ? 5 : 7),
      },
      { start: event.start, end: event.end ?? event.start },
    );

    if (!eventOverlapWithWeek) {
      return;
    }

    if (isAllDayEvent(event)) {
      allDayEvents.push(event);
    } else {
      gridEvents.push(event);
    }
  });

  return (
    <CalendarConfigContext.Provider
      value={{
        startDay,
        workWeek,
        startOfWeek,
        now,
        onCreateEvent,
        onMoveEvent,
      }}
    >
      <FlexCol width={workWeek ? "664px" : "904px"}>
        <FlexCol>
          <Box sx={{ width: 64 }}></Box>
          <WeekCalendarHeader events={allDayEvents} />
        </FlexCol>
        <FlexRow width="100%">
          <TimeSidebar />
          <Box width="100%">
            <FlexRow width="100%">
              <WeekCalendarGrid events={gridEvents} />
            </FlexRow>
          </Box>
        </FlexRow>
      </FlexCol>
    </CalendarConfigContext.Provider>
  );
}

type DraggedEvent = {
  /**
   * The new event that is being dragged (source event with new start/end)
   */
  dragged: CalendarEvent | undefined;
  /**
   * The event that is dragged
   */
  source: CalendarEvent;
};

function WeekCalendarHeader(props: { events: CalendarEvent[] }) {
  const { workWeek, startOfWeek, now, onCreateEvent, onMoveEvent } =
    useCalendar();
  const daysInWeek = workWeek ? 5 : 7;

  const events = [...props.events];
  const [draggedEvent, setDraggedEvent] = React.useState<
    DraggedEvent | undefined
  >(undefined);

  if (draggedEvent?.dragged) {
    events.splice(events.indexOf(draggedEvent.source), 1, draggedEvent.dragged);
  }

  const overlaps = getAllDayOverlaps(startOfWeek, daysInWeek, events);

  const maxOverlaps = Math.max(...Object.values(overlaps).map((o) => o.length));

  const totalHeight = 17 * maxOverlaps;

  const effectRefs = React.useRef({ onMoveEvent, events });
  effectRefs.current = { onMoveEvent, events };

  React.useEffect(() => {
    /**
     * Mouse state
     */
    const state: {
      down: boolean;
      pos: { x: number; y: number; scrollX: number } | undefined;
      pos0: { x: number; y: number; scrollX: number } | undefined;
    } = {
      down: false,
      pos: undefined,
      pos0: undefined,
    };
    /**
     * Data regarding the dragged mouse event
     */
    let dragged:
      | undefined
      | {
          event: CalendarEvent;
          x: number;
          y: number;
          w: number;
          elX: number;
        } = undefined;

    /**
     * Same as the React.state draggedEvent, but outside the context of react state
     * A "live" version, whereas the state version is only updated after react component updates
     */
    let draggedEvent: DraggedEvent | undefined = undefined;
    const mouseDown = (ev: MouseEvent) => {
      if (ev.target instanceof HTMLElement) {
        if (ev.target.dataset.type === "week-calendar-event") {
          state.down = true;
          state.pos0 = {
            x: ev.clientX,
            y: ev.clientY,
            scrollX: window.scrollX,
          };
          const data: { index: number; x: number; y: number; w: number } =
            JSON.parse(ev.target.dataset.calendarEvent!);
          const event = effectRefs.current.events[data.index];
          const rect = ev.target.getBoundingClientRect();
          dragged = {
            event,
            x: data.x,
            y: data.y,
            w: data.w,
            elX: rect.x,
          };
        }
      }
    };
    const mouseMove = (ev: MouseEvent) => {
      state.pos = {
        x: ev.clientX,
        y: ev.clientY,
        scrollX: window.scrollX,
      };
      update();
    };
    const mouseUp = (ev: MouseEvent) => {
      state.down = false;
      state.pos = undefined;
      state.pos0 = undefined;
      if (draggedEvent) {
        if (draggedEvent.dragged) {
          if (effectRefs.current.onMoveEvent) {
            effectRefs.current.onMoveEvent(
              draggedEvent.source,
              draggedEvent.dragged.start,
              draggedEvent.dragged.end,
            );
          }
        }
      }
      draggedEvent = undefined;
      setDraggedEvent(undefined);
    };
    const scroll = (ev: Event) => {
      if (!state.pos) {
        return;
      }
      state.pos = {
        ...state.pos,
        scrollX: window.scrollX,
      };
      update();
    };
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("scroll", scroll);

    function update() {
      if (state.pos && state.down && state.pos0 && dragged) {
        if (state.pos.x !== state.pos0.x) {
          // we have moved the mouse sideways
          const rawDelta =
            state.pos.x +
            (state.pos0.x - dragged.elX) -
            state.pos0.x +
            state.pos.scrollX -
            state.pos0.scrollX;
          // each event is 120px wide, so we can calculate how many days we have moved
          const delta = Math.min(
            Math.max(Math.floor(rawDelta / 120), -dragged.x),
            daysInWeek - dragged.x - 1,
          );
          const hoverredDay = dragged.x + delta;
          /**
           * Update the "live" dragged event
           */
          draggedEvent = {
            source: dragged.event,
            dragged:
              hoverredDay !== dragged.x
                ? {
                    ...dragged.event,
                    start: addDays(dragged.event.start, delta),
                    end: addDays(
                      dragged.event.end ?? endOfDay(dragged.event.start),
                      delta,
                    ),
                  }
                : undefined,
          };
          setDraggedEvent(draggedEvent);
        }
      }
    }
    return () => {
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("scroll", scroll);
    };
  }, [daysInWeek, setDraggedEvent]);

  const weekDays = [...Array(daysInWeek)].map((_, index) => {
    const day = addDays(startOfWeek, index);
    return (
      <Box
        component={onCreateEvent ? Button : "div"}
        key={index}
        onClick={
          onCreateEvent
            ? () => {
                const start = startOfDay(day);
                const end = endOfDay(day);
                onCreateEvent(start, end);
              }
            : undefined
        }
        sx={mergeSx(
          onCreateEvent
            ? {
                border: 0,
                p: 0,
                display: "block",
                background: "none",
                cursor: "pointer",
              }
            : undefined,
          {
            pt: 1,
          },
        )}
      >
        <DayHeader date={day} active={isSameDay(now, day)} />
        <Box sx={{ height: "12px" }} />
        <FlexRow sx={{ height: totalHeight }}>
          <Divider orientation="vertical" />
        </FlexRow>
      </Box>
    );
  });

  const theme = useTheme();

  return (
    <FlexCol width="100%">
      <Box pl={8}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${daysInWeek}, 1fr)`,
            position: "relative",
          }}
        >
          {weekDays}

          {events.map((event, index) => {
            const start = startOfDay(event.start);
            const end = event.end ?? endOfDay(event.start);

            const x = Math.max(
              differenceInCalendarDays(start, startOfDay(startOfWeek)),
              0,
            );
            const y = overlaps[x].indexOf(event);
            const maxWidth = daysInWeek - x;
            const width = Math.min(differenceInCalendarDays(end, start) + 1, maxWidth);

            const style = {
              height: 16,
              width: 119 * width - 8,
            };
            const color = event.color ?? "hsl(0 50 50)";

            return (
              <Box
                key={index}
                component={"button"}
                data-type="week-calendar-event"
                data-calendar-event={JSON.stringify({ x, y, index, w: width })}
                sx={mergeSx(
                  {
                    border: 0,
                    p: 0,
                    m: 0,
                    cursor: "pointer",
                    position: "absolute",
                    background: color,
                    bottom: totalHeight - y * 17 - 16,
                    left: x * 120 + 2,
                    display: "flex",
                    justifyContent: "flex-start",
                    px: 1,
                    alignItems: "center",
                    borderRadius: 1,
                    ...style,
                  },
                  draggedEvent?.source === event && {
                    opacity: 0.5,
                  },
                  draggedEvent?.dragged === event && {
                    opacity: 0.75,
                    boxShadow: theme.shadows[4],
                  },
                )}
              >
                <Typography
                  color={(theme) => theme.palette.primary.contrastText}
                  variant="event"
                  // sx={{
                  //   fontFamily: (theme) => theme.typography.fontFamily,
                  //   fontSize: "10px",
                  //   fontStyle: "normal",
                  //   fontWeight: "500",
                  //   lineHeight: "14px",
                  //   pointerEvents: "none",
                  // }}
                >
                  {event.title}
                </Typography>
              </Box>
            );
          })}
        </Box>
        <Divider sx={{ marginLeft: "-16px" }}></Divider>
      </Box>
    </FlexCol>
  );
}

function DayHeader({ date, active }: { date: Date; active?: boolean }) {
  const dayOfWeek = format(date, "EEE");
  const dayOfMonthNr = format(date, "d");

  return (
    <FlexCol
      width={120}
      height={52}
      alignItems="center"
      justifyContent="flex-start"
      flexShrink={0}
      position={"relative"}
    >
      {active && (
        <Box
          sx={{
            width: 36,
            height: 36,
            position: "absolute",
            borderRadius: 36,
            bottom: -2,
            backgroundColor: (theme) => theme.palette.primary.main,
          }}
        ></Box>
      )}
      <FlexCol height={20} justifyContent={"center"} alignItems={"center"}>
        <Typography
          variant="caption"
          color={active ? "primary" : (theme) => theme.palette.text.primary}
        >
          {dayOfWeek}
        </Typography>
      </FlexCol>

      <FlexCol
        height={32}
        justifyContent={"center"}
        alignItems={"center"}
        zIndex={1}
      >
        <Typography
          variant="h5"
          color={
            active
              ? (theme) => theme.palette.primary.contrastText
              : (theme) => theme.palette.text.primary
          }
        >
          {dayOfMonthNr}
        </Typography>
      </FlexCol>
    </FlexCol>
  );
}

function TimeSidebar() {
  return (
    <FlexCol
      sx={{
        width: "64px",
        padding: "29px 24px 0px 0px",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      {[...Array.from({ length: 12 }, (_, i) => i + 1)].map((hour, index) => {
        return (
          <FlexCol
            key={index + hour}
            sx={{
              height: "60px",
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              color={(theme) => theme.palette.text.primary}
            >
              {hour === 12 ? `${hour} PM` : `${hour} AM`}
            </Typography>
          </FlexCol>
        );
      })}
      {[...Array.from({ length: 11 }, (_, i) => i + 1)].map((hour, index) => {
        return (
          <FlexCol
            key={index + hour}
            sx={{
              height: "60px",
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              color={(theme) => theme.palette.text.primary}
            >{`${hour} PM`}</Typography>
          </FlexCol>
        );
      })}
    </FlexCol>
  );
}

function WeekCalendarGrid(props: { events: CalendarEvent[] }) {
  const { workWeek, now, startOfWeek } = useCalendar();
  const events: CalendarEvent[] = [...props.events];

  /**
   * index overlaps with what other indexes
   */
  const overlaps: Graph = [];
  events.forEach((event, index) => {
    if (!overlaps[index]) {
      overlaps[index] = [];
    }
    events.forEach((otherEvent, otherIndex) => {
      if (event === otherEvent) {
        return;
      }
      if (!overlaps[otherIndex]) {
        overlaps[otherIndex] = [];
      }
      if (
        areIntervalsOverlapping(
          {
            start: event.start,
            end: event.end ?? addMinutes(event.start, 15),
          },
          {
            start: otherEvent.start,
            end: otherEvent.end ?? addMinutes(otherEvent.start, 15),
          },
        )
      ) {
        if (!overlaps[index].includes(otherIndex)) {
          overlaps[index].push(otherIndex);
        }
        if (!overlaps[otherIndex].includes(index)) {
          overlaps[otherIndex].push(index);
        }
      }
    });
  });

  const components = findConnectedComponents(overlaps);
  console.log("Connected Components:", components);

  let maxCliques: number[][] = [];

  let numCols: Record<
    /**
     * Event index
     */
    number,
    /**
     * Number of columns
     */
    number
  > = {};

  components.forEach((component, index) => {
    const cliques = findAllCliques(overlaps, component);
    // console.log(`All Cliques in Component ${index}:`, cliques);

    const maxCliqueSizeForComponent = cliques.reduce((max, clique) => {
      return clique.length > max ? clique.length : max;
    }, 0);

    component.forEach((index) => {
      numCols[index] = maxCliqueSizeForComponent;

      const cliquesForEvent = cliques.filter((clique) =>
        clique.includes(index),
      );
      const maxCliqueForEvent = cliquesForEvent.reduce((max, clique) => {
        return clique.length > max.length ? clique : max;
      }, []);
      // console.log("Max Clique for Event", index, maxClique);

      maxCliqueForEvent.sort(sortEvent);
      if (
        !maxCliques
          .map((clique) => clique.join(""))
          .includes(maxCliqueForEvent.join(""))
      ) {
        maxCliques.push(maxCliqueForEvent);
      }
    });
  });

  function sortEvent(a: number, b: number) {
    const startTimeSort = events[a].start.getTime() - events[b].start.getTime();
    if (startTimeSort === 0) {
      return (
        (events[a].end ?? addMinutes(events[a].start, 15)).getTime() -
        (events[b].end ?? addMinutes(events[b].start, 15)).getTime()
      );
    }
    return startTimeSort;
  }

  maxCliques.sort((a, b) => {
    if (a.length === 0 || b.length === 0) {
      return 0;
    }
    return sortEvent(a[0], b[0]);
  });

  const horizontalPositions: Record<
    /**
     * event index
     */
    number,
    /**
     * horizontal position
     */
    number
  > = {};
  maxCliques.forEach((clique) => {
    clique.forEach((evIndex, horizontalPos) => {
      if (typeof horizontalPositions[evIndex] === "undefined") {
        horizontalPositions[evIndex] = horizontalPos;
      }
    });
  });

  console.log("@maxCliques", maxCliques, horizontalPositions, numCols);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: 1440,
      }}
    >
      {/* Horizontal lines */}
      <FlexCol
        sx={{
          gap: "59px",
          position: "absolute",
          alignItems: "stretch",
          inset: 0,
        }}
      >
        {[...Array(25)].map((_, i) => {
          return (
            <Divider
              key={i}
              sx={{
                marginLeft: "-16px",
                opacity: i === 0 ? 0 : 1,
              }}
            />
          );
        })}
      </FlexCol>
      {/* Vertical lines */}
      <FlexRow
        sx={{
          position: "absolute",
          alignItems: "stretch",
          justifyContent: "flex-start",
          inset: 0,
          gap: "119px",
        }}
      >
        {[...Array(workWeek ? 6 : 8)].map((_, i) => {
          return (
            <Divider
              key={i}
              orientation="vertical"
              sx={{
                opacity: workWeek && i === 5 ? 0 : !workWeek && i == 7 ? 0 : 1,
              }}
            />
          );
        })}
      </FlexRow>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
        }}
      >
        {/* {eventsComponents} */}
        {/* Time Indicator */}
        <Box
          className="time-indicator"
          sx={{
            position: "absolute",
            top: getHours(now) * 60 + getMinutes(now),
            left: differenceInCalendarDays(now, startOfWeek) * 120 - 5,
          }}
        >
          <TimeIndicator />
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
        }}
      >
        {events.map((event, index) => {
          const height = event.end
            ? differenceInMinutes(event.end, event.start)
            : 15;
          const color = event.color ?? "hsl(0 50 50)";
          const top = differenceInMinutes(event.start, startOfDay(event.start)) + 1;
          const left = differenceInCalendarDays(event.start, startOfWeek) * 120;
          const n = numCols[index];
          const horPos = horizontalPositions[index];
          const rect = subDayEventSize(n, horPos);
          return (
            <Box
              key={index}
              sx={{
                position: "absolute",
                top,
                left: left + rect.x + 1,
                height: height - 1,
                background: color,
                width: rect.w,
                zIndex: horPos,
                border: (theme) =>
                  `1px solid ${theme.palette.primary.contrastText}`,
                borderRadius: 1,
              }}
            >
              <Typography color={(theme) => theme.palette.primary.contrastText}>
                {event.title ?? "(No name)"}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
