import {
  getEventsWithRange,
  partitionGridEventsOnRanges,
} from "../../../helpers";
import { Box, Divider } from "@mui/material";
import { ReactElement } from "react";
import type {
  CalendarEvent as CalendarEventType,
  CalendarEventWithRange,
} from "../../../types";
import { FlexCol, FlexRow } from "../../wrappers";
import { CalendarEvent } from "./calendar_event";

export function CalendarGrid({ events }: { events: CalendarEventType[] }) {
  const eventsWithRange = getEventsWithRange(events);
  const groupsOfOverlappingEvents =
    partitionGridEventsOnRanges(eventsWithRange);

  // console.log(partitionGridEventsOnRanges(eventsWithRange));

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
        {[...Array(6)].map((_, i) => {
          return (
            <Divider
              key={i}
              orientation="vertical"
              sx={{
                opacity: i === 5 ? 0 : 1,
              }}
            />
          );
        })}
      </FlexRow>
      {events.length > 0 && (
        <>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
            }}
          >
            {eventsComponents}
          </Box>
        </>
      )}
    </Box>
  );
}

/**
 * Receives groups of grouped events, calculates the sx props
 * of overlapping groups and returns an array of events
 *
 * @param groupsOfEvents
 * @returns
 */
function transformEventsToComponents(
  groupsOfEvents: CalendarEventWithRange[][],
) {
  const events: ReactElement[] = [];
  let numOfEvents = 0;
  groupsOfEvents.forEach((group) => {
    if (group.length < 2) {
      group.forEach((event) => {
        events.push(
          <Box
            key={numOfEvents + 1}
            sx={{ top: event.start, left: 1, position: "absolute" }}
          >
            <CalendarEvent {...event.event} />
          </Box>,
        );
        numOfEvents += 1;
      });
    } else {
      const n = group.length;
      const b = 110 / n;
      const c = 110 - (0.8 * b) / 2;
      const a = (c / (n - 1)) * 1.5 - (0.8 * b) / 2 / 4;

      group.forEach((event, i) => {
        events.push(
          <Box
            key={numOfEvents + 1}
            sx={{ top: event.start, left: i * b, position: "absolute" }}
          >
            <CalendarEvent
              {...event.event}
              sx={{ width: n - 1 != i ? a : b }}
            />
          </Box>,
        );
        numOfEvents += 1;
      });
    }
  });

  return events;
}
