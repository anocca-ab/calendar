import { Box, Grid, SxProps, Theme, Typography, styled } from "@mui/material";
import { intervalToDuration, format, differenceInMinutes } from "date-fns";
import { addMinutes } from "../helpers";
import { HourCalendarCell } from "./hour_calendar_cell";

export type CalendarVariant = "orange" | "indigo" | "pink" | "teal" | "red";
const variationsToColorRecord: Record<CalendarVariant, string> = {
  orange: "#FF7043",
  indigo: "#5C6BC0",
  pink: "#EC407A",
  teal: "#26A69A",
  red: "#EF5350",
};

const EventTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 500,
  fontSize: "10px",
  lineHeight: "14px",
  textAlign: "center",
  fontFamily: "Roboto",
}));

export function Event({
  title,
  startTime,
  endTime,
  variant = "orange",
}: {
  title: string;
  startTime: Date;
  endTime: Date;
  variant?: CalendarVariant;
}) {
  const {
    sxProps: eventSxProp,
    updatedTitle,
    updatedDuration,
  } = compileEventProperties(title, startTime, endTime, variant);

  return (
    <Box sx={eventSxProp}>
      <Box>
        <EventTypography>{updatedTitle}</EventTypography>
      </Box>

      <EventTypography>{updatedDuration}</EventTypography>
    </Box>
  );
}

/**
 * Returns the sxProps for the wrapper box and the title/duration strings
 *
 * @param title
 * @param startTime
 * @param endTime
 * @param variant
 * @returns
 */
function compileEventProperties(
  title: string,
  startTime: Date,
  endTime: Date,
  variant: CalendarVariant
): {
  sxProps: SxProps<Theme>;
  updatedTitle: string;
  updatedDuration: string;
} {
  return {
    sxProps: calculateEventProperties(startTime, endTime, variant),
    ...calculateTitleDuration(title, startTime, endTime),
  };
}

/**
 * This function compiles and returns the title/duration information shown on the event component.
 *
 * @param title
 * @param startTime
 * @param endTime
 * @returns
 */
function calculateTitleDuration(title: string, startTime: Date, endTime: Date) {
  const minutes = differenceInMinutes(endTime, startTime, {
    roundingMethod: "floor",
  });
  const hours = minutes / 60;

  const updatedStart = format(startTime, "h:mmaaa");
  const updatedEnd = format(endTime, "h:mmaaa");

  const updatedTitle =
    minutes >= 180
      ? `${hours} hour ${title}`
      : minutes >= 30
      ? `${minutes} min ${title}`
      : `${minutes} min ${title}, `;

  const updatedDuration =
    minutes >= 30
      ? `${format(startTime, "h:mm")} - ${updatedEnd}`
      : updatedStart;

  return { updatedTitle, updatedDuration };
}

/**
 * A function to calculate the event's CSS properties
 *
 * @param startTime
 * @param endTime
 * @param variant
 * @returns
 */
function calculateEventProperties(
  startTime: Date,
  endTime: Date,
  variant: CalendarVariant
): SxProps<Theme> {
  const minutes = differenceInMinutes(endTime, startTime, {
    roundingMethod: "floor",
  });

  // event component base sx props
  const baseSxProps: SxProps<Theme> = {
    display: "flex",
    padding: "0px 8px",
    alignItems: "center",
    position: "absolute",

    backgroundColor: variationsToColorRecord[variant],
    maxWidth: "110px",
    minHeight: "15px",
    border: "1px solid #FFF",
    borderRadius: "4px",
    opacity: "0px",
  };

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
