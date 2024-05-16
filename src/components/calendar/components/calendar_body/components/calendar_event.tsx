import { Box, SxProps, Theme, Typography, styled } from "@mui/material";
import { addMinutes, differenceInMinutes, format } from "date-fns";
import { mergeSx } from "../../../helpers";
import type { CalendarEvent as CalendarEventType } from "../../../types";

export const variationsToColorRecord: Record<string, string> = {
  orange: "#FF7043",
  indigo: "#5C6BC0",
  pink: "#EC407A",
  teal: "#26A69A",
  red: "#EF5350",
};

export const EventTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 500,
  fontSize: "10px",
  lineHeight: "14px",
  textAlign: "center",
  whiteSpace: "nowrap",
}));

export function CalendarEvent({
  title = "(No title)",
  start,
  end,
  color = "orange",
  sx,
}: CalendarEventType & {
  sx?: SxProps<Theme>;
}) {
  const { sxProps: eventSxProp, formattedDuration } = compileEventProperties(
    color,
    start,
    end,
  );

  return (
    <Box sx={mergeSx(eventSxProp, sx)} maxWidth="110px">
      <Box>
        <EventTypography>{title}</EventTypography>
      </Box>

      <EventTypography>{formattedDuration}</EventTypography>
    </Box>
  );
}

/**
 * Returns the sxProps for the wrapper box and the title/duration strings
 *
 * @param title
 * @param start
 * @param end
 * @param color
 * @returns
 */
export function compileEventProperties(
  color: string,
  start: Date,
  end?: Date,
): {
  sxProps: SxProps<Theme>;
  formattedDuration: string;
} {
  return {
    sxProps: calculateEventProperties(
      start,
      end ?? addMinutes(start, 15),
      color,
    ),
    formattedDuration: formatDuration(start, end),
  };
}

/**
 * This function compiles and returns the title/duration information shown on the event component.
 *
 * @param start
 * @param end
 * @returns
 */
export function formatDuration(start: Date, end?: Date) {
  if (!end) {
    return format(start, "h:mm");
  }

  const minutes = differenceInMinutes(end, start, {
    roundingMethod: "floor",
  });
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const updatedStart = format(start, "h:mmaaa");
  const updatedEnd = format(end, "h:mmaaa");

  const formattedDuration =
    days >= 1
      ? ""
      : minutes >= 30
        ? `${format(start, "h:mm")} - ${updatedEnd}`
        : updatedStart;

  return formattedDuration;
}

/**
 * A function to calculate the event's CSS properties
 *
 * @param start
 * @param end
 * @param color
 * @returns
 */
export function calculateEventProperties(
  start: Date,
  end: Date,
  color: string,
): SxProps<Theme> {
  const minutes = differenceInMinutes(end, start, {
    roundingMethod: "floor",
  });

  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // event component base sx props
  const baseSxProps: SxProps<Theme> = {
    display: "flex",
    padding: "0px 8px",
    alignItems: "center",
    position: "absolute",
    borderRadius: "4px",

    backgroundColor: variationsToColorRecord[color],
    width: "110px",
    minHeight: "15px",
    border: "1px solid #FFF",
  };

  if (days === 1) {
    const sxProps: SxProps<Theme> = {
      ...baseSxProps,
      width: "110px",
      height: "16px",
      padding: "0px 8px",
      alignItems: "center",
    };

    return sxProps;
  }
  if (days > 2) {
    const sxProps: SxProps<Theme> = {
      ...baseSxProps,
      width: `${days * 120 - 10}px`,
      height: "16px",
      padding: "0px 8px",
      alignItems: "center",
    };

    return sxProps;
  }
  // if the hours are 0 then there must be minutes
  if (minutes <= 15) {
    const sxProps: SxProps<Theme> = {
      ...baseSxProps,
      height: "15px",
      gap: "8px",
    };

    return sxProps;
  }
  if (minutes <= 29 && minutes > 15) {
    const sxProps: SxProps<Theme> = {
      ...baseSxProps,
      height: `${minutes}px`,
      gap: "8px",
    };

    return sxProps;
  }
  if (minutes >= 30 && minutes < 36) {
    const sxProps: SxProps<Theme> = {
      ...baseSxProps,
      height: `${minutes}px`,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
    };

    return sxProps;
  }
  if (minutes >= 36) {
    const sxProps: SxProps<Theme> = {
      ...baseSxProps,
      height: `${minutes}px`,
      padding: "4px 8px",
      flexDirection: "column",
      alignItems: "flex-start",
    };

    return sxProps;
  }

  return baseSxProps;
}
