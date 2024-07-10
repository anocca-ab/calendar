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
} from "date-fns";
import { TimelineResolution, StartDay } from "../types";
import { FlexRow, FlexCol } from "../wrappers";
import { widthToPct } from "./to_pct";

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
    <Wrapper>
      <BigTime times={weeks} width={119} height={height} />
      <Box sx={{ position: "absolute", inset: 0 }}>
        <FlexRow
          sx={{
            position: "absolute",
            top: "60px",
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
                  width: `${w}px`,
                  alignItems: "center",
                  height: "16px",
                  position: "relative",
                }}
              >
                {index !== 0 && (
                  <Box
                    sx={{
                      width: "1px",
                      borderRadius: "1px",
                      height: "24px",
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
    </Wrapper>
  );
}

function ThreeMonthHeader({
  startTime,
  height,
}: {
  height: number;
  startTime: Date;
}) {
  const months: Date[] = [];
  const weeks: Date[] = [];
  // 3 months
  for (let i = 0; i < 3; i += 1) {
    // 4 weeks
    for (let j = 0; j < 4; j += 1) {
      if (j === 0) {
        months.push(addMonths(startTime, i));
      }
      weeks.push(addWeeks(addMonths(startTime, i), j));
    }
  }
  return (
    <Wrapper>
      <BigTime times={months} width={239} height={height} />
      <SmallTime times={weeks} noBorderMod={4} height={height} />
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
      <BigTime times={quarters} width={179} height={height} />
      <SmallTime times={months} noBorderMod={3} height={height} />
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
      <BigTime times={years} width={239} height={height} />
      <SmallTime times={quarters} noBorderMod={4} height={height} />
    </Wrapper>
  );
}

export function Grid({
  resolution,
  ...props
}: {
  startTime: Date;
  resolution: TimelineResolution;
  now: Date;
  startDay: StartDay;
  height: number;
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
  times,
  width,
  height,
}: {
  times: Date[];
  width: number;
  height: number;
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
                  height: height + 64 + 16,
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
}: {
  times: Date[];
  noBorderMod: number;
  height: number;
}) {
  return (
    <Box sx={{ position: "absolute", inset: 0 }}>
      <FlexRow
        justifyContent="space-between"
        sx={{ top: "64px", position: "absolute", left: 0, right: 0, bottom: 0 }}
      >
        {times.flatMap((week, index) => {
          const els = [
            <FlexRow key={index} justifyContent="center" flex="1"></FlexRow>,
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
                    height: height + 16,
                    background:
                      index % noBorderMod === 0
                        ? "none"
                        : (theme) => theme.palette.divider,
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
    </Box>
  );
}
