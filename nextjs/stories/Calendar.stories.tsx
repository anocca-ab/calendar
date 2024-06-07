import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { WeekCalendar } from "../components/calendar";
import { createRoot } from "react-dom/client";
import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Menu,
  MenuItem,
  Paper,
  Popper,
  SvgIcon,
  TextField,
} from "@mui/material";
import React from "react";
import { Theme } from "@/components/theme";
import { FlexRow } from "@/components/wrappers";
import {
  addDays,
  addHours,
  addMilliseconds,
  addMinutes,
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  differenceInMinutes,
  differenceInQuarters,
  endOfDay,
  format,
  getHours,
  isSameDay,
  roundToNearestHours,
  roundToNearestMinutes,
  setHours,
  startOfDay,
  formatDistanceStrict,
  startOfWeek,
  subDays,
} from "date-fns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { CalendarEvent } from "@/components/types";
import { isAllDayEvent } from "@/components/helpers";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Calendar",
  component: WeekCalendar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    // backgroundColor: { control: "color" },
    onCreateEvent: {
      table: {
        disable: true,
      },
    },
    events: {
      table: {
        disable: true,
      },
    },
    workWeek: {
      control: "boolean",
    },
    startOfWeek: {
      control: "date",
    },
    now: {
      control: "date",
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    workWeek: false,
    startDay: "monday",
    startOfWeek: new Date(),
    now: new Date(),
  },
  decorators: [
    (Story) => (
      <Theme>
        <Box sx={{ background: (theme) => theme.palette.background.default }}>
          <Story />
        </Box>
      </Theme>
    ),
  ],
} satisfies Meta<typeof WeekCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const EmptyCalendar: Story = {
  args: {},
};

export const CanCreateEvents: Story = {
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};

export const WithAllDayEvents: Story = {
  args: {
    events: [
      {
        start: startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
        end: endOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)),
        title: "A two day event",
      },
      {
        start: startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
        end: endOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
        title: "All day event",
      },
      {
        start: startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
        end: endOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 2)),
        title: "A three day event",
      },
      {
        start: startOfDay(
          subDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 2),
        ),
        end: endOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 14)),
        title: "A loong day event",
      },
    ],
  },
  render: (props) => {
    return <InteractiveDemo {...props} />;
  },
};

function InteractiveDemo(
  props: React.ComponentPropsWithRef<typeof WeekCalendar>,
) {
  const [events, setEvents] = React.useState<CalendarEvent[]>(
    props.events ?? [],
  );
  const [createModalOpen, setCreateModalOpen] = React.useState<
    undefined | { start: Date; end?: Date; key: number }
  >();
  const onCloseCreateModal = React.useRef<
    undefined | ((cb: () => void) => void)
  >();
  const onCreateEvent = (start: Date, end?: Date) => {
    if (onCloseCreateModal.current) {
      onCloseCreateModal.current(() => {
        setCreateModalOpen({ start, end, key: Math.random() });
      });
    } else {
      setCreateModalOpen({ start, end, key: Math.random() });
    }
  };

  return (
    <>
      <Theme>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {createModalOpen && (
            <CreateEventComponent
              createModalConfig={createModalOpen}
              setOnCloseCreateModal={onCloseCreateModal}
              onSave={(event: CalendarEvent) => {
                setEvents([...events, event]);
              }}
              key={createModalOpen.key}
            />
          )}
          <WeekCalendar
            {...props}
            events={events}
            onCreateEvent={onCreateEvent}
          />
        </LocalizationProvider>
      </Theme>
    </>
  );
}

function CreateEventComponent({
  createModalConfig: props,
  setOnCloseCreateModal,
  onSave,
}: {
  createModalConfig: {
    start: Date;
    end?: Date;
  };
  setOnCloseCreateModal: { current?: (cb: () => void) => void };
  onSave: (event: CalendarEvent) => void;
}) {
  const [start, setStart] = React.useState(props.start);
  const [end, setEnd] = React.useState(props.end);

  const allDay = isAllDayEvent({ start, end });

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const [onClosed, setOnClosed] = React.useState<undefined | (() => void)>(
    undefined,
  );

  setOnCloseCreateModal.current = (cb) => {
    if (!open) {
      cb();
    } else {
      setOpen(false);
      setOnClosed(cb);
    }
  };

  const [title, setTitle] = React.useState("");

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        onTransitionEnd={(event) => {
          if (!open) {
            if (onClosed) {
              onClosed();
            }
          }
        }}
        PaperProps={{
          component: "div",
        }}
        maxWidth={"sm"}
        fullWidth
      >
        <DialogContent>
          <FlexRow pt={2} gap={2}>
            <Box width={24} />
            <TextField
              autoFocus
              id="name"
              name="title"
              placeholder="Add title and time"
              fullWidth
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              variant="standard"
              size="medium"
              InputProps={{
                sx: {
                  fontSize: "1.5rem",
                  color: (theme) => theme.palette.text.primary,
                },
              }}
              InputLabelProps={{
                sx: {
                  fontSize: "1.5rem",
                },
              }}
            />
          </FlexRow>
          <FlexRow pt={2} gap={2}>
            <Box width={24} />
            <FlexRow>
              <Box width={72}>
                <Button
                  size="small"
                  {...(!end || start.getTime() === end.getTime()
                    ? { color: "inherit", variant: "text" }
                    : { color: "primary", variant: "contained" })}
                  onClick={() => {
                    if (!end || start.getTime() === end.getTime()) {
                      setEnd(
                        allDay
                          ? addDays(startOfDay(start), 1)
                          : addHours(start, 1),
                      );
                    }
                  }}
                >
                  Event
                </Button>
              </Box>
              <Box width={72}>
                <Button
                  size="small"
                  {...(!end || start.getTime() === end.getTime()
                    ? { color: "primary", variant: "contained" }
                    : { color: "inherit", variant: "text" })}
                  onClick={() => {
                    if (start.getTime() === startOfDay(start).getTime()) {
                      const hours = getHours(addHours(new Date(), 1));
                      const newStart = setHours(start, hours);
                      setStart(newStart);
                      if (!allDay) {
                        setEnd(newStart);
                      } else {
                        setEnd(undefined);
                      }
                    } else {
                      if (!allDay) {
                        setEnd(start);
                      } else {
                        setEnd(undefined);
                      }
                    }
                  }}
                >
                  Task
                </Button>
              </Box>
            </FlexRow>
          </FlexRow>

          <FlexRow pt={2} alignItems="center" gap={2}>
            <SvgIcon
              sx={{
                path: {
                  fill: (theme) => theme.palette.text.primary,
                },
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
              >
                <g clipPath="url(#a)">
                  <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1Z" />
                </g>
                <defs>
                  <clipPath id="a">
                    <path d="M0 0h24v24H0z" />
                  </clipPath>
                </defs>
              </svg>
            </SvgIcon>
            {end && start.getTime() !== end.getTime() ? (
              allDay ? (
                <>
                  <DatePicker
                    value={start}
                    onChange={(date): void => {
                      if (date) {
                        setStart(date);
                        if (differenceInMilliseconds(end, date) < 0) {
                          setEnd(endOfDay(date));
                        }
                      }
                    }}
                  />
                  {"–"}
                  <DatePicker
                    value={end}
                    onChange={(date): void => {
                      if (date) {
                        if (differenceInMilliseconds(date, start) < 0) {
                          setStart(date);
                          setEnd(endOfDay(date));
                        } else {
                          setEnd(date);
                        }
                      }
                    }}
                  />
                </>
              ) : (
                <>
                  <DatePicker
                    value={start}
                    onChange={(date): void => {
                      if (date) {
                        if (!isSameDay(date, end)) {
                          setEnd(
                            addMilliseconds(
                              date,
                              differenceInMilliseconds(end, start),
                            ),
                          );
                        }
                        setStart(date);
                      }
                    }}
                  />
                  <TimePicker
                    startTime={startOfDay(start)}
                    value={start}
                    onChange={(newValue) => {
                      if (newValue) {
                        setStart(newValue);
                      }
                    }}
                  />
                  {"–"}
                  <TimePicker
                    startTime={start}
                    value={end}
                    onChange={(newValue) => setEnd(newValue ?? undefined)}
                    showDiff
                  />
                </>
              )
            ) : (
              <>
                <DatePicker
                  value={start}
                  onChange={(date): void => {
                    if (date) {
                      setStart(date);
                    }
                  }}
                />
                {start.getTime() === end?.getTime() ? (
                  <TimePicker
                    startTime={startOfDay(start)}
                    value={start}
                    onChange={(newValue) => {
                      if (newValue) {
                        setStart(newValue);
                        setEnd(newValue);
                      }
                    }}
                  />
                ) : null}
              </>
            )}
          </FlexRow>

          <FlexRow pt={1} gap={2}>
            <Box width={24} />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allDay}
                    onChange={(ev, checked) => {
                      if (!end || start.getTime() === end.getTime()) {
                        // it is a task
                        if (!checked) {
                          // it is not all day
                          const hours = getHours(addHours(new Date(), 1));
                          const newStart = setHours(start, hours);
                          setStart(newStart);
                          setEnd(newStart);
                        } else {
                          // it is all day
                          setStart(startOfDay(start));
                          setEnd(undefined);
                        }
                        return;
                      }
                      if (!checked) {
                        if (start.getTime() === startOfDay(start).getTime()) {
                          // set the same hour as now
                          const hours = getHours(addHours(new Date(), 1));
                          const newStart = setHours(start, hours);
                          setStart(newStart);
                          setEnd(addHours(newStart, 1));
                        } else {
                          setEnd(addHours(start, 1));
                        }
                      } else {
                        setStart(startOfDay(start));
                        setEnd(endOfDay(start));
                      }
                    }}
                  />
                }
                label="All day"
              />
            </FormGroup>
          </FlexRow>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            onClick={() => {
              onSave({
                start,
                end,
                title,
              });
              handleClose();
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function TimePicker(props: {
  startTime: Date;
  value: Date;
  onChange: (newValue: Date | null) => void;
  showDiff?: boolean;
}) {
  const firstOption = roundToNearestMinutes(props.startTime, {
    nearestTo: 15,
    roundingMethod: "ceil",
  });
  let options: Date[] = [props.startTime];
  if (props.startTime.getTime() !== firstOption.getTime()) {
    options.push(firstOption);
  }
  for (let i = 1; i < 4; i += 1) {
    options.push(addMinutes(firstOption, i * 15));
  }
  for (let i = 2; i < 48; i += 1) {
    options.push(addMinutes(firstOption, i * 30));
  }
  const [open, setOpen] = React.useState(false);
  const [inputRef, setInputRef] = React.useState<null | HTMLInputElement>(null);
  const [paperRef, setPaperRef] = React.useState<null | HTMLDivElement>(null);

  return (
    <>
      <>
        <TimeField
          value={props.value}
          onChange={props.onChange}
          onSelect={() => {
            setOpen(true);
          }}
          onBlur={(ev) => {
            if (paperRef?.contains(ev.relatedTarget)) {
              return;
            }
            setOpen(false);
          }}
          inputRef={setInputRef}
        ></TimeField>
        <Popper
          open={open}
          anchorEl={inputRef}
          sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
        >
          <Paper sx={{ maxHeight: 6 * 32, overflow: "auto" }} ref={setPaperRef}>
            {options.map((option, index) => {
              let distance = "";
              if (props.showDiff) {
                const d = differenceInMinutes(option, props.startTime);
                if (d >= 60) {
                  distance = `${d / 60} hr`;
                } else {
                  if (d === 0) {
                    distance = "Task";
                  } else {
                    distance = `${d} mins`;
                  }
                }
                distance = ` (${distance})`;
              }
              return (
                <MenuItem
                  key={index}
                  value={option.toJSON()}
                  selected={option.getTime() === props.value.getTime()}
                  onClick={() => {
                    console.log("@options", option);
                    props.onChange(option);
                    setOpen(false);
                  }}
                >
                  {format(option, "h:mm a")}
                  {distance}
                </MenuItem>
              );
            })}
          </Paper>
        </Popper>
      </>
    </>
  );
}
