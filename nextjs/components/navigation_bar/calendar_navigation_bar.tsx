import {
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  SvgIcon,
  Typography,
} from "@mui/material";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  format,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import React from "react";
import { TimelineResolution } from "../types";
import { FlexCol, FlexRow } from "../wrappers";

const ChevronLeft = (props: React.ComponentProps<"svg">) => (
  <SvgIcon
    sx={{
      fill: (theme) => (theme.palette.mode === "dark" ? "white" : "inherit"),
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="inherit"
      color="inherit"
      {...props}
    >
      <path
        fill="inherit"
        fillOpacity={0.54}
        d="M15.705 7.41 14.295 6l-6 6 6 6 1.41-1.41-4.58-4.59 4.58-4.59Z"
      />
    </svg>
  </SvgIcon>
);

const parseProps = ({
  now,
  currentDate,
  setCurrentDate,
}: React.ComponentProps<typeof CalendarNavigationBar>) => {
  return {
    now: now ?? new Date(),
    currentDate: currentDate ?? new Date(),
    setCurrentDate: setCurrentDate,
  };
};

function TodayButton({ onPress }: { onPress?: () => void }) {
  return (
    <Button variant="outlined" onClick={onPress}>
      Today
    </Button>
  );
}

function TimelineNav({
  now,
  currentDate,
  resolution,
  setCurrentDate,
}: {
  now: Date;
  currentDate: Date;
  setCurrentDate?: React.Dispatch<React.SetStateAction<Date>>;
  resolution: TimelineResolution;
}) {
  const [speed, setSpeed] = React.useState<
    "day" | "week" | "month" | "3-months" | "quarter" | "year" | "3-years"
  >("month");

  const functions: Record<
    typeof speed,
    Record<"left" | "right", (val: Date) => Date>
  > = {
    day: {
      left: (val) => subDays(val, 1),
      right: (val) => addDays(val, 1),
    },
    week: {
      left: (val) => subDays(val, 7),
      right: (val) => addDays(val, 7),
    },
    month: {
      left: (val) => subMonths(val, 1),
      right: (val) => addMonths(val, 1),
    },
    "3-months": {
      left: (val) => subMonths(val, 3),
      right: (val) => addMonths(val, 3),
    },
    quarter: {
      left: (val) => subMonths(val, 3),
      right: (val) => addMonths(val, 3),
    },
    year: {
      left: (val) => subMonths(val, 12),
      right: (val) => addMonths(val, 12),
    },
    "3-years": {
      left: (val) => subYears(val, 3),
      right: (val) => addYears(val, 3),
    },
  };

  const onPressLeft = setCurrentDate
    ? () => {
        setCurrentDate(functions[speed].left(currentDate));
      }
    : undefined;
  const onPressRight = setCurrentDate
    ? () => {
        setCurrentDate(functions[speed].right(currentDate));
      }
    : undefined;

  const handleChange = (event: SelectChangeEvent) => {
    setSpeed(event.target.value as typeof speed);
  };

  const speeds: Record<TimelineResolution, (typeof speed)[]> = {
    month: ["day", "week", "month"],
    "3-months": ["week", "month", "3-months"],
    year: ["month", "quarter", "year"],
    "3-years": ["quarter", "year", "3-years"],
  };

  const timeFormats: Record<typeof speed, string | (() => string)> = {
    day: "do",
    week: () => "W" + format(currentDate, "I"),
    month: "MMMM",
    "3-months": () =>
      `${format(currentDate, "MMM")} – ${format(
        addMonths(currentDate, 3),
        "MMM"
      )}`,
    quarter: "qqq",
    year: "yyyy",
    "3-years": () =>
      `${format(currentDate, "yyyy")} – ${format(
        addMonths(currentDate, 3),
        "yyyy"
      )}`,
  };

  const getTimeLabel = (s: typeof speed) => {
    const timeFormat = timeFormats[s];
    return typeof timeFormat === "function"
      ? timeFormat()
      : format(currentDate, timeFormat);
  };

  return (
    <FlexRow
      justifyContent="flex-start"
      gap={3}
      alignItems="center"
      zIndex={1}
      sx={{
        height: "48px",
        background: "#e1e1e1",
        px: 1.5,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        mb: 1,
      }}
    >
      <FlexRow gap={1}>
        <IconButton onClick={onPressLeft}>
          <ChevronLeft />
        </IconButton>
        <Box sx={{ minWidth: 120 }}>
          <Select
            value={speed}
            onChange={handleChange}
            size="small"
            sx={{ background: "white", width: 144 }}
          >
            {speeds[resolution].map((value) => (
              <MenuItem key={value} value={value}>
                {getTimeLabel(value)}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <IconButton onClick={onPressRight}>
          <ChevronLeft style={{ transform: "rotate(180deg)" }} />
        </IconButton>
      </FlexRow>

      <Box flex={1} />
      <FlexCol
        sx={{
          width: "140px",
          alignItems: "flex-end",
        }}
      >
        <Typography variant="caption">
          {format(currentDate, "LLLL do yyyy")}
        </Typography>
        <Typography variant="caption">
          W{format(currentDate, "I")}, {format(currentDate, "qqq")}
        </Typography>
      </FlexCol>
      <TodayButton
        onPress={
          setCurrentDate
            ? () => {
                setCurrentDate(now);
              }
            : undefined
        }
      />
    </FlexRow>
  );
}

export function CalendarNavigationBar(
  props:
    | {
        now?: Date;
        currentDate?: Date;
        setCurrentDate?: React.Dispatch<React.SetStateAction<Date>>;
        type: "week" | "month";
      }
    | {
        now?: Date;
        currentDate?: Date;
        setCurrentDate?: React.Dispatch<React.SetStateAction<Date>>;
        type: "timeline";
        resolution: TimelineResolution;
      }
) {
  const parsedProps = parseProps(props);
  const { now, currentDate, setCurrentDate } = parsedProps;

  if (props.type === "timeline") {
    return (
      <TimelineNav
        {...parsedProps}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        resolution={props.resolution}
      />
    );
  }

  const functions: Record<
    "week" | "month",
    Record<"left" | "right", (val: Date) => Date>
  > = {
    month: {
      left: (val) => subMonths(val, 1),
      right: (val) => addMonths(val, 1),
    },
    week: {
      left: (val) => subWeeks(val, 1),
      right: (val) => addWeeks(val, 1),
    },
  };

  const onPressLeft = !setCurrentDate
    ? undefined
    : () => {
        setCurrentDate(functions[props.type].left(currentDate));
      };

  const onPressToday = !setCurrentDate
    ? undefined
    : () => {
        setCurrentDate(now);
      };

  const onPressRight = !setCurrentDate
    ? undefined
    : () => {
        setCurrentDate(functions[props.type].right(currentDate));
      };

  return (
    <FlexRow
      justifyContent="flex-start"
      px="22px"
      py="14px"
      gap={3}
      alignItems="center"
      zIndex={1}
    >
      <Button variant="outlined" onClick={onPressToday}>
        Today
      </Button>
      <FlexRow>
        <IconButton onClick={onPressLeft}>
          <ChevronLeft />
        </IconButton>
        <IconButton onClick={onPressRight}>
          <ChevronLeft style={{ transform: "rotate(180deg)" }} />
        </IconButton>
      </FlexRow>

      <MonthYearRowDate date={currentDate} />
      {props.type === "week" && <WeekChip date={currentDate} />}
    </FlexRow>
  );
}

function MonthYearRowDate({ date }: { date: Date }) {
  const monthYear = format(date, "MMM yyyy");

  return (
    <FlexRow width={106} height={32}>
      <Typography
        variant="h5"
        sx={{
          color: (theme) =>
            (theme.palette.mode === "dark" ? "white" : "black")
              ? theme.palette.text.primary
              : theme.palette.primary.contrastText,
        }}
      >
        {monthYear}
      </Typography>
    </FlexRow>
  );
}

function WeekChip({ date }: { date: Date }) {
  const weekNr = format(date, "w");

  return <Chip label={`Week ${weekNr}`} sx={{ widht: 72, height: 32 }} />;
}
