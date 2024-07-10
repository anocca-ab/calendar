import { addMinutes, max } from "date-fns";
import React from "react";
import { getEventEnd } from "./helpers";
import { CalendarEvent } from "./types";
import { ModifiableEvent } from "./week_calendar/types";

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
  /**
   * absolute mouse x
   */
  x: number;
  /**
   * absolute mouse y
   */
  y: number;
  /**
   * window scroll x
   */
  scrollX: number;
  /**
   * window scroll y
   */
  scrollY: number;
};

/**
 * Mouse state
 */
export type MouseState = {
  /**
   * is mouse left click down or not?
   */
  down: boolean;
  /**
   * current mouse position
   */
  pos: MouseStatePos | undefined;
  /**
   * initial position of the mouse at mouse down
   */
  pos0: MouseStatePos | undefined;
};

/**
 * the container holding the events
 */
export type EventContainer = {
  width: number;
  height: number;
};

/**
 * The position of the event being dragged
 */
export type DragPosition<T extends { start: Date; end?: Date | undefined }> = {
  /**
   * When creating a new event, the type is "new"
   * When dragging an existing event, the type is "existing"
   */
  type: "new" | "existing";

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

export function useMouse<T>(
  target: string,
  effectRefs: React.MutableRefObject<{
    onMoveEvent?: (
      event: ModifiableEvent<T>,
      start: Date,
      end: Date | undefined
    ) => void;
    onClickEvent?: (event: ModifiableEvent<T>, nativeEvent: MouseEvent) => void;
    events: ModifiableEvent<T>[];
    setDraggedEvent: React.Dispatch<
      React.SetStateAction<DraggedEvent<ModifiableEvent<T>> | undefined>
    >;
    /**
     * if event has moved return the new start and end time
     */
    calculateNewTime: (
      state: MouseState,
      dragged: DragPosition<ModifiableEvent<T>>,
      container: EventContainer
    ) => { start: Date; end: Date } | undefined;
    createNewEvent?: (
      pos0: MouseStatePos,
      container: DOMRect
    ) => DragPosition<ModifiableEvent<T>> | undefined;
    dragCreateEvent?: (start: Date, end?: Date) => void;
    eventContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  }>,
  workWeek: boolean
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
    let dragged: undefined | DragPosition<ModifiableEvent<T>> = undefined;

    let container: undefined | EventContainer;

    /**
     * Same as the React.state draggedEvent, but outside the context of react state
     * A "live" version, whereas the state version is only updated after react component updates
     */
    let draggedEvent: DraggedEvent<ModifiableEvent<T>> | undefined = undefined;
    const mouseDown = (ev: MouseEvent) => {
      if (ev.target instanceof HTMLElement) {
        const clickedEvent = ev.target.dataset.type === target;
        const container = effectRefs.current.eventContainerRef.current;
        const clickedContainer = ev.target === container;

        const pos0: MouseStatePos = {
          x: ev.clientX,
          y: ev.clientY,
          scrollX: window.scrollX,
          scrollY: window.scrollY,
        };

        const activateDrag = () => {
          state.down = true;
          state.pos0 = pos0;
          state.pos = pos0;
        };

        if (clickedEvent) {
          const data: {
            index: number;
            x: number;
            w: number;
            colX: number;
          } = JSON.parse(ev.target.dataset.calendarEvent!);
          const event = effectRefs.current.events[data.index];

          const rect = ev.target.getBoundingClientRect();
          dragged = {
            type: "existing",
            event,
            x: data.x,
            w: data.w,
            elX: rect.x,
            elY: rect.y,
            colX: data.colX,
          };
          activateDrag();
        } else if (clickedContainer) {
          if (effectRefs.current.createNewEvent && container) {
            const createNewEvent = effectRefs.current.createNewEvent(
              pos0,
              container.getBoundingClientRect()
            );
            if (createNewEvent) {
              dragged = createNewEvent;
              activateDrag();
            }
          }
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
          if (
            effectRefs.current.onMoveEvent ||
            effectRefs.current.dragCreateEvent
          ) {
            const sourceEvent = draggedEvent.source.sourceEvent;
            const newStart = draggedEvent.dragged.start;
            let newEnd: Date | undefined = draggedEvent.dragged.end;
            if (!sourceEvent.end) {
              // maintain as full day task
              newEnd = undefined;
            } else if (
              sourceEvent.start.getTime() === sourceEvent.end?.getTime()
            ) {
              // maintain as sub day task
              newEnd = newStart;
            }
            if (dragged?.type === "new") {
              if (effectRefs.current.dragCreateEvent) {
                effectRefs.current.dragCreateEvent(newStart, newEnd);
              }
            } else {
              if (effectRefs.current.onMoveEvent) {
                effectRefs.current.onMoveEvent(
                  draggedEvent.source,
                  newStart,
                  newEnd
                );
              }
            }
          }
        }
        if (effectRefs.current.onClickEvent && !mouseMoved) {
          effectRefs.current.onClickEvent(draggedEvent.source, ev);
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
      setUpContainerRefListener();

      if (!container) {
        return;
      }

      if (state.pos && state.down && state.pos0 && dragged) {
        const newEventTime = effectRefs.current.calculateNewTime(
          state,
          dragged,
          container
        );

        /**
         * Update the "live" dragged event
         * Only add dragged if the event has moved
         */
        if (!dragged.event.sourceEvent.canEdit) {
          // only allow clicks when canEdit is false
          draggedEvent = {
            source: dragged.event,
            dragged: undefined,
          };
        } else {
          draggedEvent = {
            source: dragged.event,
            dragged: newEventTime
              ? {
                  start: newEventTime.start,
                  end: newEventTime.end,
                }
              : undefined,
          };
        }
        effectRefs.current.setDraggedEvent(draggedEvent);
      }
    }

    let hasSetup = false;
    let cleanupContainerListener: undefined | (() => void);
    function setUpContainerRefListener() {
      if (hasSetup) {
        return;
      }
      const containerEl = effectRefs.current.eventContainerRef.current;
      if (!containerEl) {
        return;
      }

      const rect = containerEl.getBoundingClientRect();

      container = {
        width: rect.width,
        height: rect.height,
      };

      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const rect = entry.contentRect;
          container = {
            width: rect.width,
            height: rect.height,
          };
        }
      });
      resizeObserver.observe(containerEl);

      cleanupContainerListener = () => {
        resizeObserver.disconnect();
      };

      hasSetup = true;
    }

    return () => {
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("scroll", scroll);
      if (cleanupContainerListener) {
        cleanupContainerListener();
      }
    };
  }, [daysInWeek, effectRefs, target]);
}

export function useDragableEvents<T>(events: CalendarEvent<T>[]) {
  const [draggedEvent, setDraggedEvent] = React.useState<
    DraggedEvent<ModifiableEvent<T>> | undefined
  >(undefined);

  /**
   * All events, store reference to the source event and add modifiable start and end times (modified when dragged)
   */
  const allEvents: ModifiableEvent<T>[] = events.map((sourceEvent) => ({
    sourceEvent,
    start: sourceEvent.start,
    // an event "collision box" should be at least 15 minutes in height (=15px)
    end: getEventEnd(sourceEvent),
  }));

  /**
   * Replace an existing event with the dragged event
   */
  if (draggedEvent?.dragged) {
    const newDragged = {
      ...draggedEvent.source,
      ...draggedEvent.dragged,
    };
    newDragged.end = getEventEnd(newDragged);
    const index = allEvents.findIndex(
      (ev) => ev.sourceEvent === draggedEvent.source.sourceEvent
    );
    if (index !== -1) {
      // it is a new event
      allEvents.splice(index, 1, newDragged);
    } else {
      // we are moving an existing event
      allEvents.push(newDragged);
    }
  }
  return [allEvents, draggedEvent, setDraggedEvent] as const;
}

/**
 * when dragging an event on the x axis, dayDiff how many days the event has moved
 * @returns
 */
export function dayDiff<T>(
  pos: MouseStatePos,
  pos0: MouseStatePos,
  dragged: DragPosition<ModifiableEvent<T>>,
  daysInWeek: number,
  container: EventContainer
) {
  let rawDelta = pos.x + -pos0.x + pos.scrollX - pos0.scrollX;

  /**
   * offset the rawDelta to be relative to 120 * x
   */
  const offset =
    (pos0.x - dragged.elX + dayUnitToPx(dragged.colX, daysInWeek, container)) %
    dayUnitToPx(120, daysInWeek, container);

  rawDelta += offset;

  const minDiff = -dragged.x - dragged.w + 1;
  // each event is 120px wide, so we can calculate how many days we have moved
  const delta = Math.min(
    Math.max(
      Math.floor(rawDelta / dayUnitToPx(120, daysInWeek, container)),
      minDiff
    ),
    daysInWeek - dragged.x - 1
  );
  return delta;
}

export function dayUnitToPx(
  width: number,
  daysInWeek: number,
  container: EventContainer
) {
  return container.width * (width / (120 * daysInWeek));
}

export function useEffectRefs<T>(
  events: ModifiableEvent<T>[],
  setDraggedEvent: React.Dispatch<
    React.SetStateAction<DraggedEvent<ModifiableEvent<T>> | undefined>
  >,
  calculateNewTime: (
    state: MouseState,
    dragged: DragPosition<ModifiableEvent<T>>,
    container: EventContainer
  ) => { start: Date; end: Date } | undefined,
  calendarProps: {
    onMoveEvent?: (
      event: CalendarEvent<T>,
      newStart: Date,
      newEnd: Date | undefined
    ) => void;
    onClickEvent?: (event: CalendarEvent<T>, nativeEvent: MouseEvent) => void;
    onCreateEvent?: (start: Date, end: Date) => void;
    dragCreateEvent?: (start: Date, end?: Date) => void;
  },
  createNewEvent?: (
    pos0: MouseStatePos,
    container: DOMRect
  ) => DragPosition<ModifiableEvent<T>> | undefined
) {
  const ome = calendarProps.onMoveEvent;
  const onMoveEvent = ome
    ? (event: ModifiableEvent<T>, start: Date, end?: Date) => {
        ome(event.sourceEvent, start, end);
      }
    : undefined;
  const oev = calendarProps.onClickEvent;
  const onClickEvent = oev
    ? (event: ModifiableEvent<T>, nativeEvent: MouseEvent) => {
        oev(event.sourceEvent, nativeEvent);
      }
    : undefined;
  const onCreateEvent = calendarProps.onCreateEvent;

  const eventContainerRef = React.useRef<HTMLDivElement>(null);

  const effectRefs = React.useRef({
    onMoveEvent,
    events,
    onClickEvent,
    onCreateEvent,
    setDraggedEvent,
    calculateNewTime,
    eventContainerRef,
    createNewEvent,
    dragCreateEvent: calendarProps.dragCreateEvent,
  });

  effectRefs.current = {
    onMoveEvent,
    events,
    onCreateEvent,
    onClickEvent,
    setDraggedEvent,
    calculateNewTime,
    eventContainerRef,
    createNewEvent,
    dragCreateEvent: calendarProps.dragCreateEvent,
  };

  return [effectRefs, eventContainerRef] as const;
}
