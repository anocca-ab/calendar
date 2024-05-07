import { Box, Grid } from "@mui/material";
import { FlexCol } from "../wrappers";
import { eventsFixture } from "./fixtures";

export function CalendarGrid() {
  const colWidth = { xs: 4 } as const;

  return (
    <Box sx={{ display: "inline-flex", alignItems: "flex-start" }}>
      <FlexCol
        sx={{
          width: "64px",
          padding: "29px 24px 0px 0px",
          alignItems: "center",
        }}
      />
      <Grid
        width={600}
        container
        columns={20}
        sx={(theme) => ({
          "--Grid-borderWidth": "1px",
          borderTop: "var(--Grid-borderWidth) solid",
          borderColor: "divider",
          ".MuiGrid-item": { padding: 0, width: 120 },
          "& > div": {
            borderRight: "var(--Grid-borderWidth) solid",
            borderBottom: "var(--Grid-borderWidth) solid",
            borderColor: "divider",
            ...(Object.keys(colWidth) as Array<keyof typeof colWidth>).reduce(
              (result, key) => ({
                ...result,
                [`&:nth-of-type(${12 / colWidth[key]}n)`]: {
                  [theme.breakpoints.only(key)]: {
                    borderRight: "none",
                  },
                },
              }),
              {}
            ),
          },
        })}
      >
        {/* {[...Array(6)].map((_, index) => {
          const ends = addMinutes(new Date(), (index + 1) * 10);

          return (
            <HourCalendarCell key={index} >
              <Event
                variant="red"
                title="event"
                startTime={new Date()}
                endTime={ends}
              />
            </HourCalendarCell>
          );
        })} */}
        {eventsFixture}
        {eventsFixture}
        {eventsFixture}
        {eventsFixture}
        {eventsFixture}
      </Grid>
    </Box>
  );
}
