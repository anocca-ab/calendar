import { startOfWeek } from "date-fns";
import { StartDay, WeekCalendarState } from "../types";
import { produce } from "immer";

export type WeekCalendarActionTypes =
  | { type: "edit-workWeek"; workWeek: boolean }
  | { type: "edit-startDay"; startDay: StartDay }
  | { type: "edit-today"; today: Date }
  | { type: "edit-currentFirstDayOfTheWeek"; currentFirstDayOfTheWeek: Date };

export const weekCalendarReducer = (
  state: WeekCalendarState,
  action: WeekCalendarActionTypes,
) =>
  produce(state, (draft: WeekCalendarState) => {
    if (action.type === "edit-workWeek") {
      draft.workWeek = action.workWeek;
      if (action.workWeek) {
        draft.startDay = "monday";
      }
      draft.currentFirstDayOfTheWeek = startOfWeek(draft.today, {
        weekStartsOn: 1,
      });
    }
    if (action.type === "edit-startDay") {
      draft.startDay = action.startDay;
      if (action.startDay === "sunday") {
        draft.workWeek = false;
      }
      draft.currentFirstDayOfTheWeek = startOfWeek(draft.today, {
        weekStartsOn: action.startDay === "monday" ? 1 : 0,
      });
    }
    if (action.type === "edit-today") {
      draft.today = action.today;
    }
    if (action.type === "edit-currentFirstDayOfTheWeek") {
      draft.currentFirstDayOfTheWeek = action.currentFirstDayOfTheWeek;
    }
  });
