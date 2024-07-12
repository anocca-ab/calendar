import { Box, Typography } from "@mui/material";
import {
  addDays,
  isSameWeek,
  format,
  isSameDay,
  addMonths,
  addWeeks,
  isSameMonth,
  StartOfWeekOptions,
  isSameQuarter,
  addYears,
  addQuarters,
  isSameYear,
  getMonth,
  startOfMonth,
  differenceInMilliseconds,
} from "date-fns";
import { TimelineResolution, StartDay } from "../types";
import { FlexRow, FlexCol } from "../wrappers";
import { widthToPct } from "./to_pct";

function MonthHeader({ startTime, now }: { startTime: Date; now: Date }) {
  const weeks: Date[] = [];
  const days: Date[] = [];
  for (let i = 0; i < 6; i += 1) {
    for (let j = 0; j < 7; j += 1) {
      if (j === 0) {
        weeks.push(addDays(startTime, i * 7));
      }
      const k = i * 7 + j;
      days.push(addDays(startTime, k));
    }
  }
  return (
    <Box>
      <BigTime
        now={now}
        times={weeks}
        isActive={isSameWeek}
        formatDate={(date) => {
          return `W${format(date, "I")}`;
        }}
        width={119}
      />
      <Box sx={{ height: "16px" }} />
      <FlexRow>
        {days.map((day, index) => {
          let w = 17;
          if (index === 0) {
            w = 16;
          }
          w += 1 / 7;
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                width: widthToPct(w),
                alignItems: "center",
                height: "16px",
                position: "relative",
                justifyContent: "center",
              }}
            >
              {index !== 0 && (
                <Box
                  sx={{
                    width: "1px",
                    borderRadius: "1px",
                    height: "18px",
                    backgroundColor: "none",
                    marginTop: "-1px",
                  }}
                ></Box>
              )}
              <FlexRow
                sx={{
                  width: `calc(100% - 1px)`,
                  height: "16px",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <FlexCol
                  alignItems="center"
                  justifyContent="center"
                  sx={{ width: "100%" }}
                >
                  <Typography
                    variant="event"
                    sx={{ fontSize: "8px", lineHeight: "8px" }}
                    color={(theme) => {
                      return theme.palette.text[
                        isSameDay(day, now) ? "primary" : "secondary"
                      ];
                    }}
                  >
                    {format(day, "d")}
                  </Typography>
                  {isSameDay(day, now) && (
                    <Box
                      sx={{
                        background: (theme) => theme.palette.primary.main,
                        height: "1px",
                        width: `min(${(100 * 8) / w}%, 12px)`,
                        borderRadius: "1px",
                        position: "absolute",
                        bottom: "2px",
                      }}
                    ></Box>
                  )}
                </FlexCol>
              </FlexRow>
            </Box>
          );
        })}
      </FlexRow>
    </Box>
  );
}

function ThreeMonthHeader({
  startTime,
  now,
  startDay,
}: {
  startTime: Date;
  now: Date;
  startDay: StartDay;
}) {
  const monthMap = new Map<number, Date>();
  const weeks: Date[] = [];
  for (let i = 0; i < 15; i += 1) {
    const week = addWeeks(startTime, i);
    weeks.push(week);
    const month = getMonth(week);
    if (!monthMap.has(month)) {
      monthMap.set(month, startOfMonth(week));
    }
  }
  const months: Date[] = Array.from(monthMap.values());

  const totalWidth = differenceInMilliseconds(
    addWeeks(startTime, 15),
    startTime
  );

  return (
    <Box>
      <Box sx={{ position: "relative", height: "44px", width: "100%" }}>
        <>
          {months.flatMap((month, index) => {
            const xStart = month.getTime() - startTime.getTime();
            const xWidth = differenceInMilliseconds(
              startOfMonth(addMonths(month, 1)),
              month
            );

            return (
              <FlexRow
                key={index}
                sx={{
                  width: widthToPct((720 * xWidth) / totalWidth),
                  height: "44px",
                  overflow: "hidden",
                  left: widthToPct((720 * xStart) / totalWidth),
                  position: "absolute",
                }}
                justifyContent={"center"}
              >
                <Box>
                  <Typography
                    variant="h4"
                    color={(theme) =>
                      theme.palette.text[
                        isSameMonth(month, now) ? "primary" : "secondary"
                      ]
                    }
                  >
                    {format(month, "MMM")}
                  </Typography>
                  {isSameMonth(month, now) && (
                    <Box
                      sx={{
                        background: (theme) => theme.palette.primary.main,
                        height: "2px",
                        width: "100%",
                        borderRadius: "2px",
                      }}
                    ></Box>
                  )}
                </Box>
              </FlexRow>
            );
          })}
        </>
      </Box>
      <Box sx={{ height: "16px" }} />
      <SmallTime
        formatDate={(date) => "W" + format(date, "I")}
        times={weeks}
        noBorderMod={4}
        isActive={(d) => {
          const options: StartOfWeekOptions = {
            weekStartsOn: startDay === "monday" ? 1 : 0,
          };
          return isSameWeek(d, now, options);
        }}
      />
    </Box>
  );
}

function YearHeader({
  startTime,
  now,
  startDay,
}: {
  startTime: Date;
  now: Date;
  startDay: StartDay;
}) {
  const quarters: Date[] = [];
  const months: Date[] = [];
  // 4 quarters
  for (let i = 0; i < 4; i += 1) {
    // 3 months
    for (let j = 0; j < 3; j += 1) {
      if (j === 0) {
        quarters.push(addMonths(startTime, i * 3));
      }
      const k = i * 3 + j;
      months.push(addMonths(startTime, k));
    }
  }
  return (
    <Box>
      <BigTime
        now={now}
        times={quarters}
        isActive={isSameQuarter}
        formatDate={(date) => {
          return format(date, "qqq");
        }}
        width={179}
      />
      <Box sx={{ height: "16px" }} />
      <SmallTime
        formatDate={(date) => format(date, "MMM")}
        times={months}
        noBorderMod={3}
        isActive={(d) => isSameMonth(d, now)}
      />
    </Box>
  );
}

function ThreeYearHeader({
  startTime,
  now,
  startDay,
}: {
  startTime: Date;
  now: Date;
  startDay: StartDay;
}) {
  const years: Date[] = [];
  const quarters: Date[] = [];
  // 3 years
  for (let i = 0; i < 3; i += 1) {
    // 4 quarters per year
    for (let j = 0; j < 4; j += 1) {
      if (j === 0) {
        years.push(addYears(startTime, i));
      }
      quarters.push(addQuarters(addYears(startTime, i), j));
    }
  }
  return (
    <Box>
      <BigTime
        now={now}
        times={years}
        isActive={isSameYear}
        formatDate={(date) => {
          return format(date, "yyyy");
        }}
        width={239}
      />
      <Box sx={{ height: "16px" }} />
      <SmallTime
        formatDate={(date) => format(date, "qqq")}
        times={quarters}
        noBorderMod={4}
        isActive={(d) => isSameQuarter(d, now)}
      />
    </Box>
  );
}

export function Header({
  resolution,
  ...props
}: {
  startTime: Date;
  resolution: TimelineResolution;
  now: Date;
  startDay: StartDay;
}) {
  if (resolution === "month") {
    return <MonthHeader {...props} />;
  }
  if (resolution === "3-months") {
    return <ThreeMonthHeader {...props} />;
  }
  if (resolution === "year") {
    return <YearHeader {...props} />;
  }
  if (resolution === "3-years") {
    return <ThreeYearHeader {...props} />;
  }
  throw new Error("Invalid resolution");
}
function BigTime({
  now,
  times,
  isActive,
  formatDate,
  width,
}: {
  now: Date;
  times: Date[];
  isActive: (a: Date, now: Date) => boolean;
  formatDate: (date: Date) => string;
  width: number;
}) {
  return (
    <FlexRow>
      {times.flatMap((month, index) => {
        const els = [
          <FlexRow
            key={index}
            sx={{
              width: widthToPct(width),
              height: "44px",
              overflow: "hidden",
            }}
            justifyContent={"center"}
          >
            <Box>
              <Typography
                variant="h4"
                color={(theme) =>
                  theme.palette.text[
                    isActive(month, now) ? "primary" : "secondary"
                  ]
                }
              >
                {formatDate(month)}
              </Typography>
              {isActive(month, now) && (
                <Box
                  sx={{
                    background: (theme) => theme.palette.primary.main,
                    height: "2px",
                    width: "100%",
                    borderRadius: "2px",
                  }}
                ></Box>
              )}
            </Box>
          </FlexRow>,
        ];
        if (index < times.length - 1) {
          els.push(
            <Box
              key={index + "divider"}
              sx={{
                width: "1px",
                height: "16px",
              }}
            >
              <Box
                sx={{
                  width: "1px",
                  height: "48px",
                  background: (theme) => "none",
                  borderRadius: "1px",
                }}
              ></Box>
            </Box>
          );
        }
        return els;
      })}
    </FlexRow>
  );
}

function SmallTime({
  times,
  formatDate,
  noBorderMod,
  isActive,
}: {
  times: Date[];
  formatDate: (date: Date) => string;
  noBorderMod: number;
  isActive: (date: Date) => boolean;
}) {
  return (
    <FlexRow justifyContent="space-between">
      {times.flatMap((week, index) => {
        const els = [
          <FlexRow
            key={index}
            justifyContent="center"
            flex="1"
            sx={{ overflow: "hidden" }}
          >
            <Box>
              <Typography
                variant="body2"
                color={(theme) => theme.palette.text.secondary}
              >
                {formatDate(week)}
              </Typography>
              {isActive(week) ? (
                <Box
                  sx={{
                    background: (theme) => theme.palette.primary.main,
                    height: "2px",
                    borderRadius: "2px",
                    width: "100%",
                  }}
                ></Box>
              ) : null}
            </Box>
          </FlexRow>,
        ];
        if (index !== 0) {
          els.unshift(
            <Box
              key={index + "divider"}
              sx={{
                width: "1px",
                height: "16px",
              }}
            >
              <Box
                sx={{
                  width: "1px",
                  height: 16,
                  background:
                    index % noBorderMod === 0 ? "none" : (theme) => "none",
                  borderTopLeftRadius: "1px",
                  borderTopRightRadius: "1px",
                }}
              ></Box>
            </Box>
          );
        }
        return els;
      })}
    </FlexRow>
  );
}
