import { Box, Divider } from "@mui/material";
import { AmPmGridSidebar } from "./components/am_pm_grid_sidebar";
import { Event } from "./components/event";
import { addMinutes } from "./helpers";

export function CalendarGrid() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <AmPmGridSidebar />
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 1440,
        }}
      >
        {/* Horizontal lines */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
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
        </Box>
        {/* Vertical lines */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            alignItems: "stretch",
            inset: 0,
            justifyContent: "space-between",
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
        </Box>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
          }}
        >
          <Box sx={{ top: 1, left: 1, position: "absolute" }}>
            <Event
              variant="orange"
              title="event"
              startTime={new Date()}
              endTime={addMinutes(new Date(), 10)}
            />
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
    </Box>
  );
}
