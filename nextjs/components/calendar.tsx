import { Box, Button, Divider, Typography } from "@mui/material";
import {
  StartOfWeekOptions,
  addDays,
  addMinutes,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  differenceInDays,
  endOfDay,
  startOfWeek as fnsStartOfWeek,
  format,
  getHours,
  getMinutes,
  isSameDay,
  startOfDay,
  subMilliseconds,
} from "date-fns";
import { Roboto } from "next/font/google";
import React from "react";
import { CalendarEvent } from "./types";
import { FlexCol, FlexRow } from "./wrappers";
import { TimeIndicator } from "./time_indicator";
import {
  getAllDayOverlaps as getAllDayOverlaps,
  isAllDayEvent,
  mergeSx,
} from "./helpers";

type StartDay = "monday" | "sunday";

export const CalendarConfigContext = React.createContext<
  | undefined
  | {
      startDay: StartDay;
      workWeek: boolean;
      startOfWeek: Date;
      now: Date;
      onCreateEvent?: (start: Date, end: Date) => void;
    }
>(undefined);

const useCalendar = () => {
  const ctx = React.useContext(CalendarConfigContext);
  if (!ctx) {
    throw new Error("useCalendar must be used within a CalendarConfigContext");
  }
  return ctx;
};

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

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
}) {
  const { events, startDay, workWeek, startOfWeek, now, onCreateEvent } =
    parseDefaultProps(props);

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
      }}
    >
      <FlexCol
        width={workWeek ? "664px" : "904px"}
        sx={{
          color: "rgba(0, 0, 0, 0.87)",
          WebkitFontSmoothing: "antialiased",
          // Antialiasing.
          MozOsxFontSmoothing: "grayscale",
          "& *": {
            boxSizing: "border-box",
          },
        }}
        className={roboto.className}
      >
        <FlexCol>
          <Box sx={{ width: 64 }}></Box>
          <WeekCalendarHeader events={allDayEvents} />
        </FlexCol>
        <FlexRow width="100%">
          <TimeSidebar />
          <Box width="100%">
            <FlexRow width="100%">
              <WeekCalendarGrid events={events} />
            </FlexRow>
          </Box>
        </FlexRow>
      </FlexCol>
    </CalendarConfigContext.Provider>
  );
}

function WeekCalendarHeader({ events }: { events: CalendarEvent[] }) {
  const { workWeek, startOfWeek, now, onCreateEvent } = useCalendar();
  const daysInWeek = workWeek ? 5 : 7;

  const overlaps = getAllDayOverlaps(startOfWeek, daysInWeek, events);

  const maxOverlaps = Math.max(...Object.values(overlaps).map((o) => o.length));

  const totalHeight = 17 * maxOverlaps;

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
              differenceInDays(start, startOfDay(startOfWeek)),
              0,
            );
            const y = overlaps[x].indexOf(event) * 17;
            const maxWidth = daysInWeek - x;
            const width = Math.min(differenceInDays(end, start) + 1, maxWidth);

            return (
              <Box
                key={index}
                sx={{
                  position: "absolute",
                  background: "hsl(0 50 50)",
                  bottom: totalHeight - y - 16,
                  left: x * 120 + 2,
                  height: 16,
                  width: 119 * width - 8,
                  display: "flex",
                  justifyContent: "flex-start",
                  px: 1,
                  alignItems: "center",
                  borderRadius: 1,
                }}
                onDragStart={(e) => {
                  e.preventDefault();
                  console.log(event);
                }}
                component={"div"}
              >
                <Typography
                  color={(theme) => theme.palette.primary.contrastText}
                  sx={{
                    fontFamily: "Roboto",
                    fontSize: "10px",
                    fontStyle: "normal",
                    fontWeight: "500",
                    lineHeight: "14px",
                  }}
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

function WeekCalendarGrid({ events }: { events: CalendarEvent[] }) {
  const { workWeek, now, startOfWeek } = useCalendar();

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
    </Box>
  );
}
