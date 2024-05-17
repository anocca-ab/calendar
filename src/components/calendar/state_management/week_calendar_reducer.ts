import { StartDay, WeekCalendarState } from "../types";
import { produce } from "immer";

export type WeekCalendarActionTypes =
  | { type: "edit-workWeek"; workWeek: boolean }
  | { type: "edit-startDay"; startDay: StartDay }
  | { type: "edit-today"; today: Date };

export const weekCalendarReducer = (
  state: WeekCalendarState,
  action: WeekCalendarActionTypes,
) =>
  produce(state, (draft: WeekCalendarState) => {
    if (action.type === "edit-workWeek") {
      draft.workWeek = action.workWeek;
    }
    if (action.type === "edit-startDay") {
      draft.startDay = action.startDay;
    }
    if (action.type === "edit-today") {
      draft.today = action.today;
    }
  });
