import { Box, Button, Divider, Typography } from "@mui/material";
import {
  addDays,
  addMinutes,
  addWeeks,
  differenceInDays,
  differenceInMinutes,
  differenceInSeconds,
  endOfDay,
  format,
  getDate,
  getWeeksInMonth,
  isSameMonth,
  setDate,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { createContext, useContext } from "react";
import { isAllDayEvent } from "../helpers";
import { CalendarEvent, StartDay } from "../types";
import { FlexCol, FlexRow } from "../wrappers";
import { CalendarAllDayEvent } from "./calendar_all_day_event";
import { getEventsPerWeek, groupNonOverlappingEvents } from "./helpers";
import { MonthCalendarEvent } from "./month_calendar_event";
import { MonthCalendarHeader } from "./month_calendar_header";

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
    startOfMonth: setDate(now, 1),
    now,
    onCreateEvent: props.onCreateEvent,
    onMoveEvent: props.onMoveEvent,
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
}) {
  const { events, startDay, startOfMonth, now, onCreateEvent, onMoveEvent } =
    parseDefaultProps(props);

  const calendarWeeksEvents = getEventsPerWeek(events, startDay, now);

  const weeksOfMonth = getWeeksInMonth(now, {
    weekStartsOn: startDay === "monday" ? 1 : 0,
  });

  console.log(
    differenceInMinutes(startOfDay(new Date()), endOfDay(new Date())),
  );
  return (
    <MonthCalendarConfigContext.Provider
      value={{
        startDay,
        startOfMonth,
        now,
        onCreateEvent,
        onMoveEvent,
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
              return (
                <WeekIndicator
                  key={`weekIndicator-${i + 1}`}
                  title={`${i + 1}`}
                />
              );
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
                  startOfWeek(startOfMonth, {
                    weekStartsOn: startDay === "monday" ? 1 : 0,
                  }),
                  Math.floor(i / 7),
                );

                const currentDate = addDays(beginningOfCurrentWeek, i % 7);
                const isInCurrentMonth = isSameMonth(currentDate, startOfMonth);
                const dayNumber = getDate(currentDate);
                const monthName = format(currentDate, "MMM");
                const active = getDate(now) === dayNumber;

                return (
                  <FlexCol
                    p={0}
                    m={0}
                    key={`day-${i}`}
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
              {[...Array(weeksOfMonth)].map((_, i) => {
                const groupedEvents = groupNonOverlappingEvents(
                  calendarWeeksEvents[i],
                );
                // console.log(groupedEvents);
                return (
                  <Box
                    key={`week-${i}`}
                    height="87px"
                    width="840px"
                    position="absolute"
                    sx={{ top: `${i * 120 + 33}px` }}
                  >
                    {[...Array(5)].map((_, j) => {
                      return (
                        <Box
                          key={`row-${j + 1}`}
                          left="1px"
                          position="absolute"
                          top={`${j === 0 ? j * 16 : j * 16 + 1}px`}
                          width="840px"
                          height="16px"
                          zIndex={1}
                        >
                          {groupedEvents[j] &&
                            groupedEvents[j].length > 0 &&
                            groupedEvents[j].map((e, eventIndex) => {
                              const eventDuration = differenceInMinutes(
                                e.event.end ?? addMinutes(e.event.start, 15),
                                e.event.start,
                              );
                              if (eventDuration === 1339) {
                                return (
                                  <CalendarAllDayEvent
                                    key={`allDayEvent-${eventIndex}-week-${i}-row${j}`}
                                    {...e.event}
                                    sx={{
                                      width: "119px",
                                      left: `${e.left}px`,
                                      // top: e.top,
                                      position: "absolute",
                                    }}
                                  />
                                );
                              } else if (eventDuration >= 1440) {
                                console.log("duration", e.duration);
                                return (
                                  <CalendarAllDayEvent
                                    key={`multiDayEvent-${eventIndex}-week-${i}-row${j}`}
                                    {...e.event}
                                    sx={{
                                      width: `${(e.duration / 24) * 119}px`,
                                      // width: "100%",
                                      left: `${e.left}px`,
                                      // top: e.top,
                                      position: "absolute",
                                    }}
                                  />
                                );
                              } else {
                                return (
                                  <MonthCalendarEvent
                                    key={`normalEvent-${eventIndex}-week-${i}-row${j}`}
                                    {...e.event}
                                    sx={{
                                      left: `${e.left}px`,

                                      // top: e.top,
                                      position: "absolute",
                                    }}
                                    state="normal"
                                  />
                                );
                              }
                            })}
                        </Box>
                      );
                    })}
                  </Box>
                );
              })}
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

function MoreEventsButton({ number }: { number: number }) {
  return (
    <Button
      variant="text"
      sx={{
        justifyContent: "flex-start",
        m: 0,
        py: "0px",
        px: "5px",
        width: "117px",
        height: "16px",
        position: "absolute",
        bottom: "1px",
        borderRadius: "4px",
      }}
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
      >{`${number} more`}</Typography>
    </Button>
  );
}
