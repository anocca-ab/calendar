import { CalendarState } from "../types";
import {
  ReactNode,
  createContext,
  useContext,
  useReducer,
  useEffect,
} from "react";
import { CalendarActionTypes, CalendarReducer } from "./calendar_reducer";
import { startOfWeek } from "date-fns";

export const CalendarContext = createContext<CalendarState>({
  workWeek: false,
  startDay: "monday",
  today: new Date(),
  currentFirstDayOfTheWeek: startOfWeek(new Date(), { weekStartsOn: 1 }),
});
export const CalendarDispatchContext = createContext<
  React.Dispatch<CalendarActionTypes>
>(() => {});

export function CalendarProvider({
  initialState,
  children,
}: {
  initialState: CalendarState;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(CalendarReducer, initialState);
  useEffect(() => {
    // call the update function every 1 minute, which will re-run the hook useEffect
    const minute = setInterval(
      () => dispatch({ type: "edit-today", today: new Date() }),
      10000,
    );
    return () => clearInterval(minute);
  }, []);

  return (
    <CalendarContext.Provider value={state}>
      <CalendarDispatchContext.Provider value={dispatch}>
        {children}
      </CalendarDispatchContext.Provider>
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  return useContext(CalendarContext);
}

export function useCalendarDispatch() {
  return useContext(CalendarDispatchContext);
}
