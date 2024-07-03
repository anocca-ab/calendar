import { Box, Button, ButtonProps, Divider, Typography } from "@mui/material";
import {
  addDays,
  addMinutes,
  addWeeks,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  endOfDay,
  format,
  getDate,
  getWeeksInMonth,
  isSameDay,
  isSameMonth,
  isSameWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import React, {
  ReactElement,
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { eventGrid, monthCalendarRange } from "../event_grid";
import { getEventEnd, isAllDayEvent, mergeSx, widthToPct } from "../helpers";
import { CalendarEvent, StartDay } from "../types";
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
import { CalendarAllDayEvent, MonthCalendarEvent } from "./calendar_events";
import { filterEventsInMonth } from "./filter_events_in_month";
import { splitMultiWeekEvents } from "./split_multi_week_events";

export const MonthCalendarConfigContext = createContext<
  | undefined
  | {
      startDay: StartDay;
      startOfMonth: Date;
      now: Date;
      onCreateEvent?: (start: Date, end: Date) => void;
      onMoveEvent?: (
        event: CalendarEvent,
        newStart: Date,
        newEnd: Date | undefined,
      ) => void;
    }
>(undefined);

export const useMonthCalendar = () => {
  const ctx = useContext(MonthCalendarConfigContext);
  if (!ctx) {
    throw new Error("useCalendar must be used within a CalendarConfigContext");
  }
  return ctx;
};

const parseDefaultProps = (
  props: React.ComponentPropsWithRef<typeof MonthCalendar>,
) => {
  const events = props.events ?? [];
  let startDay = props.startDay ?? "monday";

  const now = props.now ?? new Date();

  return {
    events,
    startDay,
    startOfMonth: startOfMonth(props.startOfMonth ?? new Date()),
    now,
    onCreateEvent: props.onCreateEvent,
    onMoveEvent: props.onMoveEvent,
    onEditEvent: props.onEditEvent,
  };
};

export function MonthCalendar(props: {
  /**
   * Events for the calendar
   * @default []
   */
  events?: CalendarEvent[];
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
  const { startDay, now, startOfMonth, ...calendarProps } =
    parseDefaultProps(props);

  const [allEvents, draggedEvent, setDraggedEvent] = useDragableEvents(
    calendarProps.events,
  );

  const [moreButtonClicked, setMoreButtonClicked] = useState<Date>(new Date());
  const modalRef = useRef<HTMLDivElement>(null);

  const daysInWeek = 7;

  // step 0.
  // get all the events that are part of the month
  const eventsInMonth: ModifiableEvent[] = filterEventsInMonth(
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
  const splitEvents = splitMultiWeekEvents(eventsInMonth, startDay);

  const { eventProperties, events, moreButtons } = eventGrid(
    splitEvents,
    startDay,
    monthCalendarRange(startDay, startOfMonth).startOfMonthCalendar,
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
    dragged: DragPosition<ModifiableEvent>,
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

      const rawDelta = Math.round(
        (state.pos.y - state.pos0.y + state.pos.scrollY - state.pos0.scrollY) /
          120,
      );

      const maxVal = Math.abs(
        Math.floor((container.height - state.pos0.y) / 120) + 1,
      );

      const minVal = weeksOfMonth - 1 - maxVal;
      const addedWeeks =
        Math.sign(rawDelta) > 0
          ? Math.min(rawDelta, maxVal)
          : Math.max(rawDelta, minVal);

      let start = dragged.event.sourceEvent.start;
      let end =
        dragged.event.sourceEvent.end ??
        addMinutes(dragged.event.sourceEvent.start, 15);

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

  const { onCreateEvent } = calendarProps;

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
            return <WeekIndicator key={i} title={`${i + 1}`} />;
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

              return (
                <FlexCol
                  key={i}
                  component={Button}
                  onClick={
                    onCreateEvent
                      ? () => {
                          const start = startOfDay(currentDate);
                          const end = endOfDay(currentDate);
                          onCreateEvent(start, end);
                        }
                      : undefined
                  }
                  sx={{
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
                    justifyContent: "flex-start",
                    zIndex: 1,
                    borderRadius: 0,
                  }}
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
                </FlexCol>
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
                    onClick={() => {
                      let startWeekDay = startOfDay(
                        startOfWeek(startOfMonth, {
                          weekStartsOn: startDay === "monday" ? 1 : 0,
                        }),
                      );

                      if (week === 0) {
                        day === 0
                          ? setMoreButtonClicked(startWeekDay)
                          : setMoreButtonClicked(
                              startOfDay(addDays(startWeekDay, day)),
                            );
                      } else {
                        day === 0
                          ? setMoreButtonClicked(
                              startOfDay(addWeeks(startWeekDay, week)),
                            )
                          : setMoreButtonClicked(
                              startOfDay(
                                addDays(addWeeks(startWeekDay, week), day),
                              ),
                            );
                      }
                      if (modalRef.current) {
                        modalRef.current.style.visibility = "visible";
                        modalRef.current.style.left = `${widthToPct(day * 120 - 20, daysInWeek)}`;
                        modalRef.current.style.top = `${week * 120 + row - 20}px`;
                      }
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
                let width = differenceInCalendarDays(event.end, event.start);
                if (event.end.getTime() === endOfDay(event.end).getTime()) {
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
                const props: React.ComponentPropsWithoutRef<
                  typeof CalendarAllDayEvent | typeof MonthCalendarEvent
                > = {
                  event: event.sourceEvent,
                  sx: {
                    width: widthToPct(width * 119 - 1, daysInWeek),
                    left: `${widthToPct(day * 120 + 2, daysInWeek)}`,
                    top: week * 120 + row * (16 + 1) + 1 + 32,
                    height: "16px",
                    position: "absolute",
                    zIndex: 2,
                  },
                  ...dataProps,
                };

                const startOfWeekOfEventEnd = startOfWeek(
                  getEventEnd(event.sourceEvent),
                  {
                    weekStartsOn: startDay === "monday" ? 1 : 0,
                  },
                );
                const firstWeekStart = startOfWeek(startOfMonth, {
                  weekStartsOn: startDay === "monday" ? 1 : 0,
                });

                const triangleLeft =
                  week === 0 &&
                  width === 7 &&
                  !isSameWeek(event.sourceEvent.start, firstWeekStart);
                const triangleRight =
                  weeksOfMonth === week + 1 &&
                  width === 7 &&
                  !isSameWeek(event.end, startOfWeekOfEventEnd);
                const triangle = triangleRight
                  ? "right"
                  : triangleLeft
                    ? "left"
                    : undefined;

                return (
                  <React.Fragment key={index}>
                    {(maxRow <= 5 ? row < 5 : row < 4) ? (
                      // it is not part of the "more" button
                      isAllDayEvent(event) ? (
                        <>
                          <CalendarAllDayEvent
                            key={index}
                            {...props}
                            triangle={triangle}
                          />
                        </>
                      ) : (
                        <>
                          <MonthCalendarEvent
                            key={index}
                            {...props}
                            state={
                              draggedEvent &&
                              event.sourceEvent ===
                                draggedEvent?.source.sourceEvent
                                ? "selected"
                                : "normal"
                            }
                          />
                        </>
                      )
                    ) : null}
                  </React.Fragment>
                );
              })}
            </>
          </Box>

          {/** More events modal */}
          <Box
            ref={modalRef}
            sx={{
              visibility: "hidden",
              px: "4px",
              py: "2px",
              height: "fit-content",
              width: widthToPct(140, daysInWeek),
              position: "absolute",
              inset: 0,
              zIndex: 3,
              bgcolor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.background.default
                  : "white",
              boxShadow: (theme) => theme.shadows[1],
              borderRadius: "4px",
            }}
          >
            <FlexCol width="100%" position="relative">
              <FlexCol height="56px">
                <FlexRow
                  height="40px"
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography
                    variant="body2"
                    color={
                      isSameDay(moreButtonClicked, startOfMonth)
                        ? (theme) => theme.palette.primary.contrastText
                        : isSameMonth(moreButtonClicked, startOfMonth)
                          ? (theme) => theme.palette.text.primary
                          : (theme) => theme.palette.text.secondary
                    }
                  >
                    {format(moreButtonClicked, "EEE")}
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
                      isSameDay(moreButtonClicked, startOfMonth)
                        ? (theme) => theme.palette.primary.contrastText
                        : isSameMonth(moreButtonClicked, startOfMonth)
                          ? (theme) => theme.palette.text.primary
                          : (theme) => theme.palette.text.secondary
                    }
                  >
                    {format(moreButtonClicked, "d")}
                  </Typography>
                </FlexRow>
              </FlexCol>
              <FlexCol
                gap="1px"
                sx={{
                  height: `${
                    eventsInMonth.filter((ev) =>
                      areIntervalsOverlapping(
                        {
                          start: moreButtonClicked,
                          end: endOfDay(moreButtonClicked),
                        },
                        { start: ev.start, end: ev.end },
                      ),
                    ).length * 18
                  }px`,
                }}
              >
                {moreButtonClicked &&
                  events
                    .filter((ev) =>
                      areIntervalsOverlapping(
                        {
                          start: moreButtonClicked,
                          end: endOfDay(moreButtonClicked),
                        },
                        { start: ev.start, end: ev.end },
                      ),
                    )
                    .map((event, index) => {
                      const { week, day, row } = eventProperties[`${index}`];
                      let width = differenceInCalendarDays(
                        event.end,
                        event.start,
                      );
                      if (
                        event.end.getTime() === endOfDay(event.end).getTime()
                      ) {
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
                      const props: React.ComponentPropsWithoutRef<
                        typeof CalendarAllDayEvent | typeof MonthCalendarEvent
                      > = {
                        event: event.sourceEvent,
                        sx: {
                          width: "132px",
                          top: week * 120 + row * (16 + 1) + 1 + 50,
                          height: "16px",
                          position: "absolute",
                          zIndex: 3,
                        },
                        ...dataProps,
                      };

                      return isAllDayEvent(event.sourceEvent) ? (
                        <CalendarAllDayEvent key={index} {...props} />
                      ) : (
                        <MonthCalendarEvent
                          key={index}
                          state="normal"
                          {...props}
                        />
                      );
                    })}
              </FlexCol>
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  if (modalRef.current) {
                    modalRef.current.style.visibility = "hidden";
                  }
                }}
              >
                Close
              </Button>
            </FlexCol>
          </Box>
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
