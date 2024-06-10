import { CreateEvent } from "@/components/create_event";
import { Theme } from "@/components/theme";
import { CalendarEvent } from "@/components/types";
import { Box } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Meta, StoryObj } from "@storybook/react";
import { addDays, endOfDay, startOfDay, startOfWeek, subDays } from "date-fns";
import React from "react";
import { WeekCalendar } from "../components/week_calendar/week_calendar";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Week Calendar",
  component: WeekCalendar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    // backgroundColor: { control: "color" },
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
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    workWeek: false,
    startDay: "monday",
    startOfWeek: new Date(),
    now: new Date(),
  },
  decorators: [
    (Story, { globals: { backgrounds } }) => {
      return (
        <Theme theme={backgrounds?.value === "#333333" ? "dark" : "light"}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box
              sx={{ background: (theme) => theme.palette.background.default }}
            >
              <Story />
            </Box>
          </LocalizationProvider>
        </Theme>
      );
    },
  ],
} satisfies Meta<typeof WeekCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
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
