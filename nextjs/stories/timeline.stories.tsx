import { Timeline } from "@/components/timeline/timeline";
import type { Meta, StoryObj } from "@storybook/react";

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
