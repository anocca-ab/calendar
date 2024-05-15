import { Box, Divider } from "@mui/material";
import { CalendarEvent } from "../../../types";
import { FlexCol, FlexRow } from "../../wrappers";
import { CalendarAllDayEvent } from "./calendar_all_day_event";

export function CalendarFullDayEventBar({
  events,
  eventHeight,
}: {
  events: CalendarEvent[];
  eventHeight: number;
}) {
  return (
    <Box pl={8}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: `${eventHeight * (16 + 1) + 1}px`,
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
        {/* Events */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
          }}
        >
          {/* row 1 */}
          <Box
            sx={{ display: "grid", gridTemplateColumns: "repeat(5, 120px)" }}
          >
            <Box pl="2px">
              <CalendarAllDayEvent {...events[0]} />
            </Box>
            <Box pl="2px">
              <CalendarAllDayEvent {...events[1]} />
            </Box>
          </Box>
          <Box sx={{ height: "1px" }} />
          {/* row 2 */}
          <FlexRow>
            <Box pl="2px">
              <CalendarAllDayEvent {...events[2]} />
            </Box>
          </FlexRow>
        </Box>
      </Box>
    </Box>
  );
}
