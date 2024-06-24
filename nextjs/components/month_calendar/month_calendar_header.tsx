import { Box, Divider, SvgIcon, Typography } from "@mui/material";
import { addDays, format, startOfWeek } from "date-fns";
import { ReactElement } from "react";
import { CalendarNavigationBar } from "../navigation_bar/calendar_navigation_bar";
import { FlexCol, FlexRow } from "../wrappers";
import { useMonthCalendar } from "./month_calendar";

export function MonthCalendarHeader({
  setCurrentMonth,
}: {
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}) {
  const { now, startDay, startOfMonth } = useMonthCalendar();

  return (
    <FlexCol width="100%">
      <CalendarNavigationBar
        now={now}
        startDay={startDay}
        currentDate={startOfMonth}
        setCurrentDate={setCurrentMonth}
        type="month"
      />
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
    <FlexRow
      sx={{
        width: "100%",
      }}
    >
      <FlexCol
        sx={{
          backgroundColor: "var(--Blue-Gray-50, #ECEFF1);",
          width: "20px",
          height: "20px",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "10px",
          borderRadius: "4px",
        }}
      >
        <FlexCol
          sx={{
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
    </FlexRow>
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
