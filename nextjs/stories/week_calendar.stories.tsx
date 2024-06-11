import { CreateEvent } from "@/components/create_event";
import { Theme } from "@/components/theme";
import { CalendarEvent } from "@/components/types";
import { Box } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Meta, StoryObj } from "@storybook/react";
import { addDays, addHours, endOfDay, startOfDay, startOfWeek, subDays } from "date-fns";
import React from "react";
import { WeekCalendar } from "../components/week_calendar/week_calendar";

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
    events: [
      {
        start: startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
        end: endOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)),
        title: "A two day event",
      },
      {
        start: startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
        end: endOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
        title: "All day event",
      },
      {
        start: startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
        end: endOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 2)),
        title: "A three day event",
      },
      {
        start: startOfDay(
          subDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 2),
        ),
        end: endOfDay(
          addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 14),
        ),
        title: "A loong day event",
      },
      {
        start: startOfDay(
          addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3),
        ),
        end: endOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
        title: "All day event",
      },
    ],
  },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};


export const WithSubDayEvents: Story = {
  args: {
    events: [
      // 2 overlapping on monday
      {
        start: addHours(startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })), 2),
        end: addHours(startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })), 4),
        title: "A two hour event",
      },
      {
        start: addHours(startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })), 1),
        end: addHours(startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })), 4),
        title: "A three hour event",
      },

      // 3 (+1) overlapping on tuesday
      {
        start: addHours(startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)), 2),
        end: addHours(startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)), 4),
        title: "A two hour event",
      },
      {
        start: addHours(startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)), 1),
        end: addHours(startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)), 4),
        title: "A three hour event",
      },


      // 3 (+1) overlapping on tuesday
      {
        start: addHours(startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)), 7),
        end: addHours(startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)), 9),
        title: "A two hour event",
      },
      {
        start: addHours(startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)), 6),
        end: addHours(startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)), 9),
        title: "A three hour event",
      },
      {
        start: addHours(startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)), 7),
        end: addHours(startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)), 9),
        title: "A one hour event",
      },

      // last event that overlapps all on tuesday
      {
        start: addHours(startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)), 1),
        end: addHours(startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)), 10),
        title: "A big event",
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
  const [createModalOpen, setCreateModalOpen] = React.useState<
    undefined | { start: Date; end?: Date; key: number }
  >();
  const onCloseCreateModal = React.useRef<
    undefined | ((cb: () => void) => void)
  >();
  const onCreateEvent = (start: Date, end?: Date) => {
    if (onCloseCreateModal.current) {
      onCloseCreateModal.current(() => {
        setCreateModalOpen({ start, end, key: Math.random() });
      });
    } else {
      setCreateModalOpen({ start, end, key: Math.random() });
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
      {createModalOpen && (
        <CreateEvent
          createModalConfig={createModalOpen}
          setOnCloseCreateModal={onCloseCreateModal}
          onSave={(event: CalendarEvent) => {
            setEvents([...events, event]);
          }}
          key={createModalOpen.key}
        />
      )}
      <WeekCalendar
        {...props}
        events={events}
        onCreateEvent={onCreateEvent}
        onMoveEvent={onMoveEvent}
      />
    </>
  );
}
