import { Box, Divider } from "@mui/material";
import type { CalendarEvent } from "../types";
import { FlexCol, FlexRow } from "../wrappers";
import { MonthDayEventsCard } from "./month_day_events_card";
import { useMonthCalendar } from "./month_calendar";
import { addDays, addWeeks, getDate, startOfWeek } from "date-fns";

export function MonthCalendarWeekGrid({
  weekEvents,
  weekNumber,
}: {
  weekEvents: Record<
    string,
    {
      gridEvents: CalendarEvent[];
      allDayEvents: CalendarEvent[];
    }
  >;
  weekNumber: number;
}) {
  const { startDay, startOfMonth } = useMonthCalendar();

  // date-fns considers 0 to be always Sunday when using getDay
  // so we have to shift the first value of the array to the end
  // when starting day is Monday
  let days = [...Object.values(weekEvents)];
  const [first, ...rest] = days;
  const orderedDays =
    startDay === "monday" ? [...rest, first] : [first, ...rest];

  return (
    <Box
      sx={{
        position: "relative",
        width: "840px",
        height: "119px",
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
        {[...Array(2)].map((_, i) => {
          return (
            <Divider
              key={i}
              sx={{
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

      <FlexRow
        sx={{
          position: "absolute",
          inset: 0,
        }}
      >
        {orderedDays.map((day, i) => {
          const beginningOfCurrentWeek = addWeeks(
            startOfWeek(startOfMonth, {
              weekStartsOn: startDay === "monday" ? 1 : 0,
            }),
            weekNumber,
          );

          const dayNumber = getDate(addDays(beginningOfCurrentWeek, i));
          return (
            <MonthDayEventsCard
              key={i}
              filteredAllDayEvents={day.allDayEvents}
              filteredGridEvents={day.gridEvents}
              dayNumber={dayNumber}
            />
          );
        })}
      </FlexRow>
    </Box>
  );
}
