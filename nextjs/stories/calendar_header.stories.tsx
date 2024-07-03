import { Meta, StoryObj } from "@storybook/react";
import { CalendarNavigationBar } from "@/components/navigation_bar/calendar_navigation_bar";
import React from "react";
import { format, startOfMonth, startOfWeek } from "date-fns";
import { Typography } from "@mui/material";

const meta = {
  title: "Navigation Bar",
  component: CalendarNavigationBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    now: {
      control: "date",
    },
    type: {
      control: "select",
      options: ["week", "month", "timeline"],
    },
    resolution: {
      control: "select",
      options: ["month", "3-months", "year", "3-years"],
    }
  },
  args: {
    now: new Date(),
    type: "week",
  },
} satisfies Meta<typeof CalendarNavigationBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CalendarHeader: Story = {
  args: {
    now: new Date(),
    currentDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
    setCurrentDate: () => {},
    type: "week",
  },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
} satisfies Meta<typeof CalendarNavigationBar>;

export const MonthCalendar: Story = {
  args: {
    now: new Date(),
    type: "month",
    currentDate: startOfMonth(new Date()),
  },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};

export const Timeline: Story = {
  args: {
    now: new Date(),
    type: "timeline",
    currentDate: startOfMonth(new Date()),
    resolution: "month",
  },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};

function InteractiveDemo(
  props: React.ComponentPropsWithRef<typeof CalendarNavigationBar>
) {
  const [currentDate, setCurrentDate] = React.useState(
    startOfMonth(new Date())
  );
  return (
    <>
      <CalendarNavigationBar
        {...props}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
      <Typography sx={{ textAlign: "center" }}>
        {format(currentDate, "do MMMM yyyy")}
      </Typography>
    </>
  );
}
