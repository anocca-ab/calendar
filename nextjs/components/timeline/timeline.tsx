import { Box, Typography } from "@mui/material";
import { CalendarEvent, StartDay } from "../types";
import {
  StartOfWeekOptions,
  addDays,
  differenceInCalendarDays,
  endOfDay,
  format,
  getWeeksInMonth,
  isSameDay,
  isSameWeek,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { FlexCol, FlexRow } from "../wrappers";
import { useDragableEvents } from "../week_calendar/use_mouse";
import { eventGrid } from "./event_grid";
import {
  CalendarAllDayEvent,
  MonthCalendarEvent,
} from "../month_calendar/calendar_events";
import { ModifiableEvent } from "../week_calendar/types";
import { getEventEnd, isAllDayEvent } from "../helpers";
import React from "react";
import { EventTypography } from "../month_calendar/helpers";

type Resolution = "year" | "month" | "3-years" | "3-months";

const parseDefaultProps = (
  props: React.ComponentPropsWithRef<typeof Timeline>,
) => {
  const events = props.events ?? [];
  let startDay = props.startDay ?? "monday";
  const now = props.now ?? new Date();
  const startOpts: StartOfWeekOptions = {
    weekStartsOn: startDay === "monday" ? 1 : 0,
  };
  const resolution = props.resolution ?? "month";

  const rawSt = props.startTime ?? new Date();

  const startTime =
    resolution === "month"
      ? // ? startOfWeek(startOfMonth(rawSt), startOpts)
        startOfMonth(rawSt)
      : resolution === "3-months"
        ? startOfMonth(rawSt)
        : resolution === "year"
          ? startOfYear(rawSt)
          : resolution === "3-years"
            ? startOfYear(rawSt)
            : undefined;

  if (!startTime) {
    throw new Error(
      'invalid resolution, must be one of "month", "3-months", "year", "3-years"',
    );
  }

  return {
    events,
    startDay,
    startTime,
    startOfWeek,
    resolution,
    now,
    onCreateEvent: props.onCreateEvent,
    onMoveEvent: props.onMoveEvent,
    onEditEvent: props.onEditEvent,
  };
};

export function Timeline(props: {
  /**
   * Events for the calendar
   * @default []
   */
  events?: CalendarEvent[];
  /**
   * Will be e.g. start of the year / month / quarter / 3 years / 3 months depending on the resolution
   * @default new Date()
   */
  startTime?: Date;
  /**
   * What view do we want to show
   * @default "month"
   */
  resolution?: Resolution;
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
    events: calendarEvents,
    startTime,
    resolution,
    now,
    startDay,
  } = parseDefaultProps(props);

  const [allEvents, draggedEvent, setDraggedEvent] =
    useDragableEvents(calendarEvents);

  const { eventProperties, events, moreButtons, grid } = eventGrid(
    allEvents,
    startDay,
    startOfMonth(startTime),
  );

  return (
    <Box>
      <Header startTime={startTime} resolution={resolution} now={now} />
      <Grid
        startTime={startTime}
        resolution={resolution}
        now={now}
        events={events}
        eventProperties={eventProperties}
        startDay={startDay}
      />
    </Box>
  );
}

function Grid({
  startTime,
  now,
  resolution,
  events,
  eventProperties,
  startDay,
}: {
  startDay: StartDay;
  startTime: Date;
  now: Date;
  resolution: Resolution;
  events: ModifiableEvent[];
  eventProperties: {
    [index: string]: {
      row: number;
      day: number;
      hourSlot: number;
      maxRow: number;
    };
  };
}) {
  return (
    <Box
      sx={{
        position: "relative",
        height: "120px",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
        }}
      >
        {events.map((event, index) => {
          const { hourSlot, day, row, maxRow } = eventProperties[`${index}`];

          let width = differenceInCalendarDays(event.end, event.start);
          if (event.end.getTime() === endOfDay(event.end).getTime()) {
            width += 1;
          }
          const dataProps: any = {
            "data-type": "timeline-month-calendar-event",
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
              width: `${width * 16 - 1}px`,
              left: `${day * 16 + hourSlot * 2}px`,
              top: row * (16 + 1) + 1 + 32,
              height: "16px",
              position: "absolute",
              zIndex: 2,
            },
            ...dataProps,
          };
          console.log("event", event.sourceEvent, eventProperties[`${index}`]);

          return (
            <React.Fragment key={index}>
              {(maxRow <= 5 ? row < 5 : row < 4) ? (
                // it is not part of the "more" button
                isAllDayEvent(event) ? (
                  <>
                    <Box
                      zIndex={2}
                      sx={{
                        width: `${width * 16 - 1}px`,
                        left: `${day * 16 + hourSlot * 2}px`,
                        top: row * (16 + 1) + 1 + 32,
                        height: "16px",
                        position: "absolute",
                        overflow: "hidden",
                      }}
                    >
                      <FlexRow
                        sx={{
                          backgroundColor: event.sourceEvent.color ?? "#FF7043",
                          justifyContent: "flex-start",
                          padding: "0px 8px",
                          flex: 1,
                          borderRadius: "4px",
                          alignItems: "center",
                        }}
                      >
                        <EventTypography>
                          {event.sourceEvent.title ?? "(No title)"}
                        </EventTypography>
                      </FlexRow>
                    </Box>
                  </>
                ) : (
                  <>
                    {/* <MonthCalendarEvent key={index} {...props} state="normal" /> */}
                    <Box
                      zIndex={2}
                      sx={{
                        width: `${(hourSlot + 1) * 2}px`,
                        left: `${day * 16 + hourSlot * 2}px`,
                        top: row * (16 + 1) + 1 + 32,
                        height: "16px",
                        position: "absolute",
                        backgroundColor: "blue",
                      }}
                    />
                  </>
                )
              ) : null}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
}

function Header({
  startTime,
  now,
  resolution,
}: {
  startTime: Date;
  resolution: Resolution;
  now: Date;
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
        <FlexRow>
          {weeks.flatMap((week, index) => {
            const els = [
              <FlexRow
                key={index}
                sx={{ width: "119px" }}
                justifyContent={"center"}
              >
                <Box>
                  <Typography
                    variant="h4"
                    color={(theme) =>
                      theme.palette.text[
                        isSameWeek(week, now) ? "primary" : "secondary"
                        // or maybe use isSameISOWeek
                      ]
                    }
                  >
                    W{format(week, "I")}
                  </Typography>
                  {isSameWeek(week, now) && (
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
            if (index < weeks.length - 1) {
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
                </Box>,
              );
            }
            return els;
          })}
        </FlexRow>
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
                      backgroundColor: (theme) => theme.palette.divider,
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
  return <Box></Box>;
  return null;
}
