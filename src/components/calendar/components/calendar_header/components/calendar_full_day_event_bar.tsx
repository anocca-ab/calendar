import { Box, Divider } from "@mui/material";
import {
  filterWeekEvents,
  getAllDayEventsWithRange,
  partitionAllDayEventsOnRanges,
} from "../../../helpers";
import { useCalendar } from "../../../state_management/week_calendar_context";
import type {
  CalendarEvent,
  AllDayCalendarEventWithRange,
} from "../../../types";
import { FlexCol, FlexRow } from "../../wrappers";
import { CalendarAllDayEvent } from "./calendar_all_day_event";

/**
 * The event height is calculated so it will be depracated
 * @returns
 */
export function CalendarFullDayEventBar({
  events,
}: {
  events: CalendarEvent[];
}) {
  const { workWeek, currentFirstDayOfTheWeek } = useCalendar();
  const maxWidth = workWeek ? 600 : 840;

  const filteredEvents: CalendarEvent[] = filterWeekEvents(
    events,
    currentFirstDayOfTheWeek,
  );
  const allDayEventsWithRange: AllDayCalendarEventWithRange[] =
    getAllDayEventsWithRange(
      filteredEvents,
      currentFirstDayOfTheWeek,
      maxWidth,
    );
  const rangedEventsGroups = partitionAllDayEventsOnRanges(
    allDayEventsWithRange,
  );

  return (
    <Box pl={8}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
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
        {filteredEvents.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              height: `${rangedEventsGroups.length * 18}px`,
            }}
          >
            {rangedEventsGroups.map((group, groupIndex) => {
              return (
                <Box
                  key={`allDayEventGroup-${groupIndex}`}
                  sx={{ height: "18px" }}
                >
                  {group.map((event, eventIndex) => {
                    return (
                      <Box
                        key={`event-${eventIndex}`}
                        pl="2px"
                        height="16px"
                        position="absolute"
                        sx={{
                          left: `${event.left}px`,
                          top: `${groupIndex * 17}px`,
                        }}
                      >
                        <CalendarAllDayEvent
                          {...event.event}
                          sx={{
                            width: `${event.width}px`,
                          }}
                        />
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
