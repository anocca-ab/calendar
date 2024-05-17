import "@fontsource/roboto";

export { CalendarEntry } from "./calendar_entry";
export { CalendarBody } from "./components/calendar_body/calendar_body";
export { formatDuration as calculateTitleDuration } from "./components/calendar_body/components/calendar_event";
export { CalendarGrid } from "./components/calendar_body/components/calendar_grid";
export { CalendarGridAmPmSidebar } from "./components/calendar_body/components/calendar_grid_am_pm_sidebar";
export { HourCalendarCell } from "./components/calendar_body/components/hour_calendar_cell";
export { CalendarHeader } from "./components/calendar_header/calendar_header";
export { CalendarAllDayEvent } from "./components/calendar_header/components/calendar_all_day_event";
export { CalendarFullDayEventBar } from "./components/calendar_header/components/calendar_full_day_event_bar";
export { CalendarLayoutBar } from "./components/calendar_header/components/calendar_layout_bar";
export { CalendarWeekViewBar } from "./components/calendar_header/components/calendar_week_view_bar";
export { DayNumberStackDate } from "./components/calendar_header/components/day_number_stack_date";
export { MonthYearRowDate } from "./components/calendar_header/components/month_year_row_date";
export { WeekChip } from "./components/calendar_header/components/week_chip";
export { FlexCol, FlexRow } from "./components/wrappers";
export { eventsFixture, renderFixtureEvents } from "./fixtures";
export {
  mergeSx,
  getEventsWithRange,
  calculateEventProperties,
  partitionGridEventsOnRanges,
  transformEventsToComponents,
  EventTypography,
  variationsToColorRecord,
} from "./helpers";
export { WeekCalendar } from "./week_calendar";
export {
  WeekCalendarContext,
  WeekCalendarDispatchContext,
  WeekCalendarProvider,
  useCalendar,
  useCalendarDispatch,
} from "./state_management/week_calendar_context";

export { weekCalendarReducer } from "./state_management/week_calendar_reducer";
export type { WeekCalendarActionTypes } from "./state_management/week_calendar_reducer";

export type { CalendarEvent } from "./types";
