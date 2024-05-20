import type { CalendarEvent as CalendarEventType } from "../../types";
import { FlexRow } from "../wrappers";
import { CalendarGrid } from "./components/calendar_grid";
import { CalendarGridAmPmSidebar } from "./components/calendar_grid_am_pm_sidebar";

export function CalendarBody({
  gridEvents,
}: {
  gridEvents: CalendarEventType[];
}) {
  return (
    <FlexRow
      sx={{
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <CalendarGridAmPmSidebar />
      <CalendarGrid events={gridEvents} />
    </FlexRow>
  );
}
