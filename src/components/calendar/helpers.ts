export function addDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}

export function addMinutes(date: Date, minutes: number) {
  const newDate = new Date(date);
  newDate.setMinutes(date.getMinutes() + minutes);
  return newDate;
}

export function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}
