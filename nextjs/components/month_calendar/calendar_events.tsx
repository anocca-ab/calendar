import { Box, Button, SvgIcon, Typography } from "@mui/material";
import { format } from "date-fns";
import { mergeSx } from "../helpers";
import type { CalendarEvent } from "../types";
import { FlexCol, FlexRow } from "../wrappers";
import { variationsToColorRecord } from "./helpers";
import { Triangle } from "../week_calendar/week_calendar";
import { EventTypography } from "./helpers";

export function CalendarAllDayEvent({
  event,
  triangle,
  ...buttonProps
}: {
  event: CalendarEvent;
  triangle?: "right" | "left";
} & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Box
      component={Button}
      {...buttonProps}
      sx={mergeSx(
        {
          display: "flex",
          height: "16px",
          alignItems: "stretch",
          justifyContent: "stretch",
          p: 0,
          m: 0,
          background: "none",
          "*": {
            pointerEvents: "none",
          },
        },
        buttonProps.sx,
      )}
    >
      {triangle === "left" && (
        <Triangle
          direction={"left"}
          height={16}
          width={12}
          color={variationsToColorRecord[event.color ?? "orange"]}
        />
      )}
      <FlexRow
        sx={{
          backgroundColor: variationsToColorRecord[event.color ?? "orange"],
          justifyContent: "flex-start",
          padding: "0px 8px",
          flex: 1,
          borderRadius: !triangle ? "4px" : "0px",
          alignItems: "center",
        }}
      >
        <EventTypography>{event.title ?? "(No title)"}</EventTypography>
      </FlexRow>
      {triangle === "right" && (
        <Triangle
          direction={"right"}
          height={16}
          width={12}
          color={variationsToColorRecord[event.color ?? "orange"]}
        />
      )}
    </Box>
  );
}

export function MonthCalendarEvent({
  event: { title = "(No title)", start, color = "orange" },
  state = "normal",
  ...buttonProps
}: {
  event: CalendarEvent;
  state: "normal" | "hover" | "selected";
} & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Box
      component={Button}
      {...buttonProps}
      sx={mergeSx(
        {
          position: "absolute",
          width: "110px",
          height: "16px",
          p: 0,
          justifyContent: "flex-start",
          background: (theme) => theme.palette.background.paper,
          boxShadow:
            state === "selected"
              ? (theme) => theme.shadows[1]
              : (theme) => theme.shadows[0],
          "*": {
            pointerEvents: "none",
          },
        },
        buttonProps.sx,
      )}
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
    </Box>
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
