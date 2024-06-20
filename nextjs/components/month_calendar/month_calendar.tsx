import { Box, Button, ButtonProps, Divider, Typography } from "@mui/material";
import {
  addDays,
  addMinutes,
  addWeeks,
  differenceInCalendarDays,
  endOfDay,
  format,
  getDate,
  getWeeksInMonth,
  isSameMonth,
  isSameWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import React, { createContext, useContext } from "react";
import { getEventEnd, isAllDayEvent, mergeSx } from "../helpers";
import { CalendarEvent, StartDay } from "../types";
import { ModifiableEvent } from "../week_calendar/types";
import {
  DragPosition,
  MouseState,
  dayDiff,
  useDragableEvents,
  useMouse,
} from "../week_calendar/use_mouse";
import { FlexCol, FlexRow } from "../wrappers";
import { CalendarAllDayEvent, MonthCalendarEvent } from "./calendar_events";
import { eventGrid } from "./event_grid";
import { MonthCalendarHeader } from "./month_calendar_header";
import { Triangle } from "../week_calendar/week_calendar";

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

type MonthEvent = {
  sourceEvent: CalendarEvent;
  start: Date;
  end: Date;
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
  const { startDay, now, ...calendarProps } = parseDefaultProps(props);

  const [allEvents, draggedEvent, setDraggedEvent] = useDragableEvents(
    calendarProps.events,
    "all-day",
  );

  const daysInWeek = 7;

  const { eventProperties, events, moreButtons } = eventGrid(
    allEvents,
    startDay,
    calendarProps.startOfMonth,
  );

  const weeksOfMonth = getWeeksInMonth(now, {
    weekStartsOn: startDay === "monday" ? 1 : 0,
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
      const addedDays = dayDiff(state.pos, state.pos0, dragged, daysInWeek);
      const addedWeeks = Math.floor(
        (state.pos.y - state.pos0.y + state.pos.scrollY - state.pos0.scrollY) /
          120,
      );

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

  useMouse("month-calendar-event", effectRefs, false);

  return (
    <MonthCalendarConfigContext.Provider
      value={{
        startDay,
        now,
        ...calendarProps,
      }}
    >
      <FlexCol width="904px" gap="1px">
        <MonthCalendarHeader />

        <FlexRow width="100%">
          {/* Week Indicator */}
          <FlexCol
            gap="1px"
            sx={{
              width: "20px",
              height: `${weeksOfMonth * 120}px`,
              alignItems: "stretch",
            }}
          >
            {[...Array(weeksOfMonth)].map((_, i) => {
              return <WeekIndicator key={i} title={`${i + 1}`} />;
            })}
          </FlexCol>

          {/* Grid */}
          <Box
            sx={{
              position: "relative",
              width: "840px",
              height: `${weeksOfMonth * 120}px`,
            }}
          >
            {/* Horizontal lines */}
            <FlexCol
              sx={{
                gap: "119px",
                position: "absolute",
                alignItems: "stretch",
                inset: 0,
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
                justifyContent: "flex-start",
                inset: 0,
                gap: "119px",
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

            {/* Clickable days */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
              }}
            >
              {[...Array(weeksOfMonth * 7)].map((_, i) => {
                // Calculate the top position
                const left = (i % 7) * 120;

                // Calculate the top position
                const top = Math.floor(i / 7) * 120;

                const beginningOfCurrentWeek = addWeeks(
                  startOfWeek(calendarProps.startOfMonth, {
                    weekStartsOn: startDay === "monday" ? 1 : 0,
                  }),
                  Math.floor(i / 7),
                );

                const currentDate = addDays(beginningOfCurrentWeek, i % 7);
                const isInCurrentMonth = isSameMonth(
                  currentDate,
                  calendarProps.startOfMonth,
                );
                const dayNumber = getDate(currentDate);
                const monthName = format(currentDate, "MMM");
                const active = getDate(now) === dayNumber;

                return (
                  <FlexCol
                    p={0}
                    m={0}
                    key={i}
                    component={Button}
                    position="absolute"
                    width="119px"
                    height="119px"
                    left={`${left}px`}
                    top={`${top}px`}
                    justifyContent="flex-start"
                    pt="4px"
                    zIndex={1}
                  >
                    <FlexRow
                      width="24px"
                      height="24px"
                      justifyContent="center"
                      alignItems="center"
                      gap="4px"
                    >
                      {dayNumber === 1 && (
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
                      {active && (
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            position: "absolute",
                            borderRadius: 24,
                            backgroundColor: (theme) =>
                              theme.palette.primary.main,
                          }}
                        ></Box>
                      )}
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
                  </FlexCol>
                );
              })}
            </Box>

            {/* Events */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
              }}
            >
              <>
                {moreButtons.map((moreButton, index) => {
                  const { week, day, events } = moreButton;
                  const row = 4;
                  return (
                    <MoreEventsButton
                      className="more-events-button"
                      numHiddenEvents={events.length}
                      key={index}
                      sx={{
                        width: 119 - 1,
                        left: `${day * 120 + 2}px`,
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
                  const { week, day, row, maxRow } =
                    eventProperties[`${index}`];
                  let width = differenceInCalendarDays(event.end, event.start);
                  if (event.end.getTime() === endOfDay(event.end).getTime()) {
                    width += 1;
                  }
                  const dataProps: any = {
                    "data-type": "month-calendar-event",
                    "data-calendar-event": JSON.stringify({
                      x: day,
                      colX: 0,
                      index,
                      w: width,
                    }),
                  };
                  const props: React.ComponentPropsWithoutRef<
                    typeof CalendarAllDayEvent | typeof MonthCalendarEvent
                  > = {
                    event: event.sourceEvent,
                    sx: {
                      width: width * 119 - 1,
                      left: `${day * 120 + 2}px`,
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
                  const firstWeekStart = startOfWeek(
                    calendarProps.startOfMonth,
                    {
                      weekStartsOn: startDay === "monday" ? 1 : 0,
                    },
                  );

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
                              state="normal"
                            />
                          </>
                        )
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </>
            </Box>
          </Box>
        </FlexRow>
      </FlexCol>
    </MonthCalendarConfigContext.Provider>
  );
}

function WeekIndicator({ title }: { title: string }) {
  return (
    <FlexCol
      sx={{
        backgroundColor: "var(--Blue-Gray-50, #ECEFF1);",
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
        <Typography
          variant="body2"
          color="var(--Light-Text-Primary, rgba(0, 0, 0, 0.87));"
        >
          {title}
        </Typography>
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
