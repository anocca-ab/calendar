import { Box, ScopedCssBaseline, SxProps, Theme, Typography, styled } from "@mui/material";
import { differenceInMinutes, format } from "date-fns";
import { mergeSx } from "../../../helpers";

export type CalendarVariant = "orange" | "indigo" | "pink" | "teal" | "red";

export const variationsToColorRecord: Record<CalendarVariant, string> = {
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
  title,
  startTime,
  endTime,
  variant = "orange",
  sx,
}: {
  title: string;
  startTime: Date;
  endTime: Date;
  variant?: CalendarVariant;
  sx?: SxProps<Theme>;
}) {
  const {
    sxProps: eventSxProp,
    updatedTitle,
    updatedDuration,
  } = compileEventProperties(title, startTime, endTime, variant);

  return (
    <ScopedCssBaseline>
      <Box sx={mergeSx(eventSxProp, sx)} maxWidth="110px">
        <Box>
          <EventTypography>{updatedTitle}</EventTypography>
        </Box>

        <EventTypography>{updatedDuration}</EventTypography>
      </Box>
    </ScopedCssBaseline>
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
export function compileEventProperties(
  title: string,
  startTime: Date,
  endTime: Date,
  variant: CalendarVariant,
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
export function calculateTitleDuration(
  title: string,
  startTime: Date,
  endTime: Date,
) {
  const minutes = differenceInMinutes(endTime, startTime, {
    roundingMethod: "floor",
  });
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const updatedStart = format(startTime, "h:mmaaa");
  const updatedEnd = format(endTime, "h:mmaaa");

  const updatedTitle =
    days >= 2
      ? `Multiday ${title}`
      : days === 1
        ? `Full day ${title}`
        : minutes >= 180
          ? `${hours} hour ${title}`
          : minutes >= 30
            ? `${minutes} min ${title}`
            : `${minutes} min ${title}, `;

  const updatedDuration =
    days >= 1
      ? ""
      : minutes >= 30
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
export function calculateEventProperties(
  startTime: Date,
  endTime: Date,
  variant: CalendarVariant,
): SxProps<Theme> {
  const minutes = differenceInMinutes(endTime, startTime, {
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

    backgroundColor: variationsToColorRecord[variant],
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
