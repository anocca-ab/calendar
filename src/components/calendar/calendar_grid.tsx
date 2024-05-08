import { Box, Grid, Typography } from "@mui/material";
import { FlexCol } from "../wrappers";
import { eventsFixture } from "./fixtures";

export function CalendarGrid() {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "flex-start",

        overflowY: "auto",
      }}
    >
      <AmPmGridSidebar />
      <Grid
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
      </Grid>
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
      }}
    >
      {[...Array.from({ length: 12 }, (_, i) => i + 1)].map((hour) => {
        return (
          <FlexCol
            sx={{
              height: "64px",
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
              height: "64px",
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
