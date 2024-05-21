import DateRangeIcon from "@mui/icons-material/DateRange";
import TodayIcon from "@mui/icons-material/Today";
import { Box, IconButton, ScopedCssBaseline, Tooltip } from "@mui/material";
import { CalendarBody } from "./components/calendar_body/calendar_body";
import { CalendarHeader } from "./components/calendar_header/calendar_header";
import { FlexCol, FlexRow } from "./components/wrappers";
import {
  useCalendar,
  useCalendarDispatch,
} from "./state_management/week_calendar_context";
import { CalendarEvent } from "./types";

export function WeekCalendar({ events }: { events: CalendarEvent[] }) {
  const { workWeek } = useCalendar();
  const allDayEvents: CalendarEvent[] = [];
  const gridEvents: CalendarEvent[] = [];

  events.forEach((event) => {
    if (
      event.start &&
      event.end &&
      (event.end.getTime() - event.start.getTime()) % (24 * 60 * 60 * 1000) ===
        0
    ) {
      allDayEvents.push(event);
    } else {
      gridEvents.push(event);
    }
  });

  return (
    <FlexCol width={workWeek ? "664px" : "904px"}>
      <CalendarHeader allDayEvents={allDayEvents} />
      <CalendarBody gridEvents={gridEvents} />
    </FlexCol>
  );
}

export function WeekCalendarWrapper({ events }: { events: CalendarEvent[] }) {
  const { startDay, workWeek } = useCalendar();
  const dispatch = useCalendarDispatch();

  return (
    <FlexCol gap={2}>
      <FlexRow gap={1}>
        <Tooltip title="Work-week">
          <IconButton
            color={workWeek ? "primary" : "default"}
            onClick={() =>
              dispatch({
                type: "edit-workWeek",
                workWeek: !workWeek,
              })
            }
          >
            <DateRangeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Start day">
          <IconButton
            color={startDay === "monday" ? "primary" : "default"}
            onClick={() =>
              dispatch({
                type: "edit-startDay",
                startDay: startDay === "monday" ? "sunday" : "monday",
              })
            }
          >
            <TodayIcon />
          </IconButton>
        </Tooltip>
      </FlexRow>

      <WeekCalendar events={events} />
    </FlexCol>
  );
}
