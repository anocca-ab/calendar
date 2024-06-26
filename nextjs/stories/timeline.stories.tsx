import { Timeline } from "@/components/timeline/timeline";
import type { Meta, StoryObj } from "@storybook/react";
import { manyEvents } from "./many_events";
import {
  addDays,
  addHours,
  addMinutes,
  endOfDay,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";

const meta = {
  title: "Timeline Calendar",
  component: Timeline,
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
    startTime: {
      control: "date",
    },
    now: {
      control: "date",
    },
  },
  args: {
    startTime: new Date(),
    now: new Date(),
    startDay: "monday",
  },
  decorators: [],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyCalendar: Story = {
  args: {},
};

export const WithEvents: Story = {
  args: {
    events: [
      {
        start: startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
        end: endOfDay(
          addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 15),
        ),
        title: "2 weeks",
      },
      {
        start: startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
        end: endOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
        title: "All day event",
      },
      {
        start: startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
        end: endOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 2)),
        title: "3 day",
      },
      {
        start: addHours(startOfDay(addDays(new Date(), 2)), 5),
        end: addMinutes(addHours(startOfDay(addDays(new Date(), 3)), 5), 35),
        title: "35 min ",
      },
      {
        start: addHours(startOfDay(addDays(new Date(), 3)), 5),
        end: addHours(startOfDay(addDays(new Date(), 3)), 6),
        title: "1 hour ",
      },
      {
        start: addHours(startOfDay(addDays(new Date(), 3)), 7),
        end: addHours(startOfDay(addDays(new Date(), 3)), 9),
        title: "2 hours",
      },
    ],
  },
};
