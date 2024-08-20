import {
  Box,
  Button,
  ButtonProps,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import {
  addDays,
  addWeeks,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  differenceInDays,
  differenceInWeeks,
  endOfDay,
  format,
  getDate,
  getWeek,
  getWeeksInMonth,
  isSameDay,
  isSameMonth,
  max,
  min,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import React, {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { MoreButton, eventGrid, monthCalendarRange } from "../event_grid";
import {
  getEventEnd,
  getEventStart,
  isAllDayEvent,
  mergeSx,
  widthToPct,
} from "../helpers";
import { CalendarEvent, ScrollContainer, StartDay } from "../types";
import {
  DragPosition,
  EventContainer,
  MouseState,
  dayDiff,
  useDragableEvents,
  useEffectRefs,
  useMouse,
} from "../use_mouse";
import { ModifiableEvent } from "../week_calendar/types";
import { FlexCol, FlexRow } from "../wrappers";

import { filterEventsInMonth } from "./filter_events_in_month";
import { MonthCalendarEvent } from "./month_calendar_event";
import { splitMultiWeekEvents } from "./split_multi_week_events";

type RawContext<T> =
  | undefined
  | {
      startDay: StartDay;
      startOfMonth: Date;
      now: Date;
      onCreateEvent?: (start: Date, end?: Date) => void;
      onMoveEvent?: (
        event: CalendarEvent<T>,
        newStart: Date,
        newEnd: Date | undefined,
      ) => void;
    };
export const MonthCalendarConfigContext =
  createContext<RawContext<any>>(undefined);

export function useMonthCalendar<T>() {
  const ctx = useContext<RawContext<T>>(MonthCalendarConfigContext);
  if (!ctx) {
    throw new Error("useCalendar must be used within a CalendarConfigContext");
  }
  return ctx;
}

export type MonthCalendarProps<T> = {
  /**
   * Events for the calendar
   * @default []
   */
  events?: CalendarEvent<T>[];
  /**
   * start week on monday or sunday
   * @default 'monday'
   */
  startDay?: StartDay;
  /**
   * Some date during the month. We use the date-fns `startOfMonth` to derive the first day of the month
   * @default new Date()
   */
  startOfMonth?: Date;
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
    newEnd: Date | undefined,
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
};

function parseDefaultProps<T>(props: MonthCalendarProps<T>) {
  const events = props.events ?? [];
  let startDay = props.startDay ?? "monday";

  const now = props.now ?? new Date();

  const scrollContainers = props.scrollContainers ?? [];
  if (scrollContainers.length === 0) {
    scrollContainers.push(window);
  }

  return {
    events,
    startDay,
    startOfMonth: startOfMonth(props.startOfMonth ?? new Date()),
    now,
    onCreateEvent: props.onCreateEvent,
    onMoveEvent: props.onMoveEvent,
    onClickEvent: props.onClickEvent,
    scrollContainers,
  };
}

export function MonthCalendar<T>(props: MonthCalendarProps<T>) {
  const { startDay, now, startOfMonth, ...calendarProps } =
    parseDefaultProps(props);

  const [allEvents, draggedEvent, setDraggedEvent] = useDragableEvents(
    calendarProps.events,
  );

  const [moreButtonClicked, setMoreButtonClicked] = useState<
    MoreButton<T> | undefined
  >(undefined);
  const [moreEventsModalEl, setMoreEventsModalEl] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!moreEventsModalEl) {
      return;
    }
    const onClick = (event: MouseEvent) => {
      if (!event.target || !(event.target instanceof Node)) {
        return;
      }
      if (moreEventsModalEl.contains(event.target)) {
        return;
      }
      setMoreButtonClicked(undefined);
    };

    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("click", onClick);
    };
  }, [moreEventsModalEl]);

  const daysInWeek = 7;

  // step 0.
  // get all the events that are part of the month
  const eventsInMonth: ModifiableEvent<T>[] = filterEventsInMonth(
    allEvents,
    startDay,
    startOfMonth,
  );

  // step 1.
  // split up events that span multiple weeks into multiple events that span a maximum of 1 week
  // we also trim the events so they perfectly fit into our grid (see step 3)
  /**
   * Events that cross into a new week are split into two events or more
   */
  const splitEvents = splitMultiWeekEvents(
    eventsInMonth,
    startDay,
    startOfMonth,
  );

  const { startOfMonthCalendar, endOfMonthCalendar } = monthCalendarRange(
    startDay,
    startOfMonth,
  );

  const { eventProperties, events, moreButtons } = eventGrid(
    splitEvents,
    startDay,
    startOfMonthCalendar,
    endOfMonthCalendar,
  );

  const weeksOfMonth = getWeeksInMonth(startOfMonth, {
    weekStartsOn: startDay === "monday" ? 1 : 0,
  });

  // handle drag and drop
  /**
   * if event has moved return the new start and end time
   */
  function calculateNewTime(
    state: MouseState,
    dragged: DragPosition<ModifiableEvent<T>>,
    container: EventContainer,
  ) {
    if (state.pos && state.pos0) {
      const addedDays = dayDiff(
        state.pos,
        state.pos0,
        dragged,
        daysInWeek,
        container,
      );

      // for how many weeks minus/plus did we drag the event
      const rawDelta = Math.round(
        (state.pos.y - state.pos0.y + state.pos.scrollY - state.pos0.scrollY) /
          120,
      );

      // how many weeks plus we can drag
      const maxVal = Math.abs(
        Math.floor((container.height - state.pos0.y) / 120) + 1,
      );

      // how many weeks minus we can drag
      const minVal = -(weeksOfMonth - 1 - maxVal);

      // depending on the rawDelta sign we get the max/min added weeks
      const addedWeeks =
        Math.sign(rawDelta) > 0
          ? Math.min(rawDelta, maxVal)
          : Math.max(rawDelta, minVal);

      let start = getEventStart(dragged.event.sourceEvent);
      let end = getEventEnd(dragged.event.sourceEvent);

      if (addedWeeks !== 0) {
        start = addWeeks(start, addedWeeks);
        end = addWeeks(end, addedWeeks);
      }

      if (addedDays !== 0) {
        start = addDays(start, addedDays);
        end = addDays(end, addedDays);
      }

      if (addedWeeks !== 0 || addedDays !== 0) {
        return {
          start,
          end,
        };
      }
    }
    return undefined;
  }

  const [effectRefs, eventContainerRef] = useEffectRefs(
    events,
    setDraggedEvent,
    calculateNewTime,
    calendarProps,
  );

  useMouse("month-calendar-event", effectRefs, false);

  const theme = useTheme();

  const { onCreateEvent } = calendarProps;

  /**
   * Store events with same source event
   */
  const eventParts: Record<
    /** event index */
    string,
    /** list of events that have the same source event */
    ModifiableEvent<T>[]
  > = {};

  const sourceIndex: CalendarEvent<T>[] = [];
  const lists: Record<
    /** srcIndex */
    string,
    ModifiableEvent<T>[]
  > = {};

  events.forEach((event, index) => {
    let srcIndex = sourceIndex.indexOf(event.sourceEvent);
    if (srcIndex === -1) {
      srcIndex = sourceIndex.push(event.sourceEvent) - 1;
    }
    if (!lists[srcIndex]) {
      lists[srcIndex] = [];
    }
    if (!eventParts[index]) {
      eventParts[index] = lists[srcIndex];
    }
    eventParts[index].push(event);
  });

  let modal: undefined | ({ top: string; left: string } & MoreButton<T>) =
    undefined;
  if (moreButtonClicked) {
    const { week, day, date } = moreButtonClicked;

    modal = {
      ...moreButtonClicked,
      top: `${week * 120 - 20}px`,
      left: `${widthToPct(day * 120 - 10, daysInWeek)}`,
    };
  }

  return (
    <MonthCalendarConfigContext.Provider
      value={{
        startDay,
        now,
        ...calendarProps,
        startOfMonth: startOfMonth,
      }}
    >
      <FlexRow width="100%">
        {/* Week Indicator */}
        <FlexCol
          gap="1px"
          sx={{
            width: "20px",
            height: `${weeksOfMonth * 120 + 20}px`,
            alignItems: "stretch",
          }}
        >
          <FlexCol
            sx={{
              bgcolor: "rgba(236,239,241,1)",
              height: "20px",
              alignItems: "center",
              borderRadius: "4px",
            }}
          >
            <FlexCol
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="body2">W</Typography>
            </FlexCol>
          </FlexCol>
          {[...Array(weeksOfMonth)].map((_, i) => {
            return (
              <WeekIndicator key={i} title={`${getWeek(startOfMonth) + i}`} />
            );
          })}
        </FlexCol>

        {/* Grid */}
        <Box
          sx={{
            position: "relative",
            height: `${weeksOfMonth * 120 + 20}px`,
            flex: 1,
          }}
        >
          {/* Horizontal lines */}
          <FlexCol
            sx={{
              gap: "119px",
              position: "absolute",
              alignItems: "stretch",
              inset: 0,
              top: "20px",
            }}
          >
            {[...Array(weeksOfMonth)].map((_, i) => {
              return (
                <Divider
                  key={i}
                  sx={{
                    opacity: i === 0 || i === weeksOfMonth ? 0 : 1,
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
              justifyContent: "space-between",
              inset: 0,
            }}
          >
            {[...Array(8)].map((_, i) => {
              return (
                <Divider
                  key={i}
                  orientation="vertical"
                  sx={{
                    opacity: i === 0 ? 0 : 1,
                    width: "1px",
                  }}
                />
              );
            })}
          </FlexRow>

          <MonthCalendarWeekdayBar />

          {/* Clickable days */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              top: "20px",
            }}
          >
            {[...Array(weeksOfMonth * 7)].map((_, i) => {
              // Calculate the left position
              const left = widthToPct((i % 7) * 120, daysInWeek);

              // Calculate the top position
              const top = Math.floor(i / 7) * 120;

              const beginningOfCurrentWeek = addWeeks(
                startOfWeek(startOfMonth, {
                  weekStartsOn: startDay === "monday" ? 1 : 0,
                }),
                Math.floor(i / 7),
              );

              const currentDate = addDays(beginningOfCurrentWeek, i % 7);
              const isInCurrentMonth = isSameMonth(currentDate, startOfMonth);
              const dayNumber = getDate(currentDate);
              const monthName = format(currentDate, "MMM");
              const active = isSameDay(now, currentDate);

              const disableInteractive = !calendarProps.onCreateEvent;

              return (
                <Box
                  key={i}
                  component={Button}
                  disableRipple={disableInteractive}
                  onClick={
                    onCreateEvent
                      ? () => {
                          const start = startOfDay(currentDate);
                          const end = endOfDay(currentDate);
                          onCreateEvent(start, end);
                        }
                      : undefined
                  }
                  id={`day-${dayNumber}`}
                  sx={mergeSx(
                    {
                      height: "120px",
                      width: widthToPct(120, daysInWeek),
                      minWidth: "auto",
                      overflow: "hidden",
                      p: 0,
                      pt: "4px",
                      m: 0,
                      position: "absolute",
                      left: `${left}`,
                      top: `${top}px`,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      zIndex: 1,
                      borderRadius: 0,
                    },
                    disableInteractive && {
                      cursor: "auto",
                      ":hover": {
                        backgroundColor: "transparent",
                      },
                    },
                  )}
                >
                  <FlexRow
                    width="100px"
                    height="24px"
                    justifyContent="center"
                    alignItems="center"
                    gap="4px"
                  >
                    {dayNumber === 1 && !active && (
                      <Typography
                        variant="body2"
                        color={
                          isInCurrentMonth
                            ? (theme) => theme.palette.text.primary
                            : (theme) => theme.palette.text.secondary
                        }
                      >
                        {monthName}
                      </Typography>
                    )}
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        position: "relative",
                      }}
                    >
                      <FlexRow
                        sx={{
                          height: 24,
                          width: 24,
                          justifyContent: "center",
                          alignItems: "center",
                          position: "absolute",
                          borderRadius: 24,
                          backgroundColor: active
                            ? (theme) => theme.palette.primary.main
                            : "inherit",
                        }}
                      >
                        <Typography
                          zIndex={1}
                          variant="body2"
                          color={
                            active
                              ? (theme) => theme.palette.primary.contrastText
                              : isInCurrentMonth
                                ? (theme) => theme.palette.text.primary
                                : (theme) => theme.palette.text.secondary
                          }
                        >
                          {dayNumber}
                        </Typography>
                      </FlexRow>
                    </Box>
                  </FlexRow>
                </Box>
              );
            })}
          </Box>

          {/* Events */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              top: "20px",
            }}
            ref={eventContainerRef}
          >
            <>
              {moreButtons.map((moreButton, index) => {
                const { week, day, events: moreButtonEvents } = moreButton;
                const row = 4;
                return (
                  <MoreEventsButton
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setMoreButtonClicked(moreButton);
                    }}
                    className="more-events-button"
                    numHiddenEvents={moreButtonEvents.length}
                    key={index}
                    sx={{
                      width: widthToPct(119 - 1, daysInWeek),
                      left: `${widthToPct(day * 120 + 2, daysInWeek)}`,
                      top: week * 120 + row * (16 + 1) + 1 + 32,
                      height: "16px",
                      position: "absolute",
                      zIndex: 2,
                    }}
                  />
                );
              })}
            </>
            <>
              {events.map((event, index) => {
                const { week, day, row, maxRow } = eventProperties[`${index}`];

                const eventStart = max([
                  getEventStart(event),
                  startOfMonthCalendar,
                ]);
                const eventEnd = min([getEventEnd(event), endOfMonthCalendar]);

                let width = differenceInCalendarDays(eventEnd, eventStart);
                if (eventEnd.getTime() === endOfDay(eventEnd).getTime()) {
                  width += 1;
                }
                width = Math.max(width, 1);
                const dataProps: any = {
                  "data-type": "month-calendar-event",
                  "data-calendar-event": JSON.stringify({
                    x: day,
                    colX: 0,
                    index,
                    w: Math.max(width, 1),
                  }),
                };
                let triangleLeft = false;
                let triangleRight = false;

                // only if we are dealing with the first event of the "splitted events"
                if (eventParts[index].indexOf(event) === 0) {
                  triangleLeft =
                    event.start.getTime() < startOfMonthCalendar.getTime();
                }

                // only if we are dealing with the last event of the "splitted events"
                if (
                  eventParts[index].indexOf(event) ===
                  eventParts[index].length - 1
                ) {
                  triangleRight =
                    event.end.getTime() > endOfMonthCalendar.getTime();
                }

                const triangle =
                  triangleLeft && triangleRight
                    ? "both"
                    : triangleRight
                      ? "right"
                      : triangleLeft
                        ? "left"
                        : undefined;

                const disableInteractive =
                  !calendarProps.onClickEvent && !calendarProps.onMoveEvent;
                const disableRipple =
                  disableInteractive ||
                  (draggedEvent?.dragged &&
                    draggedEvent.source.sourceEvent === event.sourceEvent);
                const props: React.ComponentPropsWithoutRef<
                  typeof MonthCalendarEvent
                > = {
                  event: event.sourceEvent,
                  disableInteractive,
                  disableRipple,
                  sx: {
                    width: widthToPct(width * 119 - 4, daysInWeek),
                    left: `${widthToPct(day * 119 + 4, daysInWeek)}`,
                    top: week * 120 + row * (16 + 1) + 1 + 32,
                    height: "16px",
                    position: "absolute",
                    zIndex: 2,
                    cursor: disableInteractive ? "auto" : "pointer",
                    boxShadow:
                      !disableInteractive &&
                      draggedEvent?.dragged &&
                      draggedEvent.source.sourceEvent === event.sourceEvent
                        ? theme.shadows[4]
                        : theme.shadows[0],
                    opacity:
                      !disableInteractive &&
                      draggedEvent?.source.sourceEvent === event.sourceEvent
                        ? 0.5
                        : !disableInteractive &&
                            draggedEvent?.dragged &&
                            draggedEvent.source.sourceEvent ===
                              event.sourceEvent
                          ? 0.75
                          : 1,
                  },
                  allDayEvent: isAllDayEvent(event.sourceEvent),
                  state:
                    draggedEvent &&
                    event.sourceEvent === draggedEvent?.source.sourceEvent
                      ? "selected"
                      : "normal",
                  triangle,
                  dataProps,
                };

                return (
                  <React.Fragment key={index}>
                    {(maxRow <= 5 ? row < 5 : row < 4) ? (
                      <MonthCalendarEvent key={index} {...props} />
                    ) : null}
                  </React.Fragment>
                );
              })}
            </>
          </Box>

          {/** More events modal */}
          {modal && (
            <Box
              ref={setMoreEventsModalEl}
              id="more-event-modal"
              sx={{
                px: "4px",
                py: "2px",
                height: "fit-content",
                width: widthToPct(140, daysInWeek),
                position: "absolute",
                inset: 0,
                top: modal.top,
                left: modal.left,
                zIndex: 3,
                bgcolor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.background.default
                    : "white",
                boxShadow: (theme) => theme.shadows[1],
                borderRadius: "4px",
              }}
            >
              <FlexCol width="100%">
                <FlexCol height="66px">
                  <FlexRow
                    height="40px"
                    width="100%"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography
                      variant="body2"
                      color={
                        isSameDay(modal.date, startOfMonth)
                          ? (theme) => theme.palette.primary.contrastText
                          : isSameMonth(modal.date, startOfMonth)
                            ? (theme) => theme.palette.text.primary
                            : (theme) => theme.palette.text.secondary
                      }
                    >
                      {format(modal.date, "EEE")}
                    </Typography>
                  </FlexRow>
                  <FlexRow
                    height="40px"
                    width="100%"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography
                      variant="body2"
                      color={
                        isSameDay(modal.date, startOfMonth)
                          ? (theme) => theme.palette.primary.contrastText
                          : isSameMonth(modal.date, startOfMonth)
                            ? (theme) => theme.palette.text.primary
                            : (theme) => theme.palette.text.secondary
                      }
                    >
                      {format(modal.date, "d")}
                    </Typography>
                  </FlexRow>
                </FlexCol>
                <FlexCol
                  gap="1px"
                  position="relative"
                  sx={{
                    height: `${modal.allEvents.length * 18}px`,
                  }}
                >
                  {modal.allEvents.map((indexOfEvent, index) => {
                    const event = events[indexOfEvent];

                    const { week, day, row } =
                      eventProperties[`${indexOfEvent}`];

                    let width = differenceInCalendarDays(
                      event.end,
                      event.start,
                    );
                    if (event.end.getTime() === endOfDay(event.end).getTime()) {
                      width += 1;
                    }
                    width = Math.max(width, 1);
                    const dataProps: any = {
                      "data-type": "month-calendar-event",
                      "data-calendar-event": JSON.stringify({
                        x: day,
                        colX: 0,
                        index: indexOfEvent,
                        w: Math.max(width, 1),
                      }),
                    };

                    const disableInteractive =
                      !calendarProps.onClickEvent && !calendarProps.onMoveEvent;
                    const props: React.ComponentPropsWithoutRef<
                      typeof MonthCalendarEvent
                    > = {
                      event: event.sourceEvent,
                      disableInteractive,
                      sx: {
                        width: "100%",
                        top: index * (16 + 1),
                        height: "16px",
                        zIndex: 3,
                        cursor: disableInteractive ? "auto" : "pionter",
                      },
                      disableRipple: disableInteractive,
                      allDayEvent: isAllDayEvent(event.sourceEvent),
                      state:
                        draggedEvent &&
                        event.sourceEvent === draggedEvent?.source.sourceEvent
                          ? "selected"
                          : "normal",
                      ...dataProps,
                    };
                    return <MonthCalendarEvent key={indexOfEvent} {...props} />;
                  })}
                </FlexCol>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    setMoreButtonClicked(undefined);
                  }}
                >
                  Close
                </Button>
              </FlexCol>
            </Box>
          )}
        </Box>
      </FlexRow>
    </MonthCalendarConfigContext.Provider>
  );
}

function WeekIndicator({ title }: { title: string }) {
  return (
    <FlexCol
      sx={{
        bgcolor: "rgba(236,239,241,1)",
        height: "119px",
        padding: "4px 0px",
        alignItems: "center",
        gap: "10px",
        borderRadius: "4px",
      }}
    >
      <FlexCol
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="body2">{title}</Typography>
      </FlexCol>
    </FlexCol>
  );
}

function MoreEventsButton({
  numHiddenEvents,
  ...buttonProps
}: {
  numHiddenEvents: number;
} & ButtonProps) {
  return (
    <Button
      variant="text"
      {...buttonProps}
      sx={mergeSx(
        {
          justifyContent: "flex-start",
          m: 0,
          py: "0px",
          px: "5px",
          width: "117px",
          height: "16px",
          position: "absolute",
          bottom: "1px",
          borderRadius: "4px",
          overflow: "hidden",
          minWidth: "auto",
          whiteSpace: "nowrap",
        },
        buttonProps.sx,
      )}
    >
      <Typography
        sx={{
          color: "var(--Light-Primary-Dark, #1565C0)",
          textTransform: "none",
          fontFamily: "Roboto",
          fontSize: "10px",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "100%",
        }}
      >{`${numHiddenEvents} more`}</Typography>
    </Button>
  );
}

function MonthCalendarWeekdayBar() {
  const { startOfMonth, startDay, now } = useMonthCalendar();
  const daysInWeek = 7;

  const weekDays: ReactElement[] = [];
  [...Array(daysInWeek)].forEach((_, index) => {
    const dayOfWeek = format(
      addDays(
        startOfWeek(startOfMonth, {
          weekStartsOn: startDay === "monday" ? 1 : 0,
        }),
        index,
      ),
      "EEE",
    );

    weekDays.push(
      <FlexCol
        key={`weekday-${index}`}
        width={widthToPct(120, 7)}
        height="20px"
        justifyContent="center"
        alignItems="center"
        sx={{ whiteSpace: "nowrap", overflow: "hidden" }}
      >
        <Typography
          variant="caption"
          sx={{
            color: (theme) =>
              (theme.palette.mode === "dark" ? "white" : "black")
                ? theme.palette.text.primary
                : theme.palette.primary.contrastText,
          }}
        >
          {dayOfWeek}
        </Typography>
        {dayOfWeek === format(now, "EEE") && (
          <Divider
            orientation="horizontal"
            sx={{ width: "25px", height: "1px" }}
          />
        )}
      </FlexCol>,
    );
  });

  return (
    <FlexRow
      sx={{
        width: "100%",
      }}
    >
      {weekDays}
    </FlexRow>
  );
}
