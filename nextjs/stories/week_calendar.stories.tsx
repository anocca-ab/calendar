import { InteractiveDemo } from "@/components/interactive_demo";
import type { Meta, StoryObj } from "@storybook/react";
import {
  addDays,
  addHours,
  endOfWeek,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import { WeekCalendar } from "../components/week_calendar/week_calendar";
import { manyEvents } from "./many_events";

const meta = {
  title: "Week Calendar",
  component: WeekCalendar,
  parameters: {
    // layout: "centered",
  },
  // tags: ["autodocs"],
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
    return <InteractiveDemo type="week" {...props} />;
  },
};

export const WithAllDayEvents: Story = {
  args: {
    events: manyEvents,
  },
  render: (props) => {
    return <InteractiveDemo type="week" {...props} />;
  },
};

export const WithSubDayEvents: Story = {
  args: {
    events: manyEvents,
  },
  render: (props) => {
    return <InteractiveDemo type="week" {...props} />;
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

    now: addHours(startOfDay(new Date()), 11),
  },
  render: (props) => {
    return <InteractiveDemo type="week" {...props} />;
  },
};

export const WorkWeek: Story = {
  args: {
    events: manyEvents,
    workWeek: true,
  },
  render: (props) => {
    return <InteractiveDemo type="week" {...props} />;
  },
};

export const WeekStartsOnSunday: Story = {
  args: {
    events: manyEvents,
    startDay: "sunday",
  },
  render: (props) => {
    return <InteractiveDemo type="week" {...props} />;
  },
};
