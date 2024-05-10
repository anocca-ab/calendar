import { Button, IconButton } from "@mui/material";
import { FlexRow } from "../wrappers";
import { MonthYearRowDate } from "./components/month_year_row_date";
import { WeekChip } from "./components/week_chip";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";

export function CalendarLayoutBar() {
  const today = new Date();

  return (
    <FlexRow
      justifyContent="flex-start"
      px="22px"
      py="14px"
      gap={3}
      alignItems="center"
    >
      <Button variant="outlined">Today</Button>
      <FlexRow>
        <IconButton>
          <MdOutlineChevronLeft />
        </IconButton>
        <IconButton>
          <MdOutlineChevronRight />
        </IconButton>
      </FlexRow>

      <MonthYearRowDate date={today} />
      <WeekChip date={today} />
    </FlexRow>
  );
}
