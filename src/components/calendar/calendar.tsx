import { FlexCol } from "../wrappers";
import { CalendarGrid } from "./calendar_grid";
import { CalendarHeader } from "./calendar_header";
import { LayoutBar } from "./layout_bar";

export function Calendar() {
  return (
    <FlexCol width="100%" height="100%">
      <LayoutBar />
      <FlexCol width="100%">
        <CalendarHeader />
        <CalendarGrid />
      </FlexCol>
    </FlexCol>
  );
}
