import { Box, Button, Divider, Typography, useTheme } from "@mui/material";
import {
  StartOfWeekOptions,
  addDays,
  addMinutes,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  differenceInMinutes,
  endOfDay,
  startOfWeek as fnsStartOfWeek,
  format,
  isSameDay,
  max,
  min,
  startOfDay,
} from "date-fns";
import React from "react";
import { getEventColor, isAllDayEvent, mergeSx } from "../helpers";
import { CalendarNavigationBar } from "../navigation_bar/calendar_navigation_bar";
import { CalendarEvent, StartDay } from "../types";
import { FlexCol, FlexRow } from "../wrappers";
import { CalendarConfigContext, useCalendar } from "./context";
import {
  Clique,
  findAllCliques,
  findConnectedComponents,
  findEventOverlaps,
  getAllDayOverlaps,
} from "./event_overlap_functions";
import { subDayEventSize } from "./sub_day_event_size";
import { TimeIndicator } from "./time_indicator";
import { ModifiableEvent } from "./types";
import {
  DragPosition,
  MouseState,
  dayDiff,
  useDragableEvents,
  useMouse,
} from "./use_mouse";

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
    onEditEvent: props.onEditEvent,
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

  /**
   * Triggered when an event clicked - open a modal or similar interface to edit the event
   * @param event a calendar event
   * @returns void
   */
  onEditEvent?: (event: CalendarEvent) => void;
}) {
  const {
    events,
    startDay,
    workWeek,
    startOfWeek,
    now,
    onCreateEvent,
    onMoveEvent,
    onEditEvent,
  } = parseDefaultProps(props);

  const [currentWeek, setCurrentWeek] = React.useState(startOfWeek);

  const allDayEvents: CalendarEvent[] = [];
  const gridEvents: CalendarEvent[] = [];

  events.forEach((event) => {
    const eventOverlapWithWeek = areIntervalsOverlapping(
      {
        start: currentWeek,
        end: addDays(currentWeek, workWeek ? 5 : 7),
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
        startOfWeek: currentWeek,
        now,
        onCreateEvent,
        onEditEvent,
        onMoveEvent,
      }}
    >
      <FlexCol width={workWeek ? "664px" : "904px"}>
        <FlexCol>
          <Box sx={{ width: 64 }}></Box>
          <CalendarNavigationBar
            now={now}
            startDay={startDay}
            currentDate={currentWeek}
            setCurrentDate={setCurrentWeek}
            type="week"
          />
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

export const Triangle = ({
  width,
  height,
  direction,
  color,
}: {
  width: number;
  height: number;
  direction: "left" | "right";
  color: string;
}) => {
  const points =
    direction === "left"
      ? `${width},0 0,${height / 2} ${width},${height}`
      : `0,0 ${width},${height / 2} 0,${height}`;

  return (
    <Box
      component="svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      sx={{ flexShrink: 0 }}
    >
      <polygon points={points} fill={color} />
    </Box>
  );
};

/**
 * All day events that are from 00:00:00 to 23:59:59 are considered to be all day, so when running differenceInCalendarDays we want 1 to appear
 */
const parseAllDayEnd = (end: Date) => {
  if (endOfDay(end).getTime() === end.getTime()) {
    return startOfDay(addDays(end, 1));
  }
  return end;
};

function WeekCalendarHeader(props: { events: CalendarEvent[] }) {
  const { workWeek, startOfWeek, now, onCreateEvent, ...calendarProps } =
    useCalendar();
  const daysInWeek = workWeek ? 5 : 7;

  const [events, draggedEvent, setDraggedEvent] = useDragableEvents(
    props.events,
  );

  const overlaps = getAllDayOverlaps(startOfWeek, daysInWeek, events);

  const maxOverlaps = Math.max(...Object.values(overlaps).map((o) => o.length));

  const totalHeight = 17 * maxOverlaps;

  // handle drag and drop
  /**
   * if event has moved return the new start and end time
   */
  function calculateNewTime(
    state: MouseState,
    dragged: DragPosition<ModifiableEvent>,
  ) {
    if (state.pos && state.pos0) {
      const addedDays = dayDiff(state.pos, state.pos0, dragged, daysInWeek);
      if (addedDays !== 0) {
        return {
          start: addDays(dragged.event.start, addedDays),
          end: addDays(
            dragged.event.end ?? endOfDay(dragged.event.start),
            addedDays,
          ),
        };
      }
    }
    return undefined;
  }

  const ome = calendarProps.onMoveEvent;
  const onMoveEvent = ome
    ? (event: ModifiableEvent, start: Date, end?: Date) => {
        ome(event.sourceEvent, start, end);
      }
    : undefined;
  const oev = calendarProps.onEditEvent;
  const onEditEvent = oev
    ? (event: ModifiableEvent) => {
        oev(event.sourceEvent);
      }
    : undefined;

  const effectRefs = React.useRef({
    onMoveEvent,
    events,
    onEditEvent,
    setDraggedEvent,
    calculateNewTime,
  });

  effectRefs.current = {
    onMoveEvent,
    events,
    onEditEvent,
    setDraggedEvent,
    calculateNewTime,
  };

  useMouse("week-calendar-all-day-event", effectRefs, workWeek);

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
            const end = parseAllDayEnd(event.end ?? endOfDay(event.start));
            const endOfWeek = addDays(startOfWeek, daysInWeek);

            const rawX = differenceInCalendarDays(start, startOfWeek);

            const x = Math.max(rawX, 0);
            const y = overlaps[x].indexOf(event);
            const width = differenceInCalendarDays(
              min([end, endOfWeek]),
              max([start, startOfWeek]),
            );

            const style = {
              height: 16,
              width: 119 * width - 8,
            };

            const dayOverflowRight = differenceInCalendarDays(end, endOfWeek);

            const { bg, color } = getEventColor(
              now,
              end,
              theme,
              event.sourceEvent.color,
            );

            return (
              <Box
                className="all-day-event"
                key={index}
                component={Button}
                data-type="week-calendar-all-day-event"
                data-calendar-event={JSON.stringify({
                  x,
                  colX: 0,
                  index,
                  w: width,
                })}
                disableRipple={
                  draggedEvent?.dragged &&
                  draggedEvent?.source.sourceEvent === event.sourceEvent
                }
                sx={mergeSx(
                  {
                    border: 0,
                    p: 0,
                    m: 0,
                    minWidth: "auto",
                    background: "none",
                    cursor: "pointer",
                    position: "absolute",
                    bottom: totalHeight - y * 17 - 16,
                    left: x * 120 + 2,
                    ...style,
                    display: "flex",
                    justifyContent: "stretch",
                    alignItems: "stretch",
                    "*": {
                      pointerEvents: "none",
                    },
                  },
                  draggedEvent?.source.sourceEvent === event.sourceEvent && {
                    opacity: 0.5,
                  },
                  draggedEvent?.dragged &&
                    draggedEvent?.source.sourceEvent === event.sourceEvent && {
                      opacity: 0.75,
                      boxShadow: theme.shadows[4],
                    },
                )}
              >
                {rawX < 0 ? (
                  <AllDayCalendarOverflow
                    direction="left"
                    value={rawX}
                    color={bg}
                    valueDate={start}
                    compact={width <= 1}
                  />
                ) : null}
                <Box
                  sx={{
                    background: bg,
                    display: "flex",
                    justifyContent: "flex-start",
                    flex: 1,
                    px: 1,
                    alignItems: "center",
                    borderRadius: 1,
                    borderTopLeftRadius: rawX < 0 ? 0 : 4,
                    borderBottomLeftRadius: rawX < 0 ? 0 : 4,
                    borderTopRightRadius: dayOverflowRight > 0 ? 0 : 4,
                    borderBottomRightRadius: dayOverflowRight > 0 ? 0 : 4,
                    paddingLeft: rawX < 0 ? 0 : 1,
                    pointerEvents: "none",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    color={color}
                    variant="event"
                    sx={{
                      pointerEvents: "none",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    {event.sourceEvent.title ?? "(No name)"}
                  </Typography>
                </Box>
                {dayOverflowRight > 0 ? (
                  <AllDayCalendarOverflow
                    direction="right"
                    value={dayOverflowRight}
                    color={bg}
                    valueDate={end}
                    compact={width <= 1}
                  />
                ) : null}
              </Box>
            );
          })}
        </Box>
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
  const { workWeek, now, startOfWeek, ...calendarProps } = useCalendar();
  const daysInWeek = workWeek ? 5 : 7;

  const [allEvents, draggedEvent, setDraggedEvent] = useDragableEvents(
    props.events,
  );

  /**
   * Events that cross 12am are split into two events
   */
  const events: ModifiableEvent[] = allEvents.flatMap((defaultEvent) => {
    let parts: { start: Date; end: Date }[] = [];
    if (differenceInCalendarDays(defaultEvent.end, defaultEvent.start) > 0) {
      // split event up into multiple events to not overflow a single day
      // an event can't be longer than a day

      const part0 = {
        start: defaultEvent.start,
        end: endOfDay(defaultEvent.start),
      };
      parts.push(part0);
      while (true) {
        const startOfPrevious = parts[parts.length - 1].start;
        const nextDay = startOfDay(addDays(startOfPrevious, 1));
        const nextDayEnd = min([endOfDay(nextDay), defaultEvent.end]);
        parts.push({
          start: nextDay,
          end: nextDayEnd,
        });
        if (nextDayEnd.getTime() >= defaultEvent.end.getTime()) {
          break;
        }
      }
      return parts.map((part) => ({
        sourceEvent: defaultEvent.sourceEvent,
        start: part.start,
        end: part.end,
      }));
    }
    return defaultEvent;
  });

  /**
   * Overlaps is a graph where each event is a node and each edge is an overlap between two events
   * For each event, which other events is it overlapping with?
   */
  const overlaps = findEventOverlaps(events);

  /**
   * Each component is an array of event indexes that are connected (like an island in a graph)
   */
  const components = findConnectedComponents(overlaps);

  /**
   * The clique of a graph is a subset of nodes where each node is connected to every other node, i.e. where each event overlaps with every other event
   * Each event can be part of many cliques, but this represents the largest clique for an event, so the max over
   */
  let maxCliques: Clique[] = [];

  /**
   * An improved lookup table for the number of columns for a given event
   */
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

  // create the numCols and find the maxCliques
  components.forEach((component, index) => {
    const cliques = findAllCliques(overlaps, component);

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

  /**
   * Our sorting algo for the events
   * sort by start time and the by end time
   */
  function sortEvent(a: number, b: number) {
    const startTimeSort = events[a].start.getTime() - events[b].start.getTime();
    if (startTimeSort === 0) {
      return events[a].end.getTime() - events[b].end.getTime();
    }
    return startTimeSort;
  }

  maxCliques.sort((a, b) => {
    if (a.length === 0 || b.length === 0) {
      return 0;
    }
    return sortEvent(a[0], b[0]);
  });

  /**
   * Which column should the event be placed in?
   * This is a lookup table for the horizontal position of an event
   */
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

  // construct the horizontal positions
  maxCliques.forEach((clique) => {
    const novelPositions = clique.filter(
      (evIndex) => typeof horizontalPositions[evIndex] === "undefined",
    );
    const fixedPositions = clique.filter(
      (evIndex) => typeof horizontalPositions[evIndex] !== "undefined",
    );

    const horPos: (null | number)[] = [...clique].map(() => null);

    // pin fixed positions
    fixedPositions.forEach((evIndex) => {
      horPos[horizontalPositions[evIndex]] = evIndex;
    });

    // add novel positions
    novelPositions.forEach((evIndex) => {
      const nextPos = horPos.findIndex((pos) => pos === null);
      horPos[nextPos] = evIndex;
    });

    horPos.forEach((evIndex, horizontalPos) => {
      if (evIndex === null) {
        return;
      }
      if (typeof horizontalPositions[evIndex] === "undefined") {
        // is novel
        horizontalPositions[evIndex] = horizontalPos;
      }
    });
  });

  // handle drag and drop
  /**
   * if event has moved return the new start and end time
   */
  function calculateNewTime(
    state: MouseState,
    dragged: DragPosition<ModifiableEvent>,
  ) {
    if (state.pos && state.pos0) {
      const addedMin =
        state.pos.y - state.pos0.y + state.pos.scrollY - state.pos0.scrollY;
      const addedDays = dayDiff(state.pos, state.pos0, dragged, daysInWeek);

      let start = dragged.event.sourceEvent.start;
      let end =
        dragged.event.sourceEvent.end ??
        addMinutes(dragged.event.sourceEvent.start, 15);

      if (addedMin !== 0) {
        start = addMinutes(start, addedMin);
        end = addMinutes(end, addedMin);
      }

      if (addedDays !== 0) {
        start = addDays(start, addedDays);
        end = addDays(end, addedDays);
      }

      if (addedMin !== 0 || addedDays !== 0) {
        return {
          start,
          end,
        };
      }
    }
    return undefined;
  }

  const ome = calendarProps.onMoveEvent;
  const onMoveEvent = ome
    ? (event: ModifiableEvent, start: Date, end?: Date) => {
        ome(event.sourceEvent, start, end);
      }
    : undefined;
  const oev = calendarProps.onEditEvent;
  const onEditEvent = oev
    ? (event: ModifiableEvent) => {
        oev(event.sourceEvent);
      }
    : undefined;

  const effectRefs = React.useRef({
    onMoveEvent,
    events,
    onEditEvent,
    setDraggedEvent,
    calculateNewTime,
  });

  effectRefs.current = {
    onMoveEvent,
    events,
    onEditEvent,
    setDraggedEvent,
    calculateNewTime,
  };

  useMouse("week-calendar-sub-day-event", effectRefs, workWeek);

  const theme = useTheme();

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
        className="horizontal-lines"
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
        {events.map((event, index) => {
          const height = Math.max(
            event.end
              ? differenceInMinutes(event.end, event.start, {
                  roundingMethod: "round",
                })
              : 15,
            15,
          );
          const top = differenceInMinutes(
            event.start,
            startOfDay(event.start),
            {
              roundingMethod: "round",
            },
          );
          const x = differenceInCalendarDays(event.start, startOfWeek);
          const left = x * 120;
          const n = numCols[index];
          const horPos = horizontalPositions[index];
          const rect = subDayEventSize(n, horPos);
          /**
           * if the event goes over 12am then the event might be split into multiple events
           */
          const events = allEvents
            .filter((ev) => ev.sourceEvent === event.sourceEvent)
            .sort((a, b) => a.start.getTime() - b.start.getTime());

          const displayStart = events[0].start;
          const displayEnd = events[events.length - 1].end;
          const time = (
            <>
              {format(displayStart, height >= 30 ? "h:mm" : "h:mmaaa")}
              {event.sourceEvent.end && height >= 30 ? (
                <> – {format(displayEnd, "h:mmaaa")}</>
              ) : null}
            </>
          );
          const colX = rect.x;

          const { bg, color } = getEventColor(
            now,
            event.sourceEvent.end ?? addMinutes(event.sourceEvent.start, 15),
            theme,
            event.sourceEvent.color,
          );

          return (
            <Box
              className={"grid-event"}
              component={Button}
              key={index}
              data-type="week-calendar-sub-day-event"
              data-calendar-event={JSON.stringify({
                x,
                index,
                w: 1,
                colX,
              })}
              disableRipple={
                draggedEvent?.dragged &&
                draggedEvent.source.sourceEvent === event.sourceEvent
              }
              sx={mergeSx(
                {
                  position: "absolute",
                  textAlign: "left",
                  minWidth: "auto",
                  padding: 0,
                  margin: 0,
                  top: top + 1,
                  left: left + colX + 1,
                  height: height - 1,
                  width: rect.w,
                  zIndex: horPos,
                  "*": {
                    pointerEvents: "none",
                  },
                  display: "flex",
                  justifyContent: "stretch",
                  alignItems: "stretch",
                },
                draggedEvent?.source.sourceEvent === event.sourceEvent && {
                  opacity: 0.5,
                },
                draggedEvent?.dragged &&
                  draggedEvent.source.sourceEvent === event.sourceEvent && {
                    opacity: 0.75,
                    boxShadow: theme.shadows[4],
                  },
              )}
            >
              <Box
                sx={mergeSx(
                  {
                    flex: 1,
                    background: bg,
                    border: (theme) =>
                      `1px solid ${theme.palette.primary.contrastText}`,
                    borderRadius: 1,
                    overflow: "hidden",
                    px: "7px",
                    py: height >= 35 ? "3px" : 0,
                  },
                  height < 35 && {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  },
                )}
              >
                <Typography
                  color={color}
                  variant="event"
                  component="div"
                  sx={{
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {event.sourceEvent.title ?? "(No name)"}
                  {height < 30 ? (
                    <Box component="span" sx={{ fontWeight: 400 }}>
                      {", "}
                      {time}
                    </Box>
                  ) : null}
                </Typography>
                {height >= 30 && (
                  <Typography
                    component="div"
                    color={color}
                    variant="event"
                    sx={{
                      pointerEvents: "none",
                      whiteSpace: "nowrap",
                      fontWeight: 400,
                    }}
                  >
                    {time}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        {/* Time Indicator */}
        <Box
          className="time-indicator"
          sx={{
            position: "absolute",
            top: differenceInMinutes(now, startOfDay(now)),
            left: differenceInCalendarDays(now, startOfWeek) * 120,
          }}
        >
          <TimeIndicator />
        </Box>
      </Box>
    </Box>
  );
}

function AllDayCalendarOverflow({
  direction,
  value,
  color,
  valueDate,
  compact,
}: {
  direction: "left" | "right";
  value: number;
  valueDate: Date;
  color: string;
  compact?: boolean;
}) {
  const t = (
    <>
      {Math.sign(value) === -1 ? "-" : "+"}
      {Math.abs(value)}d
    </>
  );
  const d = <>({format(valueDate, "LLL do")})</>;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: direction === "right" ? "row-reverse" : "row",
        pointerEvents: "none",
      }}
    >
      <Triangle direction={direction} height={16} width={12} color={color} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 0.5,
          background: color,
        }}
      >
        <Typography
          variant="event"
          color={(theme) => theme.palette.primary.contrastText}
          sx={{
            whiteSpace: "nowrap",
            opacity: 0.7,
            fontWeight: "regular",
          }}
        >
          {compact ? (
            <>{t}</>
          ) : (
            <>
              {t} {d}
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
}

function isNumber(val: number | null): asserts val is number {
  if (val === null) {
    throw new Error("Expected a number");
  }
}
