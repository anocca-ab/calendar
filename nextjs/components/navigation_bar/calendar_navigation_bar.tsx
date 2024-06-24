import { Button, Chip, IconButton, SvgIcon, Typography } from "@mui/material";
import { FlexRow } from "../wrappers";
import {
  addMonths,
  addQuarters,
  addWeeks,
  format,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  subMonths,
  subQuarters,
  subWeeks,
} from "date-fns";
import { useState } from "react";

const ChevronLeft = (props: React.ComponentProps<"svg">) => (
  <SvgIcon>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="black"
      viewBox="0 0 24 24"
      color="inherit"
      {...props}
    >
      <path
        fill="#000"
        fillOpacity={0.54}
        d="M15.705 7.41 14.295 6l-6 6 6 6 1.41-1.41-4.58-4.59 4.58-4.59Z"
      />
    </svg>
  </SvgIcon>
);

export function CalendarNavigationBar({
  now,
  startDay,
  type,
}: {
  now: Date;
  startDay: "monday" | "sunday";
  type: "week" | "month" | "quarter";
}) {
  const [currentWeek, setCurrentWeek] = useState(
    startOfWeek(now, {
      weekStartsOn: startDay === "monday" ? 1 : 0,
    }),
  );
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(now));
  const [currentQuarter, setCurrentQuarter] = useState(startOfMonth(now));

  const dateToUse =
    type === "week"
      ? currentWeek
      : type === "month"
        ? currentMonth
        : currentQuarter;

  return (
    <FlexRow
      justifyContent="flex-start"
      px="22px"
      py="14px"
      gap={3}
      alignItems="center"
    >
      <Button
        variant="outlined"
        onClick={() => {
          setCurrentMonth(startOfMonth(now));
          setCurrentWeek(
            startOfWeek(now, { weekStartsOn: startDay === "monday" ? 1 : 0 }),
          );
          setCurrentQuarter(startOfQuarter(now));
          // dispatch({
          //   type: "edit-currentFirstDayOfTheWeek",
          //   currentFirstDayOfTheWeek: startOfWeek(now, {
          //     weekStartsOn: startDay === "monday" ? 1 : 0,
          //   }),
          // });
        }}
      >
        Today
      </Button>
      <FlexRow>
        <IconButton
          onClick={() => {
            // dispatch({
            //   type: "edit-currentFirstDayOfTheWeek",
            //   currentFirstDayOfTheWeek: subWeeks(currentFirstDayOfTheWeek, 1),
            // });
            setCurrentWeek(subWeeks(currentWeek, 1));
            setCurrentMonth(subMonths(currentMonth, 1));
            setCurrentQuarter(subQuarters(currentQuarter, 1));
          }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={() => {
            // dispatch({
            //   type: "edit-currentFirstDayOfTheWeek",
            //   currentFirstDayOfTheWeek: addWeeks(currentFirstDayOfTheWeek, 1),
            // });
            setCurrentWeek(addWeeks(currentWeek, 1));
            setCurrentMonth(addMonths(currentMonth, 1));
            setCurrentQuarter(addQuarters(currentQuarter, 1));
          }}
        >
          <ChevronLeft style={{ transform: "rotate(180deg)" }} />
        </IconButton>
      </FlexRow>

      <MonthYearRowDate date={dateToUse} />
      <WeekChip date={dateToUse} />
    </FlexRow>
  );
}

function MonthYearRowDate({ date }: { date: Date }) {
  const monthYear = format(date, "MMM yyyy");

  return (
    <FlexRow width={106} height={32}>
      <Typography variant="h5">{monthYear}</Typography>
    </FlexRow>
  );
}

function WeekChip({ date }: { date: Date }) {
  const weekNr = format(date, "w");

  return <Chip label={`Week ${weekNr}`} sx={{ widht: 72, height: 32 }} />;
}
