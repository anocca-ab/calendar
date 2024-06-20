import { CreateEvent } from "@/components/create_event";
import { MonthCalendar } from "@/components/month_calendar/month_calendar";
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
    layout: "centered",
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
        color: "pink",
      },
      {
        title: "Full day event",
        start: startOfDay(new Date()),
        end: addMinutes(startOfDay(new Date()), 1339),
        color: "pink",
      },
      {
        title: "2 days event",
        start: startOfDay(addDays(new Date(), 2)),
        end: endOfDay(addDays(addDays(new Date(), 2), 2)),
        color: "pink",
      },
      {
        title: "4 week event",
        start: subWeeks(startOfDay(addDays(new Date(), 1)), 4),
        end: endOfDay(addWeeks(addDays(new Date(), 1), 4)),
        color: "red",
      },
      {
        title: "10min event",
        start: subHours(new Date(), 3),
        end: addMinutes(subHours(new Date(), 3), 10),
        color: "orange",
      },
      {
        title: "15min event",
        start: addDays(new Date(), 2),
        end: addMinutes(addDays(new Date(), 2), 15),
        color: "red",
      },
      {
        title: "36 min event",
        start: addMinutes(new Date(), 15),
        end: addMinutes(addMinutes(new Date(), 15), 36),
        color: "teal",
      },
      {
        title: "2 hours event",
        start: new Date(),
        end: addMinutes(new Date(), 120),
        color: "pink",
      },
      {
        title: "3 hours event",
        start: new Date(),
        end: addMinutes(new Date(), 181),
        color: "indigo",
      },
      {
        title: "5 day event",
        start: startOfDay(addDays(new Date(), 3)),
        end: endOfDay(addDays(addDays(new Date(), 1), 6)),
        color: "red",
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
          key={editModalOpen.key}
        />
      )}
      <MonthCalendar
        {...props}
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
