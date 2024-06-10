import { MonthCalendar } from "@/components/month_calendar/month_calendar";
import { CalendarEvent } from "@/components/types";
import { Meta, StoryObj } from "@storybook/react";
import { addDays, addHours, addMinutes, subHours, subMinutes } from "date-fns";
import { useRef, useState } from "react";

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
        // data: { id: "1" },
        title: "Task",
        start: subMinutes(new Date(), 30),
        color: "pink",
      },
      {
        title: "Full day event",
        start: new Date(),
        end: addDays(new Date(), 1),
        color: "pink",
      },
      {
        title: "2 days event",
        start: addDays(new Date(), 2),
        end: addDays(addDays(new Date(), 2), 2),
        color: "pink",
      },
      {
        title: "4 days event",
        start: addDays(new Date(), 1),
        end: addDays(addDays(new Date(), 1), 4),
        color: "red",
      },
      {
        // title: "10min event",
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
        title: "Overnight event",
        start: addHours(new Date(), 1),
        end: addHours(addHours(new Date(), 1), 22),
        color: "teal",
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
  const [events, setEvents] = useState<CalendarEvent[]>(props.events ?? []);
  const [createModalOpen, setCreateModalOpen] = useState<
    undefined | { start: Date; end?: Date; key: number }
  >();
  const onCloseCreateModal = useRef<undefined | ((cb: () => void) => void)>();
  const onCreateEvent = (start: Date, end?: Date) => {
    if (onCloseCreateModal.current) {
      onCloseCreateModal.current(() => {
        setCreateModalOpen({ start, end, key: Math.random() });
      });
    } else {
      setCreateModalOpen({ start, end, key: Math.random() });
    }
  };

  return (
    <>
      {/* {createModalOpen && (
        <CreateEvent
          createModalConfig={createModalOpen}
          setOnCloseCreateModal={onCloseCreateModal}
          onSave={(event: CalendarEvent) => {
            setEvents([...events, event]);
          }}
          key={createModalOpen.key}
        />
      )} */}
      <MonthCalendar
        {...props}
        events={events}
        onCreateEvent={onCreateEvent}
        // onMoveEvent={onMoveEvent}
      />
    </>
  );
}
