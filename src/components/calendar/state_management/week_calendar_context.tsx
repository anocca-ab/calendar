import { WeekCalendarState } from "@/types";
import { ReactNode, createContext, useContext, useReducer } from "react";
import {
  WeekCalendarActionTypes,
  weekCalendarReducer,
} from "./week_calendar_reducer";

export const WeekCalendarContext = createContext<WeekCalendarState | undefined>(
  undefined,
);
export const WeekCalendarDispatchContext = createContext<
  React.Dispatch<WeekCalendarActionTypes> | undefined
>(undefined);

export function WeekCalendarProvider({
  initialState,
  children,
}: {
  initialState: WeekCalendarState;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(weekCalendarReducer, initialState);

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
