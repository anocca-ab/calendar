import { Button, IconButton, SvgIcon } from "@mui/material";
import { FlexRow } from "../../wrappers";
import { MonthYearRowDate } from "./month_year_row_date";
import { WeekChip } from "./week_chip";
import { useCalendar } from "../../../state_management/week_calendar_context";

const ChevronLeft = (props: React.ComponentProps<"svg">) => (
  <SvgIcon>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="black"
      viewBox="0 0 24 24"
      color="inherit"
      {...props}
    >
      <path
        fill="#000"
        fillOpacity={0.54}
        d="M15.705 7.41 14.295 6l-6 6 6 6 1.41-1.41-4.58-4.59 4.58-4.59Z"
      />
    </svg>
  </SvgIcon>
);

export function CalendarLayoutBar() {
  const { today } = useCalendar();
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
          <ChevronLeft />
        </IconButton>
        <IconButton>
          <ChevronLeft style={{ transform: "rotate(180deg)" }} />
        </IconButton>
      </FlexRow>

      <MonthYearRowDate date={today} />
      <WeekChip date={today} />
    </FlexRow>
  );
}
