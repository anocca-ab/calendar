import { Box, Divider } from "@mui/material";
import { useMemo } from "react";
import type { CalendarEvent as CalendarEventType } from "../../../types";
import { FlexCol, FlexRow } from "../../wrappers";
import { CalendarEvent } from "./calendar_event";
import { differenceInMinutes, getHours, getMinutes } from "date-fns";

export function CalendarGrid({ events }: { events: CalendarEventType[] }) {
  const test = events.map((e, i) => {
    const hour = getHours(e.start);
    const minutes = getMinutes(e.start);

    const topPosition = hour * 60 + minutes;
    const duration = e.end
      ? differenceInMinutes(e.end, e.start, {
          roundingMethod: "floor",
        })
      : 15;
    return {
      startPosition: topPosition,
      endPosition: topPosition + duration,
      duration,
      event: e,
    };
    // <Box key={i} sx={{ top: topPosition, left: 1, position: "absolute" }}>
    //   <CalendarEvent {...e} />
    // </Box>
  });

  // console.log(test);
  const n = test.length;
  const b = 110 / n;
  const c = 110 - (0.8 * b) / 2;
  const a = (c / (n - 1)) * 1.5 - (0.8 * b) / 2 / 4;

  const eventsComponents = useMemo(
    () =>
      events.map((e, i) => {
        const hour = getHours(e.start);
        const minutes = getMinutes(e.start);

        const topPosition = hour * 60 + minutes;
        return (
          <Box
            key={i}
            sx={{ top: topPosition, left: (i * a) / 2, position: "absolute" }}
          >
            <CalendarEvent {...e} sx={{ width: a }} />
          </Box>
        );
      }),
    [],
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
