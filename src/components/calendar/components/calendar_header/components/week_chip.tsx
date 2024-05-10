import { Chip } from "@mui/material";
import { format } from "date-fns";

export function WeekChip({ date }: { date: Date }) {
  const weekNr = format(date, "w");

  return <Chip label={`Week ${weekNr}`} sx={{ widht: 72, height: 32 }} />;
}
