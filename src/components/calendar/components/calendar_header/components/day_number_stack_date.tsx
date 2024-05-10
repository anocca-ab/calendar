import { Box, Typography } from "@mui/material";
import { FlexCol } from "../../../../wrappers";
import { format } from "date-fns";

export function DayNumberStackDate({ date }: { date: Date }) {
  const dayOfWeek = format(date, "EEE");
  const dayOfMonthNr = format(date, "dd");

  return (
    <FlexCol
      minWidth={120}
      alignItems="center"
      justifyContent="flex-start"
      flexShrink={0}
    >
      <Box width={26} height={20}>
        <Typography variant="caption">{dayOfWeek}</Typography>
      </Box>
      <Box width={28} height={32}>
        <Typography variant="h5">{dayOfMonthNr}</Typography>
      </Box>
    </FlexCol>
  );
}
