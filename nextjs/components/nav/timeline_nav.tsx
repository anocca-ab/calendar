import {
  Box,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import {
  StartOfWeekOptions,
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import React from "react";
import { StartDay, TimelineResolution } from "../types";
import { FlexCol, FlexRow } from "../wrappers";
import { TodayButton } from "./today_button";
import { parseProps } from "./parse_props";
import { ChevronLeft } from "./chevron_left";

type Speed =
  | "day"
  | "week"
  | "month"
  | "3-months"
  | "quarter"
  | "year"
  | "3-years";

const allSpeeds: Speed[] = [
  "day",
  "week",
  "month",
  "3-months",
  "quarter",
  "year",
  "3-years",
];
export function TimelineNav(props: {
  now?: Date;
  time?: Date;
  setTime?: React.Dispatch<React.SetStateAction<Date>>;
  resolution?: TimelineResolution;
  startDay?: StartDay;
}) {
  const parsedProps = parseProps(props);
  const { now, time: currentDate, setTime } = parsedProps;
  const { resolution = "month", startDay = "monday" } = props;

  const speeds: Record<TimelineResolution, Speed[]> = {
    month: ["week", "month"],
    "3-months": ["month", "3-months"],
    year: ["quarter", "year"],
    "3-years": ["year", "3-years"],
  };

  const options: StartOfWeekOptions = {
    weekStartsOn: startDay === "monday" ? 1 : 0,
  };

  const [speed, setSpeed] = React.useState<Speed>(speeds[resolution][0]);

  const functions: Record<
    Speed,
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
      left: (val) => {
        if (resolution === "month") {
          return startOfWeek(
            startOfMonth(subMonths(endOfWeek(val, options), 1)),
            options
          );
        }
        return subMonths(val, 1);
      },
      right: (val) => {
        if (resolution === "month") {
          return startOfWeek(
            startOfMonth(addMonths(endOfWeek(val, options), 1)),
            options
          );
        }
        return addMonths(val, 1);
      },
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

  const onPressLeft = setTime
    ? () => {
        setTime(functions[speed].left(currentDate));
      }
    : undefined;
  const onPressRight = setTime
    ? () => {
        setTime(functions[speed].right(currentDate));
      }
    : undefined;

  const handleChange = (event: SelectChangeEvent) => {
    setSpeed(event.target.value as Speed);
  };

  const timeFormats: Record<Speed, string | (() => string)> = {
    day: "do",
    week: () => "W" + format(currentDate, "I"),
    month: () => {
      if (resolution === "month") {
        return format(endOfWeek(currentDate, options), "MMMM");
      }
      return format(currentDate, "MMMM");
    },
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

  const getTimeLabel = (s: Speed) => {
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
        background: (theme) =>
          theme.palette.mode === "light" ? "#e1e1e1" : "#242424",
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
        <Box
          sx={{
            background: (theme) => theme.palette.background.default,
            borderRadius: 1,
            display: "flex",
          }}
        >
          <Select
            value={speed}
            onChange={handleChange}
            size="small"
            sx={{
              width: 160,
            }}
            renderValue={(value) => {
              if (value === 'year' || value === '3-years') {
                return getTimeLabel(value);
              }
              return (
                <Box
                  sx={{ height: "24px", position: "relative" }}
                  className="wef"
                >
                  <Typography
                    sx={{ top: "-8px", position: "absolute", left: "0" }}
                  >
                    {getTimeLabel(value)}
                  </Typography>
                  <Typography
                    color={(theme) => theme.palette.text.secondary}
                    variant="caption"
                    sx={{ top: "12px", position: "absolute", left: "0" }}
                  >
                    {allSpeeds
                      .slice(allSpeeds.indexOf(value) + 1)
                      .filter((speed) => !speed.includes("-"))
                      .map(getTimeLabel)
                      .join(", ")}
                  </Typography>
                </Box>
              );
            }}
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
        <Typography
          variant="caption"
          sx={{ color: (theme) => theme.palette.text.secondary }}
        >
          {format(now, "LLLL do yyyy")}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: (theme) => theme.palette.text.secondary }}
        >
          W{format(now, "I")}, {format(now, "qqq")}
        </Typography>
      </FlexCol>
      <TodayButton
        onPress={
          setTime
            ? () => {
                setTime(now);
              }
            : undefined
        }
      />
    </FlexRow>
  );
}
