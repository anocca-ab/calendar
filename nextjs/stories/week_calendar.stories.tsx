import { CreateEvent } from "@/components/create_event";
import { Theme } from "@/components/theme";
import { CalendarEvent } from "@/components/types";
import { Box } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Meta, StoryObj } from "@storybook/react";
import {
  addDays,
  addHours,
  addMinutes,
  endOfDay,
  endOfWeek,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import React from "react";
import { WeekCalendar } from "../components/week_calendar/week_calendar";
import { manyEvents } from "./many_events";

const meta = {
  title: "Week Calendar",
  component: WeekCalendar,
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
    onEditEvent: {
      table: {
        disable: true,
      },
    },
    events: {
      table: {
        disable: true,
      },
    },
    workWeek: {
      control: "boolean",
    },
    startOfWeek: {
      control: "date",
    },
    now: {
      control: "date",
    },
  },
  args: {
    workWeek: false,
    startDay: "monday",
    startOfWeek: new Date(),
    now: new Date(),
  },
  decorators: [],
} satisfies Meta<typeof WeekCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyCalendar: Story = {
  args: {},
};

export const CanCreateEvents: Story = {
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};

export const WithAllDayEvents: Story = {
  args: {
    events: manyEvents,
  },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};

export const WithSubDayEvents: Story = {
  args: {
    events: manyEvents,
  },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};
export const WithHuuugeSubDayEvent: Story = {
  args: {
    events: [
      ...manyEvents,
      {
        start: subDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 5),
        end: addDays(endOfWeek(new Date(), { weekStartsOn: 1 }), 5),
        title: "Huuuge event",
      },
    ],
  },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};

function InteractiveDemo(
  props: React.ComponentPropsWithRef<typeof WeekCalendar>,
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
      <WeekCalendar
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
