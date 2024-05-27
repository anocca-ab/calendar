import { Box, Divider } from "@mui/material";
import { differenceInCalendarDays, getHours, getMinutes } from "date-fns";
import {
  filterWeekEvents,
  getEventsWithRange,
  partitionGridEventsOnRanges,
  transformEventsToComponents,
} from "../../../helpers";
import { useCalendar } from "../../../state_management/calendar_context";
import type { CalendarEvent as CalendarEventType } from "../../../types";
import { FlexCol, FlexRow } from "../../wrappers";
import { TimeIndicator } from "./time_indicator";

export function WeekCalendarGrid({ events }: { events: CalendarEventType[] }) {
  const { workWeek, currentFirstDayOfTheWeek, today } = useCalendar();

  const filteredEvents: CalendarEventType[] = filterWeekEvents(
    events,
    currentFirstDayOfTheWeek,
  );

  const eventsWithRange = getEventsWithRange(
    filteredEvents,
    currentFirstDayOfTheWeek,
  );
  const groupsOfOverlappingEvents =
    partitionGridEventsOnRanges(eventsWithRange);

  const eventsComponents = transformEventsToComponents(
    groupsOfOverlappingEvents,
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: 1440,
      }}
    >
      {/* Horizontal lines */}
      <FlexCol
        sx={{
          gap: "59px",
          position: "absolute",
          alignItems: "stretch",
          inset: 0,
        }}
      >
        {[...Array(25)].map((_, i) => {
          return (
            <Divider
              key={i}
              sx={{
                marginLeft: "-16px",
                opacity: i === 0 ? 0 : 1,
              }}
            />
          );
        })}
      </FlexCol>
      {/* Vertical lines */}
      <FlexRow
        sx={{
          position: "absolute",
          alignItems: "stretch",
          justifyContent: "flex-start",
          inset: 0,
          gap: "119px",
        }}
      >
        {[...Array(workWeek ? 6 : 8)].map((_, i) => {
          return (
            <Divider
              key={i}
              orientation="vertical"
              sx={{
                opacity: workWeek && i === 5 ? 0 : !workWeek && i == 7 ? 0 : 1,
              }}
            />
          );
        })}
      </FlexRow>
      {filteredEvents.length > 0 && (
        <>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
            }}
          >
            {eventsComponents}
            {/* Time Indicator */}
            <Box
              sx={{
                position: "absolute",
                top: getHours(today) * 60 + getMinutes(today),
                left:
                  differenceInCalendarDays(today, currentFirstDayOfTheWeek) *
                    120 -
                  4,
              }}
            >
              <TimeIndicator />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
