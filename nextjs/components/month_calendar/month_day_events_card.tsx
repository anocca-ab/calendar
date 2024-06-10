import { FlexCol } from "../wrappers";
import { CalendarEvent } from "../types";
import { CalendarAllDayEvent } from "./calendar_all_day_event";
import { MonthCalendarEvent } from "./month_calendar_event";
import { Button, Typography } from "@mui/material";

export function MonthDayEventsCard({
  filteredGridEvents,
  filteredAllDayEvents,
}: {
  filteredGridEvents: CalendarEvent[];
  filteredAllDayEvents: CalendarEvent[];
}) {
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
  return (
    <FlexCol height="120px" gap="1px" p="1px">
      {events.length > 7
        ? [...Array(7)].map((_, i) => {
            if (i === 6) {
              return (
                <MoreEventsButton
                  key={`moreEventsButton-${i}`}
                  number={events.length - 6}
                />
              );
            }
            return events[i];
          })
        : events}
    </FlexCol>
  );
}

function MoreEventsButton({ number }: { number: number }) {
  return (
    <Button
      variant="text"
      sx={{
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
