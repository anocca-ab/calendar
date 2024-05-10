import { FlexCol } from "../wrappers";
import { CalendarGrid } from "./calendar_grid";
import { CalendarHeader } from "./calendar_header";
import { CalendarFullDayEventBar } from "./calendar_full_day_event_bar";
import { CalendarLayoutBar } from "./calendar_layout_bar";

export function Calendar() {
  return (
    <FlexCol width="664px" height="832px">
      <FlexCol>
        <CalendarLayoutBar />
        <CalendarHeader />
        <CalendarFullDayEventBar eventHeight={2}/>
      </FlexCol>
      <CalendarGrid />
    </FlexCol>
  );
}
