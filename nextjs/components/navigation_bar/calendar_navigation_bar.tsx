import { Button, Chip, IconButton, SvgIcon, Typography } from "@mui/material";
import {
  addMonths,
  addWeeks,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import React, { useCallback } from "react";
import { FlexRow } from "../wrappers";

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

export function CalendarNavigationBar({
  now,
  startDay,
  currentDate,
  setCurrentDate,
  type,
}: {
  now: Date;
  startDay: "monday" | "sunday";
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  type: "week" | "month";
}) {
  const [localDate, setLocalDate] = React.useState(currentDate);
  const onPressLeft = useCallback(() => {
    if (type === "month") {
      const newDate = subMonths(localDate, 1);
      setCurrentDate(newDate);
      setLocalDate(newDate);
    } else {
      const newDate = subWeeks(localDate, 1);
      setCurrentDate(newDate);
      setLocalDate(newDate);
    }
  }, [localDate, setCurrentDate, type]);

  const onPressToday = useCallback(() => {
    if (type === "month") {
      const newDate = startOfMonth(now);
      setCurrentDate(newDate);
      setLocalDate(newDate);
    } else {
      const newDate = startOfWeek(now, {
        weekStartsOn: startDay === "monday" ? 1 : 0,
      });

      setCurrentDate(newDate);
      setLocalDate(newDate);
    }
  }, [now, setCurrentDate, startDay, type]);

  const onPressRight = useCallback(() => {
    if (type === "month") {
      const newDate = addMonths(localDate, 1);
      setCurrentDate(newDate);
      setLocalDate(newDate);
    } else {
      const newDate = addWeeks(localDate, 1);
      setCurrentDate(newDate);
      setLocalDate(newDate);
    }
  }, [localDate, setCurrentDate, type]);

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

      <MonthYearRowDate date={localDate} />
      {type === "week" && <WeekChip date={localDate} />}
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
