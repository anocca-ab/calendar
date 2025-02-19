import { Meta, StoryObj } from "@storybook/react";
import { CalendarNav } from "@/components/nav/calendar_nav";
import React from "react";
import { format, startOfMonth, startOfWeek } from "date-fns";
import { Box, Typography } from "@mui/material";

const meta = {
  title: "Calendar/Nav",
  component: CalendarNav,
  parameters: {
    layout: "centered",
  },
  // tags: ["autodocs"],
  argTypes: {
    now: {
      control: "date",
    },
    type: {
      control: "select",
      options: ["week", "month", "timeline"],
    },
  },
  args: {
    now: new Date(),
    type: "week",
  },
} satisfies Meta<typeof CalendarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CalendarHeader: Story = {
  args: {
    now: new Date(),
    time: startOfWeek(new Date(), { weekStartsOn: 1 }),
    setTime: () => {},
    type: "week",
  },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
} satisfies Meta<typeof CalendarNav>;

export const MonthCalendar: Story = {
  args: {
    now: new Date(),
    type: "month",
    time: startOfMonth(new Date()),
  },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};

function InteractiveDemo(
  props: React.ComponentPropsWithRef<typeof CalendarNav>
) {
  const [currentDate, setCurrentDate] = React.useState(
    startOfMonth(new Date())
  );
  return (
    <Box sx={{ p: 2 }}>
      <CalendarNav {...props} time={currentDate} setTime={setCurrentDate} />
      <Typography
        sx={{
          textAlign: "center",
          p: 2,
          color: (theme) => theme.palette.text.primary,
        }}
      >
        {format(currentDate, "do MMMM yyyy")}
      </Typography>
    </Box>
  );
}
