import { SxProps, Theme, Typography, Paper } from "@mui/material";
import { format } from "date-fns";
import { FlexCol, FlexRow } from "../../../components/wrappers";
import type { CalendarEvent } from "../../../types";
import { EventDot } from "./event_dot";

export function WeekCalendarEvent({
  title = "(No title)",
  start,
  end,
  color = "orange",
  state = "normal",
  sx,
}: CalendarEvent & {
  sx?: SxProps<Theme>;
  state: "normal" | "hover" | "selected";
}) {
  return (
    <Paper
      elevation={state === "selected" ? undefined : 0}
      sx={{ width: "110px", height: "16px" }}
    >
      <FlexRow
        sx={{
          backgroundColor:
            state === "hover"
              ? "var(--Light-Primary-Shades-8p, rgba(25, 118, 210, 0.08))"
              : "white",

          alignItems: "center",
          gap: "6px",
          flexShrink: 0,
          padding: "0px 0px 0px 3px",
          borderRadius: "4px",
          overflow: "hidden",
          maxWidth: "110px",
          minHeight: "15px",
          textWrap: "nowrap",
          ...sx,
        }}
      >
        <FlexCol justifyContent="center" width="8px">
          <EventDot color={color} />
        </FlexCol>
        <FlexRow gap="6px" alignItems="center">
          <Typography
            sx={{
              color: " var(--Light-Text-Primary, rgba(0, 0, 0, 0.87))",
              textAlign: "center",
              fontFamily: "Roboto",
              fontSize: "10px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "100%" /* 10px */,
              letterSpacing: "0.4px",
            }}
          >
            {`${format(start, "h:mm")} - ${format(end!, "h:mmaaa")}`}
          </Typography>

          <Typography
            sx={{
              color: "var(--Light-Text-Primary, rgba(0, 0, 0, 0.87))",
              textAlign: "center",
              fontFamily: "Roboto",
              fontSize: "10px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "100%" /* 10px */,
              letterSpacing: "0.14px",
            }}
          >
            {title}
          </Typography>
        </FlexRow>
      </FlexRow>
    </Paper>
  );
}
