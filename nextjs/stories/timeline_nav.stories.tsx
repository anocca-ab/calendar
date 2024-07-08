import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { format, startOfMonth, startOfWeek } from "date-fns";
import { Box, Typography } from "@mui/material";
import { TimelineNav } from "@/components/nav/timeline_nav";

const meta = {
  title: "Timeline/Nav",
  component: TimelineNav,
  parameters: {
    layout: "centered",
  },
  // tags: ["autodocs"],
  argTypes: {
    now: {
      control: "date",
    },
    resolution: {
      control: "select",
      options: ["month", "3-months", "year", "3-years"],
    },
    setTime: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    now: new Date(),
    time: new Date(),
  },
} satisfies Meta<typeof TimelineNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Month: Story = {
  args: {
    resolution: "month",
  },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
} satisfies Meta<typeof TimelineNav>;

export const ThreeMonths: Story = {
  args: {
    resolution: "3-months",
  },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};

export const Year: Story = {
  args: {
    resolution: "year",
  },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};
export const ThreeYears: Story = {
  args: {
    resolution: "3-years",
    startDay: "monday",
  },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};

function InteractiveDemo(
  props: React.ComponentPropsWithRef<typeof TimelineNav>
) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  return (
    <Box sx={{ p: 2 }}>
      <TimelineNav {...props} time={currentDate} setTime={setCurrentDate} />
      <Typography
        sx={{ textAlign: "center", p: 2 }}
        color={(theme) => theme.palette.text.primary}
      >
        {format(currentDate, "do MMMM yyyy")}
      </Typography>
    </Box>
  );
}
