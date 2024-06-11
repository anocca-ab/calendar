import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  SvgIcon,
  Typography,
} from "@mui/material";
import { addDays, format, startOfWeek } from "date-fns";
import { ReactElement } from "react";
import { FlexCol, FlexRow } from "../wrappers";
import { useMonthCalendar } from "./month_calendar";

export function MonthCalendarHeader() {
  return (
    <FlexCol width="100%">
      <CalendarLayoutBar />
      <MonthCalendarViewBar />
    </FlexCol>
  );
}

function MonthCalendarViewBar() {
  const { now, startDay } = useMonthCalendar();
  const currentFirstDayOfTheWeek = startOfWeek(now, {
    weekStartsOn: startDay === "monday" ? 1 : 0,
  });

  const daysInWeek = 7;

  const weekDays: ReactElement[] = [];

  [...Array(daysInWeek)].forEach((_, index) => {
    const dayOfWeek = format(addDays(currentFirstDayOfTheWeek, index), "EEE");
    const active = format(now, "EEE") === dayOfWeek;

    weekDays.push(
      <FlexRow
        key={`weekday-${index}`}
        width="120px"
        height="20px"
        justifyContent="center"
        alignItems="center"
      >
        <FlexCol width="25px" justifyContent="flex-start" alignContent="center">
          <Box height="19px">
            <Typography variant="caption">{dayOfWeek}</Typography>
          </Box>
          {active && <Divider sx={{ height: "1px", width: "25px" }} />}
        </FlexCol>
      </FlexRow>,
    );

    weekDays.push(
      <FlexRow
        key={`divider-${index}`}
        sx={{
          position: "absolute",
          alignItems: "stretch",
          justifyContent: "flex-start",
          inset: 0,
          gap: "119px",
        }}
      >
        <Divider key={index} orientation="vertical" sx={{ width: "1px" }} />
      </FlexRow>,
    );
  });

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
      }}
    >
      <FlexCol
        sx={{
          // backgroundColor: variationsToColorRecord[color],
          backgroundColor: "var(--Blue-Gray-50, #ECEFF1);",
          display: "flex",
          width: "20px",
          height: "20px",
          padding: "4px 0px",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "10px",
          borderRadius: "4px",
        }}
      >
        <FlexCol
          sx={{
            // transform: "rotate(-90deg)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            color="var(--Light-Text-Primary, rgba(0, 0, 0, 0.87));"
          >
            W
          </Typography>
        </FlexCol>
      </FlexCol>
      {weekDays}
    </Box>
  );
}

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

export function CalendarLayoutBar() {
  const { now, startDay } = useMonthCalendar();

  const currentFirstDayOfTheWeek = startOfWeek(now, {
    weekStartsOn: startDay === "monday" ? 1 : 0,
  });

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
          }}
        >
          <ChevronLeft style={{ transform: "rotate(180deg)" }} />
        </IconButton>
      </FlexRow>

      <MonthYearRowDate date={currentFirstDayOfTheWeek} />
      <WeekChip date={currentFirstDayOfTheWeek} />
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
