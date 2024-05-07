import { FlexCol, FlexRow } from "../wrappers";
import { DayNumberStackDate } from "./components/day_number_stack_date";
import { addDays } from "./helpers";

export function CalendarHeader() {
  const today = new Date();
  const fiveDays = [...Array(5)].map((_, index) => (
    <DayNumberStackDate key={index} date={addDays(today, index)} />
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
