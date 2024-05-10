import { Box, Grid } from "@mui/material";
import { FlexRow } from "../wrappers";
import { Event } from "./components/event";
import { addDays } from "./helpers";

export function CalendarFullDayEventBar() {
  return (
    <FlexRow>
      <Box width="64px" />
      <Grid
        width={600}
        container
        columns={20}
        sx={{
          "--Grid-borderWidth": "1px",
          borderColor: "divider",
          position: "relative",
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
        {[...Array(5)].map((_, index) => {
          return (
            <Grid item key={index} xs={4} height="17px">
              <Event
                variant="indigo"
                title="event"
                startTime={new Date()}
                endTime={addDays(new Date(), 1)}
              />
            </Grid>
          );
        })}
        {[...Array(1)].map((_, index) => {
          return (
            <Grid item key={index} xs={4} height="17px">
              <Event
                variant="teal"
                title="event"
                startTime={new Date()}
                endTime={addDays(new Date(), 3)}
              />
            </Grid>
          );
        })}
        {[...Array(4)].map((_, index) => {
          return <Grid item key={index} xs={4} height="17px" />;
        })}
        {[...Array(1)].map((_, index) => {
          return (
            <Grid item position="relative" xs={4} key={index} height="17px">
              <Event
                variant="pink"
                title="event"
                startTime={new Date()}
                endTime={addDays(new Date(), 4)}
              />
            </Grid>
          );
        })}
        {[...Array(4)].map((_, index) => {
          return (
            <Grid item key={index} height="17px" xs={4}>
              {""}
            </Grid>
          );
        })}
      </Grid>
    </FlexRow>
  );
}
