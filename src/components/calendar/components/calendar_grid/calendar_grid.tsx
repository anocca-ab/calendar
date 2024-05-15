import { Box, Divider } from "@mui/material";
import type { CalendarEvent as CalendarEventType } from "../../types";
import { FlexCol, FlexRow } from "../wrappers";
import { CalendarEvent } from "./components/calendar_event";
import { CalendarGridAmPmSidebar } from "./components/calendar_grid_am_pm_sidebar";

export function CalendarGrid({
  gridEvents,
}: {
  gridEvents: CalendarEventType[];
}) {
  return (
    <FlexRow
      sx={{
        alignItems: "flex-start",
        width: "664px",
      }}
    >
      <CalendarGridAmPmSidebar />
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
        <Box
          sx={{
            position: "absolute",
            inset: 0,
          }}
        >
          <Box sx={{ top: 1, left: 1, position: "absolute" }}>
            <CalendarEvent {...gridEvents[0]} />
          </Box>
        </Box>
      </Box>
      {/* <Grid
        width={600}
        container
        columns={20}
        sx={{
          position: "relative",
          overflowY: "auto",
          "--Grid-borderWidth": "1px",
          borderColor: "divider",
          ".MuiGrid-item": { padding: 0, width: 115 },
          "& > div": {
            borderRight: "var(--Grid-borderWidth) solid",
            borderBottom: "var(--Grid-borderWidth) solid",

            borderColor: "divider",
            "&:nth-of-type(1n)": {
              borderLeft: "var(--Grid-borderWidth) solid",
              borderColor: "divider",
              borderRight: "none",
            },
            "&:nth-of-type(5n)": {
              borderRight: "var(--Grid-borderWidth) solid",
              borderColor: "divider",
            },
          },
        }}
      >
        {[...Array(24)].map((_) => {
          return eventsFixture;
        })}
      </Grid> */}
    </FlexRow>
  );
}
