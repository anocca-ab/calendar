import { Box, Typography } from "@mui/material";
import { CalendarEvent, StartDay } from "../types";
import {
  StartOfWeekOptions,
  addDays,
  format,
  isSameDay,
  isSameWeek,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { FlexRow } from "../wrappers";

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
      ? startOfWeek(startOfMonth(rawSt), startOpts)
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
  const { events, startTime, resolution, now } = parseDefaultProps(props);
  return (
    <Box>
      <Header startTime={startTime} resolution={resolution} now={now} />
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
                <Typography
                  variant="h4"
                  color={(theme) =>
                    theme.palette.text[
                      isSameWeek(week, now) ? "primary" : "secondary"
                    ]
                  }
                >
                  W{format(week, "I")}
                </Typography>
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
                  sx={{ width: `${w - 1}px` }}
                >
                  <Typography
                    variant="event"
                    sx={{ fontSize: "8px" }}
                    color={(theme) => {
                      return theme.palette.text[
                        isSameDay(day, now) ? "primary" : "secondary"
                      ];
                    }}
                  >
                    {format(day, "d")}
                  </Typography>
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
