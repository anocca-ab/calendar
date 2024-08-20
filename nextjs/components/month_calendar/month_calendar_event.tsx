import { Box, Button, Typography } from "@mui/material";
import { format } from "date-fns";
import { DEFAULT_COLOR, mergeSx } from "../helpers";
import type { CalendarEvent } from "../types";
import { Triangle } from "../week_calendar/week_calendar";
import { FlexCol, FlexRow } from "../wrappers";

export function MonthCalendarEvent<T>({
  event,
  state = "normal",
  triangle,
  allDayEvent,
  disableInteractive,
  dataProps,
  ...buttonProps
}: {
  event: CalendarEvent<T>;
  allDayEvent?: boolean;
  state?: "normal" | "selected";
  triangle?: "right" | "left" | "both";
  disableInteractive?: boolean;
  dataProps: any;
} & React.ComponentPropsWithRef<typeof Button>) {
  const { start, title, color } = event;

  return (
    <Box
      component={Button}
      {...buttonProps}
      {...dataProps}
      sx={mergeSx(
        {
          display: "flex",
          position: "absolute",
          p: 0,
          alignItems: allDayEvent ? "stretch" : "initial",
          justifyContent: allDayEvent ? "stretch" : "flex-start",
          background: "none",
          minWidth: "auto",
          overflow: "hidden",
          whiteSpace: "nowrap",
          "*:not(.resize-event)": {
            pointerEvents: "none",
          },
        },
        !disableInteractive && {
          boxShadow:
            state === "selected"
              ? (theme) => theme.shadows[1]
              : (theme) => theme.shadows[0],
        },

        buttonProps.sx
      )}
    >
      {allDayEvent && (triangle === "left" || triangle === "both") && (
        <Triangle
          direction={"left"}
          height={16}
          width={12}
          color={color ?? DEFAULT_COLOR}
        />
      )}
      {allDayEvent ? (
        <FlexRow
          sx={{
            bgcolor: color ?? DEFAULT_COLOR,
            justifyContent: "flex-start",
            padding: "0px 8px",
            flex: 1,
            borderRadius: !triangle ? "4px" : "0px",
            alignItems: "center",
          }}
        >
          <Typography
            variant="event"
            color={(theme) => theme.palette.primary.contrastText}
          >
            {title ?? "(No title)"}
          </Typography>
        </FlexRow>
      ) : (
        <FlexRow
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.background.default
                : "white",
            alignItems: "center",
            gap: "6px",
            padding: "0px 0px 0px 3px",
            borderRadius: "4px",
            overflow: "hidden",
            textWrap: "nowrap",
            width: "100%",
          }}
        >
          <FlexCol justifyContent="center" width="8px">
            <EventDot color={color ?? DEFAULT_COLOR} />
          </FlexCol>
          <FlexRow gap="6px" alignItems="center">
            <Typography
              variant="event"
              color={(theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.primary
              }
              sx={{ fontWeight: "400" }}
            >
              {`${format(start, "h:mm")}`}
            </Typography>

            <Typography
              variant="event"
              color={(theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.primary
              }
            >
              {title ?? "(No Title)"}
            </Typography>
          </FlexRow>
        </FlexRow>
      )}
      {allDayEvent && (triangle === "right" || triangle === "both") && (
        <Triangle
          direction={"right"}
          height={16}
          width={12}
          color={color ?? DEFAULT_COLOR}
        />
      )}
      {(["start", "end"] as const).map((pos, i) => (
        <Box
          key={i}
          className="resize-event"
          {...dataProps}
          data-drag-source="resize-event"
          data-resize-pos={pos}
          sx={mergeSx(
            {
              width: 4,
              flexShrink: 0,
              position: "absolute",
              zIndex: 1,
              top: 0,
              bottom: 0,
              cursor: "ew-resize",
            },
            pos === "start"
              ? {
                  left: 0,
                }
              : {
                  right: 0,
                }
          )}
        ></Box>
      ))}
    </Box>
  );
}

function EventDot({ color = DEFAULT_COLOR }: { color?: string }) {
  return (
    <Box
      sx={{
        width: "8px",
        height: "8px",
        borderRadius: "8px",
        backgroundColor: color,
      }}
    ></Box>
  );
}
