import { FlexCol, FlexRow } from "../wrappers";
import { DayNumberStackDate } from "./components/day_number_stack_date";

function addDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}

export function CalendarHeader() {
  const today = new Date();
  const fiveDays = [...Array(6)].map((_, index) => (
    <DayNumberStackDate date={addDays(today, index)} />
  ));

  return (
    <FlexCol
      justifyContent="flex-start"
      alignItems="center"
      width={664}
      height={82}
      pl={8}
    >
      <FlexRow justifyContent="flex-start" width={600} height={64}>
        {fiveDays}
      </FlexRow>
    </FlexCol>
  );
}
