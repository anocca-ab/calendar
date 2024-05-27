import "@fontsource/roboto";

export { CalendarEntry } from "./calendar_entry";
export { Calendar } from "./calendar";

export { WeekCalendarBody } from "./components/calendar_body/week_calendar_body";
export { WeekCalendarGrid } from "./components/calendar_body/components/week_calendar_grid";
export { WeekCalendarGridAmPmSidebar } from "./components/calendar_body/components/week_calendar_grid_am_pm_sidebar";
export { WeekCalendarHeader } from "./components/calendar_header/week_calendar_header";
export { HourCalendarCell } from "./components/calendar_body/components/hour_calendar_cell";

export { CalendarAllDayEvent } from "./components/calendar_header/components/calendar_all_day_event";
export { CalendarFullDayEventBar } from "./components/calendar_header/components/calendar_full_day_event_bar";

export { CalendarLayoutBar } from "./components/calendar_header/components/calendar_layout_bar";
export { CalendarWeekViewBar } from "./components/calendar_header/components/calendar_week_view_bar";
export { DayNumberStackDate } from "./components/calendar_header/components/day_number_stack_date";
export { MonthYearRowDate } from "./components/calendar_header/components/month_year_row_date";
export { WeekChip } from "./components/calendar_header/components/week_chip";
export { FlexCol, FlexRow } from "./components/wrappers";
export {
  eventsFixture,
  renderFixtureEvents,
  renderFixtureWeekEvents,
} from "./fixtures";
export {
  mergeSx,
  getEventsWithRange,
  getAllDayEventsWithRange,
  calculateEventProperties,
  partitionGridEventsOnRanges,
  partitionAllDayEventsOnRanges,
  transformEventsToComponents,
  filterWeekEvents,
  formatDuration,
  EventTypography,
  variationsToColorRecord,
} from "./helpers";
export { WeekCalendar, WeekCalendarWrapper } from "./components/week_calendar";
export {
  CalendarContext,
  CalendarDispatchContext,
  CalendarProvider,
  useCalendar,
  useCalendarDispatch,
} from "./state_management/calendar_context";
export { CalendarReducer } from "./state_management/calendar_reducer";
export { TimeIndicator } from "./components/calendar_body/components/time_indicator";
export { WeekCalendarEvent } from "./components/calendar_body/components/week_calendar_event";

export type { CalendarActionTypes } from "./state_management/calendar_reducer";
export type {
  CalendarEvent,
  CalendarState,
  AllDayCalendarEventWithRange,
  CalendarEventWithRange,
} from "./types";
