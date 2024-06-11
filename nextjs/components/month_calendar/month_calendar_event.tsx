import { Paper, SvgIcon, SxProps, Theme, Typography } from "@mui/material";
import { format } from "date-fns";
import type { CalendarEvent } from "../types";
import { FlexCol, FlexRow } from "../wrappers";
import { variationsToColorRecord } from "./helpers";

export function MonthCalendarEvent({
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
      sx={{ width: "110px", height: "16px", ml: "2px" }}
    >
      <FlexRow
        sx={{
          backgroundColor:
            state === "hover"
              ? "var(--Light-Primary-Shades-8p, rgba(25, 118, 210, 0.08))"
              : undefined,

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
            {/* {`${format(start, "h:mm")} - ${format(end ?? addMinutes(start, 15), "h:mmaaa")}`} */}
            {`${format(start, "h:mm")}`}
          </Typography>

          <Typography
            sx={{
              color: "var(--Light-Text-Primary, rgba(0, 0, 0, 0.87))",
              textAlign: "center",
              fontFamily: "Roboto",
              fontSize: "10px",
              fontStyle: "normal",
              fontWeight: 500,
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

function EventDot({ color = "orange" }: { color?: string }) {
  return (
    <SvgIcon sx={{ width: "8px", height: "8px" }} fontSize="inherit">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="8"
        fill="none"
        viewBox="0 0 8 8"
      >
        <circle
          cx="4"
          cy="4"
          r="4"
          fill={variationsToColorRecord[color]}
        ></circle>
      </svg>
    </SvgIcon>
  );
}
