import type { CalendarEvent } from "../types";
import { Box, Button, SxProps, Theme } from "@mui/material";
import { EventTypography, variationsToColorRecord } from "./helpers";
import { mergeSx } from "../helpers";
import { FlexRow } from "../wrappers";

export function CalendarAllDayEvent({
  title = "(No title)",
  start,
  end,
  color = "pink",
  sx,
}: CalendarEvent & {
  sx?: SxProps<Theme>;
}) {
  if (!end) {
    throw new Error("A full day event must have an end date!");
  }

  return (
    <Box
      component={Button}
      sx={mergeSx(
        {
          display: "flex",
          height: "16px",
          alignItems: "stretch",
          justifyContent: "stretch",
          p: 0,
          m: 0,
          background: "none",
        },
        sx,
      )}
    >
      <FlexRow
        sx={{
          backgroundColor: variationsToColorRecord[color],
          justifyContent: "flex-start",
          padding: "0px 8px",
          flex: 1,
          borderRadius: "4px",
          alignItems: "center",
        }}
      >
        <EventTypography>{title}</EventTypography>
      </FlexRow>
    </Box>
  );
}
