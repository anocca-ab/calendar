import { Box, Divider } from "@mui/material";
import type { CalendarEvent } from "../types";
import { FlexCol, FlexRow } from "../wrappers";
import { MonthDayEventsCard } from "./month_day_events_card";

export function MonthCalendarWeekGrid({
  weekEvents,
}: {
  weekEvents: Record<
    string,
    {
      gridEvents: CalendarEvent[];
      allDayEvents: CalendarEvent[];
    }
  >;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        // width: workWeek ? "600px" : "840px",
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
        {Object.entries(weekEvents).map(([dayNr, day], i) => {
          return (
            <MonthDayEventsCard
              key={dayNr}
              filteredAllDayEvents={day.allDayEvents}
              filteredGridEvents={day.gridEvents}
            />
          );
        })}
      </FlexRow>
    </Box>
  );
}
