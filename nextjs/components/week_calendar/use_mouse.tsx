import { addMinutes, max } from "date-fns";
import React from "react";
import { getEventEnd } from "../helpers";
import { CalendarEvent } from "../types";
import { ModifiableEvent } from "./types";

export type DraggedEvent<T extends { start: Date; end?: Date | undefined }> = {
  /**
   * The new event that is being dragged (source event with new start/end)
   */
  dragged: { start: Date; end: Date } | undefined;
  /**
   * The event that is dragged
   */
  source: T;
};

export type MouseStatePos = {
  x: number;
  y: number;
  scrollX: number;
  scrollY: number;
};

/**
 * Mouse state
 */
export type MouseState = {
  down: boolean;
  pos: MouseStatePos | undefined;
  pos0: MouseStatePos | undefined;
};

/**
 * The position of the event being dragged
 */
export type DragPosition<T extends { start: Date; end?: Date | undefined }> = {
  event: T;
  /**
   * x position of event (in days)
   */
  x: number;
  /**
   * width (in days)
   */
  w: number;
  /**
   * bounding rect x of event (in px)
   */
  elX: number;
  /**
   * bounding rect y of event (in px)
   */
  elY: number;
  /**
   * the column x position (in px)
   */
  colX: number;
};

export function useMouse<T extends { start: Date; end?: Date | undefined }>(
  target: string,
  effectRefs: React.MutableRefObject<{
    onMoveEvent?: (event: T, start: Date, end: Date | undefined) => void;
    onEditEvent?: (event: T) => void;
    events: T[];
    setDraggedEvent: React.Dispatch<
      React.SetStateAction<DraggedEvent<T> | undefined>
    >;
    /**
     * if event has moved return the new start and end time
     */
    calculateNewTime: (
      state: MouseState,
      dragged: DragPosition<T>,
    ) => { start: Date; end: Date } | undefined;
  }>,
  workWeek: boolean,
) {
  const daysInWeek = workWeek ? 5 : 7;

  React.useEffect(() => {
    /**
     * Mouse state
     */
    const state: MouseState = {
      down: false,
      pos: undefined,
      pos0: undefined,
    };
    /**
     * Position data regarding the dragged event
     */
    let dragged: undefined | DragPosition<T> = undefined;

    /**
     * Same as the React.state draggedEvent, but outside the context of react state
     * A "live" version, whereas the state version is only updated after react component updates
     */
    let draggedEvent: DraggedEvent<T> | undefined = undefined;
    const mouseDown = (ev: MouseEvent) => {
      if (ev.target instanceof HTMLElement) {
        if (ev.target.dataset.type === target) {
          state.down = true;
          state.pos0 = {
            x: ev.clientX,
            y: ev.clientY,
            scrollX: window.scrollX,
            scrollY: window.scrollY,
          };
          state.pos = {
            x: ev.clientX,
            y: ev.clientY,
            scrollX: window.scrollX,
            scrollY: window.scrollY,
          };
          const data: {
            index: number;
            x: number;
            w: number;
            colX: number;
          } = JSON.parse(ev.target.dataset.calendarEvent!);
          const event = effectRefs.current.events[data.index];
          const rect = ev.target.getBoundingClientRect();
          dragged = {
            event,
            x: data.x,
            w: data.w,
            elX: rect.x,
            elY: rect.y,
            colX: data.colX,
          };
        }
      }
      update();
    };
    const mouseMove = (ev: MouseEvent) => {
      state.pos = {
        x: ev.clientX,
        y: ev.clientY,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      };
      update();
    };
    const mouseUp = (ev: MouseEvent) => {
      let mouseMoved =
        state.pos0 &&
        state.pos &&
        (state.pos0.x !== state.pos.x ||
          state.pos0.y !== state.pos.y ||
          state.pos0.scrollX !== state.pos.scrollX ||
          state.pos0.scrollY !== state.pos.scrollY);

      state.down = false;
      state.pos = undefined;
      state.pos0 = undefined;
      if (draggedEvent) {
        if (draggedEvent.dragged) {
          if (effectRefs.current.onMoveEvent) {
            effectRefs.current.onMoveEvent(
              draggedEvent.source,
              draggedEvent.dragged.start,
              draggedEvent.dragged.end,
            );
          }
        }
        if (effectRefs.current.onEditEvent && !mouseMoved) {
          effectRefs.current.onEditEvent(draggedEvent.source);
        }
      }
      draggedEvent = undefined;
      effectRefs.current.setDraggedEvent(undefined);
    };
    const scroll = (ev: Event) => {
      if (!state.pos) {
        return;
      }
      state.pos = {
        ...state.pos,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      };
      update();
    };
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("scroll", scroll);

    function update() {
      if (state.pos && state.down && state.pos0 && dragged) {
        const newEventTime = effectRefs.current.calculateNewTime(
          state,
          dragged,
        );
        /**
         * Update the "live" dragged event
         * Only add dragged if the event has moved
         */
        draggedEvent = {
          source: dragged.event,
          dragged: newEventTime
            ? {
                start: newEventTime.start,
                end: newEventTime.end,
              }
            : undefined,
        };
        effectRefs.current.setDraggedEvent(draggedEvent);
      }
    }
    return () => {
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("scroll", scroll);
    };
  }, [daysInWeek, effectRefs, target]);
}

export const useDragableEvents = (events: CalendarEvent[]) => {
  const [draggedEvent, setDraggedEvent] = React.useState<
    DraggedEvent<ModifiableEvent> | undefined
  >(undefined);

  /**
   * All events, store reference to the source event and add modifiable start and end times (modified when dragged)
   */
  const allEvents: ModifiableEvent[] = events.map((sourceEvent) => ({
    sourceEvent,
    start: sourceEvent.start,
    end: max([getEventEnd(sourceEvent), addMinutes(sourceEvent.start, 15)]),
  }));

  /**
   * Replace an existing event with the dragged event
   */
  if (draggedEvent?.dragged) {
    const newDragged = {
      ...draggedEvent.source,
      ...draggedEvent.dragged,
    };
    newDragged.end = max([
      getEventEnd(newDragged),
      addMinutes(newDragged.start, 15),
    ]);
    allEvents.splice(
      allEvents.findIndex(
        (ev) => ev.sourceEvent === draggedEvent.source.sourceEvent,
      ),
      1,
      newDragged,
    );
  }
  return [allEvents, draggedEvent, setDraggedEvent] as const;
};

/**
 * when dragging an event on the x axis, dayDiff how many days the event has moved
 * @returns
 */
export function dayDiff(
  pos: MouseStatePos,
  pos0: MouseStatePos,
  dragged: DragPosition<ModifiableEvent>,
  daysInWeek: number,
) {
  const rawDelta =
    pos.x +
    ((pos0.x - dragged.elX + dragged.colX) % 120) -
    pos0.x +
    pos.scrollX -
    pos0.scrollX;
  const minDiff = -dragged.x - dragged.w + 1;
  // each event is 120px wide, so we can calculate how many days we have moved
  const delta = Math.min(
    Math.max(Math.floor(rawDelta / 120), minDiff),
    daysInWeek - dragged.x - 1,
  );
  return delta;
}
