import {
  StartOfWeekOptions,
  startOfWeek as fnsStartOfWeek,
  setDate,
} from "date-fns";
import { ReactElement, createContext, useContext } from "react";
import { CalendarEvent, StartDay } from "../types";
import { FlexCol } from "../wrappers";
import { getEventsPerWeekAndDay } from "./helpers";
import { MonthCalendarHeader } from "./month_calendar_header";
import { MonthCalendarWeekBody } from "./month_calendar_week_body";

export const MonthCalendarConfigContext = createContext<
  | undefined
  | {
      startDay: StartDay;
      startOfMonth: Date;
      now: Date;
      onCreateEvent?: (start: Date, end: Date) => void;
      onMoveEvent?: (
        event: CalendarEvent,
        newStart: Date,
        newEnd: Date | undefined,
      ) => void;
    }
>(undefined);

export const useMonthCalendar = () => {
  const ctx = useContext(MonthCalendarConfigContext);
  if (!ctx) {
    throw new Error("useCalendar must be used within a CalendarConfigContext");
  }
  return ctx;
};

const parseDefaultProps = (
  props: React.ComponentPropsWithRef<typeof MonthCalendar>,
) => {
  const events = props.events ?? [];
  let startDay = props.startDay ?? "monday";

  const now = props.now ?? new Date();

  const startOpts: StartOfWeekOptions = {
    weekStartsOn: startDay === "monday" ? 1 : 0,
  };
  const startOfWeek = fnsStartOfWeek(new Date(), startOpts);
  return {
    events,
    startDay,
    startOfMonth: setDate(now, 1),
    now,
    onCreateEvent: props.onCreateEvent,
    onMoveEvent: props.onMoveEvent,
  };
};

export function MonthCalendar(props: {
  /**
   * Events for the calendar
   * @default []
   */
  events?: CalendarEvent[];
  /**
   * start week on monday or sunday
   * @default 'monday'
   */
  startDay?: StartDay;
  /**
   * Some date during the month. We use the date-fns `startOfMonth` to derive the first day of the month
   * @default new Date()
   */
  startOfMonth?: Date;
  /**
   * The current time. It is used to render the current time indicator
   * @default new Date()
   */
  now?: Date;
  /**
   * When provided the user can create an event by clicking on a day or dragging over areas in the calendar
   * @param start when the event starts
   * @param end when event ends
   * @returns void
   */
  onCreateEvent?: (start: Date, end: Date) => void;

  /**
   * Triggered when an event is moved
   * @param event a calendar event
   * @param newStart new start date for the event
   * @param newEnd new end date for the event
   * @returns void
   */
  onMoveEvent?: (
    event: CalendarEvent,
    newStart: Date,
    newEnd: Date | undefined,
  ) => void;
}) {
  const { events, startDay, startOfMonth, now, onCreateEvent, onMoveEvent } =
    parseDefaultProps(props);

  const calendarWeeksEvents = getEventsPerWeekAndDay(events, startDay, now);

  const weeks: ReactElement[] = [];

  Object.keys(calendarWeeksEvents).forEach((week, i) => {
    weeks.push(
      <MonthCalendarWeekBody
        key={`week-${i}`}
        weekEvents={calendarWeeksEvents[week]}
        calendarTitle={`${i + 1}`}
        weekNumber={i}
      />,
    );
  });

  return (
    <MonthCalendarConfigContext.Provider
      value={{
        startDay,
        startOfMonth,
        now,
        onCreateEvent,
        onMoveEvent,
      }}
    >
      <FlexCol width="904px">
        <MonthCalendarHeader />
        <FlexCol>{weeks}</FlexCol>
      </FlexCol>
    </MonthCalendarConfigContext.Provider>
  );
}
