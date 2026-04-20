import { CreateEvent } from "@/components/create_event";
import { CalendarNav } from "@/components/nav/calendar_nav";
import {
  CalendarEvent,
  CalendarGroupConfig,
  TimelineResolution,
} from "@/components/types";
import React from "react";
import { WeekCalendar } from "./week_calendar/week_calendar";
import { MonthCalendar } from "./month_calendar/month_calendar";
import { Timeline, TimelineProps } from "./timeline/timeline";
import { Box, SxProps } from "@mui/material";
import { TimelineNav } from "./nav/timeline_nav";
import { DEFAULT_COLOR, mergeSx } from "./helpers";
import { eventsToRows } from "@/components/events_to_rows";

type CalEventWithKey = CalendarEvent<{ data: { key: string } }>;

function getRandomName() {
  return [
    "John",
    "Doe",
    "Jane",
    "Smith",
    "Alice",
    "Brown",
    "Bob",
    "White",
    "Charlie",
    "Black",
  ][Math.floor(Math.random() * 10)];
}

export function InteractiveDemo(props: {
  events?: CalendarEvent<undefined>[];
  rows?: CalendarEvent<undefined>[][];
  now?: Date;
  startDay?: "sunday" | "monday";
  type: "month" | "week" | "timeline";
  timelineResolution?: TimelineResolution;
  defaultEventColor?: string;
  sidebar?: boolean;
  workWeek?: boolean;
  startOfWeek?: Date;
  group?: boolean;
  onCreateEvent?: (start: Date, end: Date | undefined) => void;
  onMoveEvent?: (
    event: CalendarEvent<undefined>,
    newStart: Date,
    newEnd: Date | undefined,
  ) => void;
  onClickEvent?: (event: CalendarEvent<any>, nativeEvent: MouseEvent) => void;
  noHeader?: boolean;
  sx?: SxProps;
  getId?: (event: CalendarEvent<any>) => string;
  testSelection?: boolean;
}) {
  const { now, startDay, type, events: _events, testSelection } = props;
  const [realEvents, _setEvents] = React.useState<CalEventWithKey[]>(
    (_events ?? []).map((ev) => ({
      ...ev,
      data: { ...(ev as any).data, key: Math.random().toString() },
    })),
    // .sort((a, b) => a.start.getTime() - b.start.getTime())
  );
  const [click, setClick] = React.useState(false);
  React.useEffect(() => {
    const click = () => {
      setClick((c) => !c);
    };
    window.addEventListener("click", click);
    return () => {
      window.removeEventListener("click", click);
    };
  }, []);
  const _rows = React.useMemo(() => {
    return eventsToRows(
      !testSelection
        ? realEvents
        : realEvents.map((ev) =>
            ev.title === "0" ? { ...ev, selected: click } : ev,
          ),
      props.timelineResolution ?? "month",
    );
  }, [props.timelineResolution, testSelection, realEvents, click]);
  const rows = (props.rows ?? _rows) as typeof _rows;

  // Base group config shared by all calendar types: groups events by color.
  const groupConfig:
    | CalendarGroupConfig<{ data: { key: string } }>
    | undefined = React.useMemo(() => {
    if (!props.group) {
      return undefined;
    }
    const getGroup = (event: CalEventWithKey) => {
      return event.color ?? DEFAULT_COLOR;
    };

    const groupsRecord: Record<
      string,
      { key: string; title: string; color: string; events: CalEventWithKey[] }
    > = {};

    realEvents.forEach((event) => {
      const g = getGroup(event);
      if (!groupsRecord[g]) {
        groupsRecord[g] = {
          key: g,
          title: g + getRandomName(),
          color: g,
          events: [],
        };
      }
      groupsRecord[g].events.push(event);
    });

    return { getGroup, groups: Object.values(groupsRecord) };
  }, [realEvents, props.group]);

  // Timeline additionally needs rows pre-packed per group (timeline-specific layout).
  const timelineGroup: TimelineProps<{ data: { key: string } }>["group"] =
    React.useMemo(() => {
      if (!groupConfig) return undefined;
      const groups = groupConfig.groups.map((g) => ({
        ...g,
        rows: eventsToRows(g.events ?? [], props.timelineResolution ?? "month"),
      }));
      return { getGroup: groupConfig.getGroup, groups };
    }, [props.timelineResolution, groupConfig]);

  const setEvents = (
    events:
      | CalEventWithKey[]
      | ((events: CalEventWithKey[]) => CalEventWithKey[]),
  ) => {
    return _setEvents(events);
  };

  const [draft, setDraft] = React.useState<CalEventWithKey | undefined>(
    undefined,
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
    newEnd: Date | undefined,
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
    <Box
      p={2}
      sx={mergeSx(
        {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        props.sx,
      )}
      className="interactive-demo"
    >
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
                realEvents.map((e) => (e.data.key === ev.data.key ? ev : e)),
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
                  ev.data.key === originalEvent.data.key ? newEv : ev,
                ),
              );
            }
          }}
          onDelete={(event) => {
            const eventIndex = realEvents.findIndex(
              (ev) => event.data.key === ev?.data.key,
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
      <Box sx={{ flex: 1 }}>
        <CalendarType
          {...props}
          rows={rows}
          group={(type === "timeline" ? timelineGroup : groupConfig) as any}
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
    </Box>
  );
}
