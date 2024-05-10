import { Box, Divider, Grid, Typography } from "@mui/material";
import { FlexCol } from "../wrappers";
import { Event } from "./components/event";
import { eventsFixture } from "./fixtures";
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

export function AmPmGridSidebar() {
  return (
    <FlexCol
      sx={{
        width: "64px",
        padding: "29px 24px 0px 0px",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      {[...Array.from({ length: 12 }, (_, i) => i + 1)].map((hour) => {
        return (
          <FlexCol
            sx={{
              height: "60px",
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="caption">
              {hour === 12 ? `${hour} PM` : `${hour} AM`}
            </Typography>
          </FlexCol>
        );
      })}
      {[...Array.from({ length: 11 }, (_, i) => i + 1)].map((hour) => {
        return (
          <FlexCol
            sx={{
              height: "60px",
              alignSelf: "stretch",
              justifyContent: "center",
            }}
          >
            <Typography variant="caption">{`${hour} PM`}</Typography>
          </FlexCol>
        );
      })}
    </FlexCol>
  );
}
