import { Box, Divider } from "@mui/material";
import {
  addWeeks,
  differenceInCalendarDays,
  isAfter,
  isBefore,
} from "date-fns";
import { useCalendar } from "../../../state_management/week_calendar_context";
import type { CalendarEvent } from "../../../types";
import { FlexCol, FlexRow } from "../../wrappers";
import { CalendarAllDayEvent } from "./calendar_all_day_event";

/**
 * The event height is calculated so it will be depracated
 * @returns
 */
export function CalendarFullDayEventBar({
  events,
  eventHeight,
}: {
  events: CalendarEvent[];
  eventHeight: number;
}) {
  const { workWeek, currentFirstDayOfTheWeek } = useCalendar();

  const filteredEvents: CalendarEvent[] = [];
  events.forEach((event) => {
    if (
      isBefore(currentFirstDayOfTheWeek, event.start) &&
      isBefore(event.start, addWeeks(currentFirstDayOfTheWeek, 1))
    ) {
      filteredEvents.push(event);
    } else if (
      event.end &&
      isBefore(currentFirstDayOfTheWeek, event.end) &&
      isBefore(event.end, addWeeks(currentFirstDayOfTheWeek, 1)) &&
      isBefore(event.start, currentFirstDayOfTheWeek)
    ) {
      filteredEvents.push(event);
    }
  });

  const sortedEvents = filteredEvents.sort(function (a, b) {
    if (isBefore(a.start, b.start) && a.end && b.end && isBefore(a.end, b.end))
      return -1;
    if (isAfter(a.start, b.start) && a.end && b.end && isAfter(a.end, b.end))
      return 1;
    return 0;
  });

  const rangedEventsGroups = [];
  let allDayEventsRows = 0;

  rangedEventsGroups[allDayEventsRows] = [sortedEvents[0]];

  for (let i = 1, l = sortedEvents.length; i < l; i++) {
    if (!sortedEvents[i].end) {
      throw new Error("A full day event must have an end date!");
    }
    if (isAfter(sortedEvents[i].start, sortedEvents[i - 1].end as Date)) {
      rangedEventsGroups[allDayEventsRows].push(sortedEvents[i]);
    } else {
      allDayEventsRows++;
      rangedEventsGroups[allDayEventsRows] = [sortedEvents[i]];
    }
  }

  return (
    <Box pl={8}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          // height: `${eventHeight * (16 + 1) + 1}px`,
          height: `${rangedEventsGroups.length * (16 + 1) + 1}px`,
        }}
      >
        {/* Horizontal lines */}
        <FlexCol
          sx={{
            gap: "59px",
            position: "absolute",
            alignItems: "stretch",
            justifyContent: "flex-end",
            inset: 0,
          }}
        >
          <Divider
            sx={{
              marginLeft: "-16px",
            }}
          />
        </FlexCol>
        {/* Vertical lines */}
        <FlexRow
          sx={{
            position: "absolute",
            alignItems: "stretch",
            inset: 0,
            gap: "119px",
            justifyContent: "flex-start",
          }}
        >
          {[...Array(workWeek ? 6 : 8)].map((_, i) => {
            return (
              <Divider
                key={i}
                orientation="vertical"
                sx={{
                  opacity:
                    workWeek && i === 5 ? 0 : !workWeek && i == 7 ? 0 : 1,
                }}
              />
            );
          })}
        </FlexRow>
        {/* Events */}
        {sortedEvents.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
            }}
          >
            {rangedEventsGroups.map((group, groupIndex) => {
              return (
                <Box
                  key={`group-${groupIndex}`}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${workWeek ? 5 : 7}, 120px)`,
                  }}
                >
                  {group.map((event, eventIndex) => {
                    const leftPosition = differenceInCalendarDays(
                      event.start,
                      currentFirstDayOfTheWeek,
                    );

                    return (
                      <Box
                        key={`event-${eventIndex}`}
                        pl="2px"
                        gridColumn={`${leftPosition}`}
                      >
                        <CalendarAllDayEvent {...event} />
                        <Box sx={{ height: "1px" }} />
                      </Box>
                    );
                  })}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
