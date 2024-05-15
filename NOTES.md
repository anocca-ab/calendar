```tsx
type StartDay = 'monday' | 'sunday';

type CalendarEvent = {
  /**
   * If (start - end) % 24 * 60 * 60 * 1000 === 0, the event is considered to be an all-day event
  start: Date;
  /**
   * If `end` is not provided, the event is considered to be a task
   */
  end?: Date;
  title?: string;
  color?: string;
  id?: string;
};

type OnChangeEventTime = (
  event: CalendarEvent,
  newStart: Date,
  newEnd: Date
) => void;
type OnSelectEvent = (event: CalendarEvent) => void;

function WeekCalendar({
  events,
  workWeek,
  startDay,
  today = new Date(),
  onSelectEvent,
}: {
  events: Event[];
  workWeek: boolean;
  startDay: StartDay;
  today?: Date;
  onChangeEventTime?: OnChangeEventTime;
  onSelectEvent?: OnSelectEvent;
}) {}

function MonthCalendar({
  events,
  today = new Date(),
}: {
  events: CalendarEvent[];
  today?: Date;
}) {}

```
