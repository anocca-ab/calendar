import type { CalendarEvent as CalendarEventType } from "../../types";
import { FlexRow } from "../wrappers";

export function MonthCalendarBody({
  gridEvents,
  allDayEvents,
}: {
  gridEvents: CalendarEventType[];
  allDayEvents: CalendarEventType[];
}) {
  return (
    <FlexRow
      sx={{
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      WIP
    </FlexRow>
  );
}
