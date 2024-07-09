import { InteractiveDemo } from "@/components/interactive_demo";
import { MonthCalendar } from "@/components/month_calendar/month_calendar";
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

const meta = {
  title: "Calendar/Month",
  component: MonthCalendar,
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
        canEdit: true,
      },
      {
        title: "Full day event",
        start: startOfDay(new Date()),
        end: addMinutes(startOfDay(new Date()), 1339),
        color: "#EC407A",
        canEdit: true,
      },
      {
        title: "2 days event",
        start: startOfDay(addDays(new Date(), 2)),
        end: endOfDay(addDays(addDays(new Date(), 2), 2)),
        color: "#EC407A",
        canEdit: true,
      },
      {
        title: "4 week event",
        start: subWeeks(startOfDay(addDays(new Date(), 1)), 4),
        end: endOfDay(addWeeks(addDays(new Date(), 1), 4)),
        color: "#EF5350",
        canEdit: true,
      },
      {
        title: "10min event",
        start: subHours(new Date(), 3),
        end: addMinutes(subHours(new Date(), 3), 10),
        color: "#FF7043",
        canEdit: true,
      },
      {
        title: "15min event",
        start: addDays(new Date(), 2),
        end: addMinutes(addDays(new Date(), 2), 15),
        color: "#EF5350",
        canEdit: true,
      },
      {
        title: "36 min event",
        start: addMinutes(new Date(), 15),
        end: addMinutes(addMinutes(new Date(), 15), 36),
        color: "#26A69A",
        canEdit: true,
      },
      {
        title: "2 hours event",
        start: new Date(),
        end: addMinutes(new Date(), 120),
        color: "#EC407A",
        canEdit: true,
      },
      {
        title: "3 hours event",
        start: new Date(),
        end: addMinutes(new Date(), 181),
        color: "#5C6BC0",
        canEdit: true,
      },
      {
        title: "5 day event",
        start: startOfDay(addDays(new Date(), 3)),
        end: endOfDay(addDays(addDays(new Date(), 1), 6)),
        color: "#EF5350",
        canEdit: true,
      },
    ],
  },
  render: (props) => {
    return <InteractiveDemo type="month" {...props} />;
  },
};

export const WithBuggedEvents: Story = {
  args: {
    events: [
      {
        title: "A",
        start: startOfDay(addDays(new Date(), 2)),
        color: "red",
        canEdit: true,
      },
      {
        title: "B",
        start: startOfDay(addDays(new Date(), 0)),
        end: endOfDay(addDays(new Date(), 1)),
        color: "green",
        canEdit: true,
      },
      {
        title: "C",
        start: startOfDay(addDays(new Date(), 1)),
        end: endOfDay(addDays(new Date(), 2)),
        color: "blue",
        canEdit: true,
      },
    ],
  },
  render: (props) => {
    return <InteractiveDemo type="month" {...props} />;
  },
};
