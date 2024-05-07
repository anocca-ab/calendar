import { Box, SxProps, Theme, Typography, styled } from "@mui/material";
import { intervalToDuration } from "date-fns";

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
}: {
  title: string;
  startTime: Date;
  endTime: Date;
}) {
  console.log(endTime, startTime);
  const { minutes, hours } = intervalToDuration({
    start: startTime,
    end: endTime,
  });

  const eventSxProp = calculateEventProperties(minutes);

  return (
    <Box sx={eventSxProp}>
      <Box>
        <EventTypography>{title}</EventTypography>
      </Box>
      <EventTypography>
        {minutes >= 180 ? `${hours} hour event` : `${minutes} min event`}
      </EventTypography>
    </Box>
  );
}

function calculateEventProperties(minutes: number): SxProps<Theme> {
  // event component base sx props
  const baseSxProps = {
    display: "flex",
    padding: "0px 8px",
    alignItems: "center",

    backgroundColor: "#FF7043",
    minWidth: "110px",
    minHeight: "15px",
    border: "1px solid #FFF",
    borderRadius: "4px 0px 0px 0px",
    opacity: "0px",
  };

  // if the hours are 0 then there must be minutes
  if (minutes <= 15) {
    const sxProps = {
      ...baseSxProps,
      height: "15px",
      gap: "8px",
    };

    return sxProps;
  }
  if (minutes <= 29 && minutes > 15) {
    const sxProps = {
      ...baseSxProps,
      height: `${minutes}px`,
      gap: "8px",
    };

    return sxProps;
  }
  if (minutes >= 30 && minutes < 36) {
    const sxProps = {
      ...baseSxProps,
      height: `${minutes}px`,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
    };

    return sxProps;
  }
  if (minutes >= 36) {
    const sxProps = {
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
