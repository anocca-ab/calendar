import { CreateEvent } from "@/components/create_event";
import { CalendarNav } from "@/components/nav/calendar_nav";
import { CalendarEvent, TimelineResolution } from "@/components/types";
import React from "react";
import { WeekCalendar } from "./week_calendar/week_calendar";
import { MonthCalendar } from "./month_calendar/month_calendar";
import { Timeline } from "./timeline/timeline";
import { Box } from "@mui/material";
import { TimelineNav } from "./nav/timeline_nav";

export function InteractiveDemo(props: {
  events?: CalendarEvent[];
  now?: Date;
  startDay?: "sunday" | "monday";
  type: "month" | "week" | "timeline";
  timelineResolution?: TimelineResolution;
}) {
  const { now, startDay, type, events: _events } = props;
  const [events, setEvents] = React.useState<CalendarEvent[]>(_events ?? []);

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

  const [startTime, setStartTime] = React.useState(new Date());
  const CalendarType =
    type === "month"
      ? MonthCalendar
      : type === "week"
      ? WeekCalendar
      : Timeline;

  return (
    <Box p={2}>
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
      {type === "timeline" ? (
        <TimelineNav
          key={props.timelineResolution ?? "month"}
          now={props.now ?? new Date()}
          time={startTime}
          setTime={setStartTime}
          resolution={props.timelineResolution ?? "month"}
        />
      ) : (
        <CalendarNav
          type={type}
          now={props.now ?? new Date()}
          time={startTime}
          setTime={setStartTime}
        />
      )}
      <CalendarType
        {...props}
        startTime={startTime} // timeline
        startOfWeek={startTime} // week calendar
        startOfMonth={startTime} // month calendar
        events={events}
        onCreateEvent={(start, end) => {
          onEditEvent({ start, end });
        }}
        onEditEvent={(ev) => {
          onEditEvent(ev);
        }}
        onMoveEvent={onMoveEvent}
      />
    </Box>
  );
}
