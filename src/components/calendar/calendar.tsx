import { FlexCol } from "./wrappers";
import { CalendarGrid } from "./components/calendar_grid/calendar_grid";
import { CalendarHeader } from "./components/calendar_header/calendar_header";

export function Calendar() {
  return (
    // the height should be 832px but is being removed because messes with the live editor
    <FlexCol width="664px">
      <CalendarHeader />
      <CalendarGrid />
    </FlexCol>
  );
}
