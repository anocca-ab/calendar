import { Typography } from "@mui/material";
import { format } from "date-fns";
import { FlexRow } from "../../wrappers";

export function MonthYearRowDate({ date }: { date: Date }) {
  const monthYear = format(date, "MMM yyyy");

  return (
    <FlexRow width={106} height={32}>
      <Typography variant="h5">{monthYear}</Typography>
    </FlexRow>
  );
}
