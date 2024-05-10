import { Grid, GridProps, styled } from "@mui/material";

const CalendarHourCell = styled(Grid)(({ theme }) => ({
  height: 59,
}));

export function HourCalendarCell(props: GridProps) {
  return (
    <CalendarHourCell item xs={4} {...props}>
      {props.children}
    </CalendarHourCell>
  );
}
