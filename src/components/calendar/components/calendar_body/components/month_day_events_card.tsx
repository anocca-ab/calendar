import { Box } from "@mui/material";
import { FlexCol } from "../../../components/wrappers";
import { CalendarEvent } from "../../../types";
import { CalendarAllDayEvent } from "../../calendar_header/components/calendar_all_day_event";
import { MonthCalendarEvent } from "./month_calendar_event";
import { MoreEventsButton } from "./more_events_button";

export function MonthDayEventsCard({
  filteredGridEvents,
  filteredAllDayEvents,
}: {
  filteredGridEvents: CalendarEvent[];
  filteredAllDayEvents: CalendarEvent[];
}) {
  const allDayEvents = filteredAllDayEvents.map((e) => (
    <CalendarAllDayEvent {...e} sx={{ width: "118px" }} />
  ));
  const gridEvents = filteredGridEvents.map((e) => (
    <MonthCalendarEvent {...e} state="normal" />
  ));

  const events = [...allDayEvents, ...gridEvents];
  return (
    <FlexCol height="120px" gap="1px" p="1px">
      {events.length > 7
        ? [...Array(7)].map((_, i) => {
            if (i === 6) {
              return (
                // <Box position="absolute" bottom="0px" sx={{ height: "16px" }}>
                <MoreEventsButton number={events.length - 6} />
                // </Box>
              );
            }
            return events[i];
          })
        : events}
    </FlexCol>
  );
}
