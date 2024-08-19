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
  startOfWeek,
  differenceInMilliseconds,
} from "date-fns";
import { TimelineResolution, StartDay } from "../types";
import { FlexRow, FlexCol } from "../wrappers";
import { widthToPct } from "./to_pct";
import { timelineGridHeight } from "./timeline_height";

function Wrapper({ children }: { children: React.ReactNode }) {
  return <Box sx={{ position: "absolute", inset: 0 }}>{children}</Box>;
}

function MonthHeader({
  startTime,
  height,
}: {
  height: number;
  startTime: Date;
}) {
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
    <>
      <BigTime times={weeks} width={119} height={height} smallHeight={18} />
      <Box sx={{ position: "absolute", inset: 0 }}>
        <FlexRow
          className="grid-line"
          sx={{
            position: "absolute",
            top: "56px",
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
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
                  height: "18px",
                  position: "relative",
                }}
              >
                {index !== 0 && (
                  <Box
                    sx={{
                      width: "1px",
                      borderRadius: "1px",
                      height: "18px",
                      backgroundColor:
                        index % 7 === 0
                          ? "none"
                          : (theme) => theme.palette.divider,
                      marginTop: "0px",
                    }}
                  ></Box>
                )}
                <FlexRow
                  justifyContent="center"
                  alignItems={"center"}
                  sx={{ width: widthToPct(w - 1), height: "16px" }}
                ></FlexRow>
              </Box>
            );
          })}
        </FlexRow>
      </Box>
    </>
  );
}

function ThreeMonthHeader({
  startTime,
  height,
}: {
  height: number;
  startTime: Date;
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
    <Wrapper>
      <Box sx={{ position: "absolute", inset: 0 }}>
        <>
          {months.flatMap((month, index) => {
            const xStart = month.getTime() - startTime.getTime();
            const xWidth = differenceInMilliseconds(
              startOfMonth(addMonths(month, 1)),
              month
            );
            return (
              <Box
                key={index + "divider"}
                sx={{
                  width: "1px",
                  height: 44,
                  position: "absolute",
                  left: widthToPct((720 * xStart) / totalWidth),
                }}
              >
                <Box
                  sx={{
                    width: "1px",
                    height: "100%",
                    background: (theme) => theme.palette.divider,
                    borderRadius: "1px",
                  }}
                ></Box>
              </Box>
            );
          })}
        </>
      </Box>

      <SmallTime top={60} times={weeks} noBorderMod={0} height={height + 10} />
    </Wrapper>
  );
}

function YearHeader({
  startTime,
  height,
}: {
  height: number;
  startTime: Date;
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
    <Wrapper>
      <BigTime
        times={quarters}
        width={179}
        height={height}
        smallHeight={22 + 4}
      />
      <SmallTime times={months} noBorderMod={3} height={height + 10} top={56} />
    </Wrapper>
  );
}

function ThreeYearHeader({
  startTime,
  height,
}: {
  height: number;
  startTime: Date;
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
    <Wrapper>
      <BigTime times={years} width={239} height={height} smallHeight={22 + 4} />
      <SmallTime
        times={quarters}
        noBorderMod={4}
        height={height + 10}
        top={56}
      />
    </Wrapper>
  );
}

export function Grid(props: {
  startTime: Date;
  resolution: TimelineResolution;
  now: Date;
  startDay: StartDay;
  height: number;
  empty: boolean;
}) {
  const { resolution } = props;

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
  times,
  width,
  height,
  smallHeight,
}: {
  times: Date[];
  width: number;
  height: number;
  smallHeight: number;
}) {
  return (
    <Box sx={{ position: "absolute", inset: 0 }}>
      <FlexRow>
        {times.flatMap((month, index) => {
          const els = [
            <FlexRow
              key={index}
              sx={{ width: widthToPct(width), height: "44px" }}
              justifyContent={"center"}
            ></FlexRow>,
          ];
          if (index < times.length - 1) {
            els.push(
              <Box
                key={index + "divider"}
                sx={{
                  width: "1px",
                  height: height + 56 + smallHeight,
                }}
              >
                <Box
                  sx={{
                    width: "1px",
                    height: "100%",
                    background: (theme) => theme.palette.divider,
                    borderRadius: "1px",
                  }}
                ></Box>
              </Box>
            );
          }
          return els;
        })}
      </FlexRow>
    </Box>
  );
}

function SmallTime({
  times,
  noBorderMod,
  height,
  top,
}: {
  times: Date[];
  noBorderMod: number;
  height: number;
  top: number;
}) {
  return (
    <Box sx={{ position: "absolute", inset: 0 }}>
      <FlexRow
        justifyContent="space-between"
        sx={{
          top: `${top}px`,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {times.flatMap((week, index) => {
          const els = [
            <FlexRow key={index} justifyContent="center" flex="1"></FlexRow>,
          ];
          const divider = (index: number) => (
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
                  height: height + 16,
                  background:
                    index % noBorderMod === 0
                      ? "none"
                      : (theme) => theme.palette.divider,
                  borderRadius: "1px",
                }}
              ></Box>
            </Box>
          );

          // don't put borders on left and right
          if (index !== 0) {
            els.unshift(divider(index));
          }

          // put borders on left and right
          // els.unshift(divider(index));
          // if (index === times.length - 1) {
          //   els.push(divider(index + 1));
          // }

          return els;
        })}
      </FlexRow>
    </Box>
  );
}
