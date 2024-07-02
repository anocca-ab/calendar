import { CreateEvent } from "@/components/create_event";
import { CalendarNavigationBar } from "@/components/navigation_bar/calendar_navigation_bar";
import { CalendarEvent } from "@/components/types";
import React from "react";
import { WeekCalendar } from "../components/week_calendar/week_calendar";
import { MonthCalendar } from "./month_calendar/month_calendar";
import { Timeline } from "./timeline/timeline";

export function InteractiveDemo(props: {
  events?: CalendarEvent[];
  now?: Date;
  startDay?: "sunday" | "monday";
  type: "month" | "week" | "timeline";
}) {
  const [events, setEvents] = React.useState<CalendarEvent[]>(
    props.events ?? []
  );

  const [editModalOpen, setEditModalOpen] = React.useState<
    undefined | { event: CalendarEvent; key: number }
  >();

  const onCloseModal = React.useRef<undefined | ((cb: () => void) => void)>();

  const onEditEvent = (event: CalendarEvent) => {
    if (onCloseModal.current) {
      onCloseModal.current(() => {
        setEditModalOpen({ event, key: Math.random() });
      });
    } else {
      setEditModalOpen({ event, key: Math.random() });
    }
  };

  const onMoveEvent = (
    event: CalendarEvent,
    newStart: Date,
    newEnd: Date | undefined
  ) => {
    setEvents((prev) => {
      return prev.map((ev) => {
        if (ev === event) {
          return {
            ...ev,
            start: newStart,
            end: newEnd,
          };
        }
        return ev;
      });
    });
  };

  const [currentWeek, setCurrentWeek] = React.useState(new Date());
  const CalendarType =
    props.type === "month"
      ? MonthCalendar
      : props.type === "week"
      ? WeekCalendar
      : Timeline;

  if (editModalOpen) {
    console.log("edit modal open", events.includes(editModalOpen.event));
  }

  return (
    <>
      {editModalOpen && (
        <CreateEvent
          event={editModalOpen.event}
          onCloseModalRef={onCloseModal}
          onSave={(event: CalendarEvent, originalEvent: CalendarEvent) => {
            if (events.includes(originalEvent)) {
              setEvents(
                events.map((ev) => (ev === originalEvent ? event : ev))
              );
            } else {
              // create
              setEvents([...events, event]);
            }
          }}
          onDelete={(event: CalendarEvent) => {
            if (events.includes(event)) {
              const eventIndex = events.findIndex((ev) => ev === event);
              const a = [...events];
              a.splice(eventIndex, 1);
              setEvents(a);
            }
          }}
          key={editModalOpen.key}
        />
      )}
      <CalendarNavigationBar
        now={props.now ?? new Date()}
        startDay={props.startDay ?? "monday"}
        currentDate={currentWeek}
        setCurrentDate={setCurrentWeek}
        type={props.type}
      />
      <CalendarType
        {...props}
        startOfWeek={currentWeek}
        events={events}
        onCreateEvent={(start, end) => {
          onEditEvent({ start, end });
        }}
        onEditEvent={(ev) => {
          console.log(events.includes(ev));
          onEditEvent(ev);
        }}
        onMoveEvent={onMoveEvent}
      />
    </>
  );
}
