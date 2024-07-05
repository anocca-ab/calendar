import { WeekCalendar } from "./components/week_calendar/week_calendar";

/**
 * Assert that U is of type T
 * @public
 */
export const Assert = <T extends unknown, U extends T>() => {};

export const test = () => {
  <WeekCalendar
    events={[{ start: new Date(), data: { hello: 123 } }]}
    onEditEvent={(event) => {
      event.data.hello;
      Assert<number, typeof event.data.hello>();
    }}
  />;
  <WeekCalendar
    events={[{ start: new Date() }]}
    onEditEvent={(event) => {
      type keys = keyof typeof event;
      type ext = "data" extends keys ? "yes" : "no";
      Assert<"no", ext>();
      event;
    }}
  />;
  <WeekCalendar
    events={[{ start: new Date(), color: "red", data: 123 }]}
    onEditEvent={(event) => {
      Assert<number, typeof event.data>;
    }}
  />;
};
