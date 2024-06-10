import { MonthCalendar } from "@/components/month_calendar/month_calendar";
import { Meta, StoryObj } from "@storybook/react";

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
    now: new Date(),
  },
} satisfies Meta<typeof MonthCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyCalendar: Story = {
  args: {},
};
