export type CalendarEvent = {
  title: string;
  startTime: Date;
  endTime: Date;
  variant?: CalendarVariant;
};
export type WeekCalendarProps = {
  events: { allDayEvents: CalendarEvent[]; gridEvents: CalendarEvent[] };
  onEditEvent: (oldEvent: CalendarEvent, newEvent: CalendarEvent) => void;
  onCreateEvent: (event: CalendarEvent) => void;
  onMoveEvent: (oldEvent: CalendarEvent, newEvent: CalendarEvent) => void;
};

export type CalendarVariant = "orange" | "indigo" | "pink" | "teal" | "red";
