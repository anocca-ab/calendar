import { CreateEvent } from "@/components/create_event";
import { MonthCalendar } from "@/components/month_calendar/month_calendar";
import { CalendarNavigationBar } from "@/components/navigation_bar/calendar_navigation_bar";
import { CalendarEvent } from "@/components/types";
import { Meta, StoryObj } from "@storybook/react";
import {
  addDays,
  addMinutes,
  addWeeks,
  endOfDay,
  startOfDay,
  subHours,
  subMinutes,
  subWeeks,
} from "date-fns";
import React from "react";

const meta = {
  title: "Month Calendar",
  component: MonthCalendar,
  parameters: {
    // layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onCreateEvent: {
      table: {
        disable: true,
      },
    },
    onMoveEvent: {
      table: {
        disable: true,
      },
    },
    events: {
      table: {
        disable: true,
      },
    },
    startOfMonth: {
      control: "date",
    },
    now: {
      control: "date",
    },
  },
  args: {
    startOfMonth: new Date(),
    startDay: "monday",
    now: new Date(),
  },
} satisfies Meta<typeof MonthCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyCalendar: Story = {
  args: {},
};

export const FilledCalendar: Story = {
  args: {
    events: [
      {
        title: "Task",
        start: subMinutes(new Date(), 30),
        color: "#EC407A",
      },
      {
        title: "Full day event",
        start: startOfDay(new Date()),
        end: addMinutes(startOfDay(new Date()), 1339),
        color: "#EC407A",
      },
      {
        title: "2 days event",
        start: startOfDay(addDays(new Date(), 2)),
        end: endOfDay(addDays(addDays(new Date(), 2), 2)),
        color: "#EC407A",
      },
      {
        title: "4 week event",
        start: subWeeks(startOfDay(addDays(new Date(), 1)), 4),
        end: endOfDay(addWeeks(addDays(new Date(), 1), 4)),
        color: "#EF5350",
      },
      {
        title: "10min event",
        start: subHours(new Date(), 3),
        end: addMinutes(subHours(new Date(), 3), 10),
        color: "#FF7043",
      },
      {
        title: "15min event",
        start: addDays(new Date(), 2),
        end: addMinutes(addDays(new Date(), 2), 15),
        color: "#EF5350",
      },
      {
        title: "36 min event",
        start: addMinutes(new Date(), 15),
        end: addMinutes(addMinutes(new Date(), 15), 36),
        color: "#26A69A",
      },
      {
        title: "2 hours event",
        start: new Date(),
        end: addMinutes(new Date(), 120),
        color: "#EC407A",
      },
      {
        title: "3 hours event",
        start: new Date(),
        end: addMinutes(new Date(), 181),
        color: "#5C6BC0",
      },
      {
        title: "5 day event",
        start: startOfDay(addDays(new Date(), 3)),
        end: endOfDay(addDays(addDays(new Date(), 1), 6)),
        color: "#EF5350",
      },
    ],
  },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};

function InteractiveDemo(
  props: React.ComponentPropsWithRef<typeof MonthCalendar>,
) {
  const [events, setEvents] = React.useState<CalendarEvent[]>(
    props.events ?? [],
  );

  const [editModalOpen, setEditModalOpen] = React.useState<
    undefined | { event: CalendarEvent; key: number }
  >();

  const onCloseModal = React.useRef<undefined | ((cb: () => void) => void)>();

  const onEditEvent = (event: CalendarEvent) => {
    if (onCloseModal.current) {
      onCloseModal.current(() => {
        setEditModalOpen({ event, key: Math.random() });
      });
    } else {
      setEditModalOpen({ event, key: Math.random() });
    }
  };

  const onMoveEvent = (
    event: CalendarEvent,
    newStart: Date,
    newEnd: Date | undefined,
  ) => {
    setEvents((prev) => {
      return prev.map((ev) => {
        if (ev === event) {
          return {
            ...ev,
            start: newStart,
            end: newEnd,
          };
        }
        return ev;
      });
    });
  };

  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  return (
    <>
      {editModalOpen && (
        <CreateEvent
          event={editModalOpen.event}
          onCloseModalRef={onCloseModal}
          onSave={(event: CalendarEvent, originalEvent: CalendarEvent) => {
            if (events.includes(originalEvent)) {
              setEvents(
                events.map((ev) => (ev === originalEvent ? event : ev)),
              );
            } else {
              // create
              setEvents([...events, event]);
            }
          }}
          onDelete={(event: CalendarEvent) => {
            if (events.includes(event)) {
              const eventIndex = events.findIndex((ev) => ev === event);
              const a = [...events];
              a.splice(eventIndex, 1);
              setEvents(a);
            }
          }}
          key={editModalOpen.key}
        />
      )}
      <CalendarNavigationBar
        now={props.now ?? new Date()}
        startDay={props.startDay ?? "monday"}
        currentDate={currentMonth}
        setCurrentDate={setCurrentMonth}
        type="month"
      />
      <MonthCalendar
        {...props}
        startOfMonth={currentMonth}
        events={events}
        onCreateEvent={(start, end) => {
          onEditEvent({ start, end });
        }}
        onEditEvent={onEditEvent}
        onMoveEvent={onMoveEvent}
      />
    </>
  );
}
