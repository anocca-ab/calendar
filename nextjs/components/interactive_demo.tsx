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

type CalEventWithKey = CalendarEvent<{ data: { key: string } }>;

export function InteractiveDemo(props: {
  events?: CalendarEvent<undefined>[];
  now?: Date;
  startDay?: "sunday" | "monday";
  type: "month" | "week" | "timeline";
  timelineResolution?: TimelineResolution;
  defaultEventColor?: string;
  sidebar?: boolean;
  workWeek?: boolean;
  startOfWeek?: Date;
  onCreateEvent?: (start: Date, end: Date | undefined) => void;
  onMoveEvent?: (
    event: CalendarEvent<undefined>,
    newStart: Date,
    newEnd: Date | undefined
  ) => void;
  onClickEvent?: (event: CalendarEvent<any>, nativeEvent: MouseEvent) => void;
}) {
  const { now, startDay, type, events: _events } = props;
  const [realEvents, setEvents] = React.useState<CalEventWithKey[]>(
    (_events ?? []).map((ev) => ({
      ...ev,
      data: { key: Math.random().toString() },
    }))
  );

  const [draft, setDraft] = React.useState<CalEventWithKey | undefined>(
    undefined
  );

  let events = [...realEvents];
  if (draft) {
    events.push(draft);
  }

  const [editModalOpen, setEditModalOpen] = React.useState<
    undefined | { key: string }
  >();

  const onCloseModal = React.useRef<undefined | ((cb: () => void) => void)>();

  const onClickEvent = (event: CalEventWithKey) => {
    setEditModalOpen({ key: event.data.key });
  };

  if (editModalOpen) {
    events = events.map((ev) => {
      if (ev.data.key && ev.data.key === editModalOpen.key) {
        return {
          ...ev,
          selected: true,
        };
      }
      return {
        ...ev,
        selected: false,
      };
    });
  }

  const onMoveEvent = (
    event: CalEventWithKey,
    newStart: Date,
    newEnd: Date | undefined
  ) => {
    if (draft && event.data.key === draft.data.key) {
      setDraft({
        ...draft,
        start: newStart,
        end: newEnd,
      });
      return;
    }
    setEvents((prev) => {
      return prev.map((ev) => {
        if (ev.data.key === event.data.key) {
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

  const editingDraft = draft && editModalOpen?.key === draft.data.key;
  const editedEvent =
    editModalOpen &&
    editModalOpen.key &&
    events.find((ev) => ev.data.key === editModalOpen.key);
  return (
    <Box p={2}>
      {editedEvent && (
        <CreateEvent
          sidebar={props.sidebar}
          onClose={() => {
            setDraft(undefined);
            setEditModalOpen(undefined);
          }}
          defaultEventColor={props.defaultEventColor}
          event={editedEvent}
          draft={editingDraft}
          onCloseModalRef={onCloseModal}
          onEdit={(ev) => {
            if (draft && ev.data.key === draft.data.key) {
              setDraft(ev);
            } else {
              setEvents(
                realEvents.map((e) => (e.data.key === ev.data.key ? ev : e))
              );
            }
          }}
          onSave={(newEv, originalEvent) => {
            if (draft && newEv.data.key === draft?.data.key) {
              // create
              setEvents([
                ...realEvents,
                {
                  ...newEv,
                  selected: false,
                  start: draft.start,
                  end: draft.end,
                  data: { key: Math.random().toString() },
                },
              ]);
            } else {
              setEvents(
                realEvents.map((ev) =>
                  ev.data.key === originalEvent.data.key ? newEv : ev
                )
              );
            }
          }}
          onDelete={(event) => {
            const eventIndex = realEvents.findIndex(
              (ev) => event.data.key === ev?.data.key
            );
            if (eventIndex !== -1) {
              const a = [...realEvents];
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
        onCreateEvent={(start, end) => {
          const ev: CalEventWithKey = {
            canEdit: true,
            color: props.defaultEventColor ?? DEFAULT_COLOR,
            end,
            start,
            title: "(No title)",
            data: {
              key: Math.random().toString(),
            },
          };
          setDraft(ev);
          onClickEvent(ev);
        }}
        onClickEvent={(ev) => {
          onClickEvent(ev);
        }}
        onMoveEvent={onMoveEvent}
      />
    </Box>
  );
}
