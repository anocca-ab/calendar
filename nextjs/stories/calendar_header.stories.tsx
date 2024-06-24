import { Meta, StoryObj } from "@storybook/react";
import { CalendarNavigationBar } from "@/components/navigation_bar/calendar_navigation_bar";
import React from "react";

const meta = {
  title: "Navigation Bar",
  component: CalendarNavigationBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    startDay: {
      control: "select",
    },
    now: {
      control: "date",
    },
    type: {
      control: "select",
    },
  },
  args: {
    startDay: "monday",
    now: new Date(),
    type: "month",
  },
} satisfies Meta<typeof CalendarNavigationBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WeekCalendar: Story = {
  args: { startDay: "monday", now: new Date(), type: "week" },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};

export const MonthCalendar: Story = {
  args: { startDay: "monday", now: new Date(), type: "month" },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};

export const QuarterCalendar: Story = {
  args: { startDay: "monday", now: new Date(), type: "quarter" },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};

function InteractiveDemo(
  props: React.ComponentPropsWithRef<typeof CalendarNavigationBar>,
) {
  return (
    <>
      <CalendarNavigationBar {...props} />
    </>
  );
}
