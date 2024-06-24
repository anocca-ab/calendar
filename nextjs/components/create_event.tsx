import { isAllDayEvent } from "@/components/helpers";
import { CalendarEvent } from "@/components/types";
import { FlexRow } from "@/components/wrappers";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleIcon from "@mui/icons-material/Circle";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Popper,
  Select,
  SelectChangeEvent,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import {
  addDays,
  addHours,
  addMilliseconds,
  addMinutes,
  differenceInMilliseconds,
  differenceInMinutes,
  endOfDay,
  format,
  getHours,
  isSameDay,
  roundToNearestMinutes,
  setHours,
  startOfDay,
} from "date-fns";
import React from "react";

export function CreateEvent({
  event,
  onCloseModalRef,
  onSave,
}: {
  event: CalendarEvent;
  onCloseModalRef: { current?: (cb: () => void) => void };
  onSave: (event: CalendarEvent, originalEvent: CalendarEvent) => void;
}) {
  const [start, setStart] = React.useState(event.start);
  const [end, setEnd] = React.useState(event.end);

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

  onCloseModalRef.current = (cb) => {
    if (!open) {
      cb();
    } else {
      setOpen(false);
      setOnClosed(cb);
    }
  };

  const [title, setTitle] = React.useState(event.title ?? "");

  const [eventColor, setEventColor] = React.useState("orange");

  const onChangeEventColor = (event: SelectChangeEvent) => {
    setEventColor(event.target.value);
  };

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

          <FlexRow pt={1} gap={2} alignItems="flex-end">
            <Box width={24} />

            <Select
              // sx={{
              //   boxShadow: "none",
              //   ".MuiOutlinedInput-input": {
              //     p: 0,
              //   },
              //   ".MuiOutlinedInput-notchedOutline": {
              //     border: 0,
              //   },
              //   "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              //     {
              //       border: "none",
              //     },
              // }}
              variant="standard"
              size="small"
              value={eventColor}
              onChange={onChangeEventColor}
            >
              <MenuItem value={"orange"}>
                {eventColor === "orange" ? (
                  <CheckCircleIcon style={{ color: "#FF7043" }} />
                ) : (
                  <CircleIcon style={{ color: "#FF7043" }} />
                )}
              </MenuItem>
              <MenuItem value={"indigo"}>
                {eventColor === "indigo" ? (
                  <CheckCircleIcon style={{ color: "#5C6BC0" }} />
                ) : (
                  <CircleIcon style={{ color: "#5C6BC0" }} />
                )}
              </MenuItem>
              <MenuItem value={"pink"}>
                {eventColor === "pink" ? (
                  <CheckCircleIcon style={{ color: "#EC407A" }} />
                ) : (
                  <CircleIcon style={{ color: "#EC407A" }} />
                )}
              </MenuItem>
              <MenuItem value={"teal"}>
                {eventColor === "teal" ? (
                  <CheckCircleIcon style={{ color: "#26A69A" }} />
                ) : (
                  <CircleIcon style={{ color: "#26A69A" }} />
                )}
              </MenuItem>
              <MenuItem value={"red"}>
                {eventColor === "red" ? (
                  <CheckCircleIcon style={{ color: "#EF5350" }} />
                ) : (
                  <CircleIcon style={{ color: "#EF5350" }} />
                )}
              </MenuItem>
            </Select>
            <Typography variant="body1">Event color</Typography>
          </FlexRow>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            onClick={() => {
              onSave(
                {
                  start,
                  end,
                  title,
                  color: eventColor,
                },
                event,
              );
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
