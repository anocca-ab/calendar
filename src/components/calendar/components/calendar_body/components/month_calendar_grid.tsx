import { Box, Divider } from "@mui/material";
import { filterWeekEvents } from "../../../helpers";
import { useCalendar } from "../../../state_management/calendar_context";
import type { CalendarEvent } from "../../../types";
import { FlexCol, FlexRow } from "../../wrappers";
import { MonthDayEventsCard } from "./month_day_events_card";

export function MonthCalendarGrid({
  gridEvents,
  allDayEvents,
}: {
  gridEvents: CalendarEvent[];
  allDayEvents: CalendarEvent[];
}) {
  const { workWeek, currentFirstDayOfTheWeek } = useCalendar();

  const filteredGridEvents: CalendarEvent[] = filterWeekEvents(
    gridEvents,
    currentFirstDayOfTheWeek,
  );

  const filteredAllDayEvents: CalendarEvent[] = filterWeekEvents(
    allDayEvents,
    currentFirstDayOfTheWeek,
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: workWeek ? "600px" : "840px",
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
        {[...Array(workWeek ? 6 : 8)].map((_, i) => {
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
      {(filteredAllDayEvents.length > 0 || filteredGridEvents) && (
        <>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
            }}
          >
            {/* {eventsComponents} */}

            <MonthDayEventsCard
              filteredAllDayEvents={filteredAllDayEvents}
              filteredGridEvents={filteredGridEvents}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
