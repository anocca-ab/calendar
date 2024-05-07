import { Box, Grid } from "@mui/material";
import { Event } from "./components/event";
import { addMinutes } from "./helpers";
import { FlexCol, FlexRow } from "../wrappers";

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
        container
        // spacing={2}
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
        {[...Array(6)].map((_, index) => {
          const ends = addMinutes(new Date(), (index + 1) * 5);

          return (
            <Grid item key={index} {...colWidth} minHeight={160}>
              <Event title="Test" startTime={new Date()} endTime={ends} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
