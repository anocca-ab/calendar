import { CreateEvent } from "@/components/create_event";
import { CalendarNav } from "@/components/nav/calendar_nav";
import { CalendarEvent, TimelineResolution } from "@/components/types";
import React from "react";
import { WeekCalendar } from "./week_calendar/week_calendar";
import { MonthCalendar } from "./month_calendar/month_calendar";
import { Timeline } from "./timeline/timeline";
import { Box } from "@mui/material";
import { TimelineNav } from "./nav/timeline_nav";
import { DEFAULT_COLOR } from "./helpers";

export function InteractiveDemo(props: {
  events?: CalendarEvent<undefined>[];
  now?: Date;
  startDay?: "sunday" | "monday";
  type: "month" | "week" | "timeline";
  timelineResolution?: TimelineResolution;
  defaultEventColor?: string;
}) {
  const { now, startDay, type, events: _events } = props;
  const [events, setEvents] = React.useState<CalendarEvent<undefined>[]>(
    _events ?? []
  );

  const [editModalOpen, setEditModalOpen] = React.useState<
    undefined | { event: CalendarEvent<undefined>; key: number }
  >();

  const onCloseModal = React.useRef<undefined | ((cb: () => void) => void)>();

  const onClickEvent = (event: CalendarEvent<any>) => {
    if (onCloseModal.current) {
      onCloseModal.current(() => {
        setEditModalOpen({ event, key: Math.random() });
      });
    } else {
      setEditModalOpen({ event, key: Math.random() });
    }
  };

  const onMoveEvent = (
    event: CalendarEvent<undefined>,
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
          defaultEventColor={props.defaultEventColor}
          event={editModalOpen.event}
          onCloseModalRef={onCloseModal}
          onSave={(event, originalEvent) => {
            if (events.includes(originalEvent)) {
              setEvents(
                events.map((ev) => (ev === originalEvent ? event : ev))
              );
            } else {
              // create
              setEvents([...events, event]);
            }
          }}
          onDelete={(event) => {
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
          now={now ?? new Date()}
          time={startTime}
          setTime={setStartTime}
          resolution={props.timelineResolution ?? "month"}
          startDay={startDay ?? "monday"}
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
        dragCreateEvent={(start, end) => {
          const ev: CalendarEvent<undefined> = {
            canEdit: true,
            color: props.defaultEventColor ?? DEFAULT_COLOR,
            end,
            start,
            title: "(No title)",
          };
          setEvents((prev) => {
            return [...prev, ev];
          });
          onClickEvent(ev);
        }}
        onCreateEvent={(start, end) => {
          onClickEvent({ start, end });
        }}
        onClickEvent={(ev) => {
          onClickEvent(ev);
        }}
        onMoveEvent={onMoveEvent}
      />
    </Box>
  );
}
