import { WeekCalendarState } from "../types";
import {
  ReactNode,
  createContext,
  useContext,
  useReducer,
  useEffect,
} from "react";
import {
  WeekCalendarActionTypes,
  weekCalendarReducer,
} from "./week_calendar_reducer";
import { startOfWeek } from "date-fns";

export const WeekCalendarContext = createContext<WeekCalendarState>({
  workWeek: false,
  startDay: "monday",
  today: new Date(),
  currentFirstDayOfTheWeek: startOfWeek(new Date(), { weekStartsOn: 1 }),
});
export const WeekCalendarDispatchContext = createContext<
  React.Dispatch<WeekCalendarActionTypes>
>(() => {});

export function WeekCalendarProvider({
  initialState,
  children,
}: {
  initialState: WeekCalendarState;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(weekCalendarReducer, initialState);
  useEffect(() => {
    // call the update function every 1 minute, which will re-run the hook useEffect
    const minute = setInterval(
      () => dispatch({ type: "edit-today", today: new Date() }),
      10000,
    );
    return () => clearInterval(minute);
  }, []);

  return (
    <WeekCalendarContext.Provider value={state}>
      <WeekCalendarDispatchContext.Provider value={dispatch}>
        {children}
      </WeekCalendarDispatchContext.Provider>
    </WeekCalendarContext.Provider>
  );
}

export function useCalendar() {
  return useContext(WeekCalendarContext);
}

export function useCalendarDispatch() {
  return useContext(WeekCalendarDispatchContext);
}
