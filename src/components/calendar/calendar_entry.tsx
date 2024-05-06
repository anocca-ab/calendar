import { Box } from "@mui/material";
import { Calendar } from "./calendar";

export function CalendarEntry() {
  return (
    <Box width="100%" height="100%" display="flex" p={4}>
      <Calendar />
    </Box>
  );
}
