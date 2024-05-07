import { FlexCol, FlexRow } from "../wrappers";
import { CalendarGrid } from "./calendar_grid";
import { CalendarHeader } from "./calendar_header";
import { LayoutBar } from "./layout_bar";

export function Calendar() {
  return (
    <FlexCol width="664px" height="832px">
      <FlexCol>
        <LayoutBar />
        <CalendarHeader />
      </FlexCol>
      <CalendarGrid />
    </FlexCol>
  );
}
