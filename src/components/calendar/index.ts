import "@fontsource/roboto";

export { CalendarEntry } from "./calendar_entry";
export { Calendar } from "./calendar";

export { FlexCol, FlexRow } from "./components/wrappers";
export {
  eventsFixture,
  renderFixtureEvents,
  renderFixtureWeekEvents,
} from "./fixtures";
export { mergeSx, EventTypography, variationsToColorRecord } from "./helpers";

export {
  CalendarContext,
  CalendarDispatchContext,
  CalendarProvider,
  useCalendar,
  useCalendarDispatch,
} from "./state_management/calendar_context";
export { CalendarReducer } from "./state_management/calendar_reducer";

export type { CalendarActionTypes } from "./state_management/calendar_reducer";
export type {
  CalendarEvent,
  CalendarState,
  AllDayCalendarEventWithRange,
  CalendarEventWithRange,
} from "./types";
