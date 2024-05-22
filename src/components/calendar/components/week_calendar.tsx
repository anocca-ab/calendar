import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import {
  useCalendar,
  useCalendarDispatch,
} from "../state_management/week_calendar_context";
import { CalendarEvent } from "../types";
import { CalendarBody } from "./calendar_body/calendar_body";
import { CalendarHeader } from "./calendar_header/calendar_header";
import { FlexCol } from "./wrappers";

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
    <FlexCol gap={2} width={workWeek ? "664px" : "904px"}>
      <Card variant="outlined">
        <CardHeader
          title={
            <Typography variant="body1">Week Calendar Settings</Typography>
          }
          subheader="During work weeks, it makes no sense to start from Sunday. The state will automatically set the starting day on Monday when working week is active"
        />
        <CardContent>
          <FormControl>
            <FormLabel focused={false}>Week</FormLabel>
            <RadioGroup
              value={workWeek}
              onChange={() =>
                dispatch({
                  type: "edit-workWeek",
                  workWeek: !workWeek,
                })
              }
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Work Week"
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Full Week"
              />
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel focused={false}>Start Day</FormLabel>
            <RadioGroup
              value={startDay}
              onChange={() =>
                dispatch({
                  type: "edit-startDay",
                  startDay: startDay === "monday" ? "sunday" : "monday",
                })
              }
            >
              <FormControlLabel
                value="monday"
                control={<Radio />}
                label="Monday"
              />
              <FormControlLabel
                value="sunday"
                control={<Radio />}
                label="Sunday"
              />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      <WeekCalendar events={events} />
    </FlexCol>
  );
}
