import { FlexCol } from "../../../components/wrappers";
import { CalendarEvent } from "../../../types";
import { CalendarAllDayEvent } from "../../calendar_header/components/calendar_all_day_event";
import { MonthCalendarEvent } from "./month_calendar_event";

export function MonthDayEventsCard({
  filteredGridEvents,
  filteredAllDayEvents,
}: {
  filteredGridEvents: CalendarEvent[];
  filteredAllDayEvents: CalendarEvent[];
}) {
  const allDayEvents = filteredGridEvents.map((e) => (
    <CalendarAllDayEvent {...e} sx={{ width: "118px" }} />
  ));
  const gridEvents = filteredAllDayEvents.map((e) => (
    <MonthCalendarEvent {...e} state="normal" />
  ));
  return (
    <FlexCol height="85px" gap={1} p="1px">
      <FlexCol>{allDayEvents[0]}</FlexCol>
      <FlexCol>
        {gridEvents[0]}
        {gridEvents[1]}
      </FlexCol>
    </FlexCol>
  );
}
