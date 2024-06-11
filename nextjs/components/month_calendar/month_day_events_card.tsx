import { Box, Button, Typography } from "@mui/material";
import { CalendarEvent } from "../types";
import { FlexCol, FlexRow } from "../wrappers";
import { CalendarAllDayEvent } from "./calendar_all_day_event";
import { MonthCalendarEvent } from "./month_calendar_event";
import { useMonthCalendar } from "./month_calendar";
import { getDate } from "date-fns";

export function MonthDayEventsCard({
  filteredGridEvents,
  filteredAllDayEvents,
  dayNumber,
}: {
  filteredGridEvents: CalendarEvent[];
  filteredAllDayEvents: CalendarEvent[];
  dayNumber: number;
}) {
  const { now } = useMonthCalendar();
  const allDayEvents = filteredAllDayEvents.map((e, i) => (
    <CalendarAllDayEvent
      key={`allDayEvent-${i}`}
      {...e}
      sx={{ width: "118px" }}
    />
  ));
  const gridEvents = filteredGridEvents.map((e, i) => (
    <MonthCalendarEvent key={`gridEvent-${i}`} {...e} state="normal" />
  ));

  const events = [...allDayEvents, ...gridEvents];

  const active = getDate(now) === dayNumber;
  return (
    <FlexCol
      height="120px"
      width="120px"
      gap="4px"
      justifyContent="center"
      alignItems="center"
    >
      {/* MonthDay */}

      <FlexRow
        width="24px"
        height="24px"
        justifyContent="center"
        alignItems="center"
      >
        {active && (
          <Box
            sx={{
              width: 24,
              height: 24,
              position: "absolute",
              borderRadius: 24,
              backgroundColor: (theme) => theme.palette.primary.main,
            }}
          ></Box>
        )}
        <Typography
          zIndex={1}
          color={
            active
              ? (theme) => theme.palette.primary.contrastText
              : (theme) => theme.palette.text.primary
          }
        >
          {dayNumber}
        </Typography>
      </FlexRow>

      {/* Events */}
      <FlexCol height="87px" gap="1px" p="1px">
        {events.length > 5
          ? [...Array(5)].map((_, i) => {
              if (i === 4) {
                return (
                  <MoreEventsButton
                    key={`moreEventsButton-${i}`}
                    number={events.length - 4}
                  />
                );
              }
              return events[i];
            })
          : events}
      </FlexCol>
    </FlexCol>
  );
}

function MoreEventsButton({ number }: { number: number }) {
  return (
    <Button
      variant="text"
      sx={{
        justifyContent: "flex-start",
        padding: 0,
        py: "0px",
        px: "5px",
        width: "42px",
        height: "16px",
        position: "absolute",
        bottom: "0px",
        borderRadius: "4px",
      }}
    >
      <Typography
        sx={{
          color: "var(--Light-Primary-Dark, #1565C0)",
          textTransform: "none",
          fontFamily: "Roboto",
          fontSize: "10px",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "100%",
        }}
      >{`${number} more`}</Typography>
    </Button>
  );
}
