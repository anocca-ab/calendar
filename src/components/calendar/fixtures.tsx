import { HourCalendarCell } from "./components/hour_calendar_cell";
import { Event } from "./components/event";
import { addMinutes } from "./helpers";

export const eventsFixture = [
  <HourCalendarCell key="orange">
    <Event
      variant="orange"
      title="event"
      startTime={new Date()}
      endTime={addMinutes(new Date(), 10)}
    />
  </HourCalendarCell>,
  <HourCalendarCell key="red">
    <Event
      variant="red"
      title="event"
      startTime={new Date()}
      endTime={addMinutes(new Date(), 15)}
    />
  </HourCalendarCell>,
  <HourCalendarCell key="teal">
    <Event
      variant="teal"
      title="event"
      startTime={new Date()}
      endTime={addMinutes(new Date(), 36)}
    />
  </HourCalendarCell>,
  <HourCalendarCell key="pink">
    <Event
      variant="pink"
      title="event"
      startTime={new Date()}
      endTime={addMinutes(new Date(), 120)}
    />
  </HourCalendarCell>,
  <HourCalendarCell key="indigo">
    <Event
      variant="indigo"
      title="event"
      startTime={new Date()}
      endTime={addMinutes(new Date(), 181)}
    />
  </HourCalendarCell>,
];
