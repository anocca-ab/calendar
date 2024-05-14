export const AppTsx = `
import Calendar from './Calendar.tsx'
import { Box } from "@mui/material"
import { FlexCol } from "@internals/calendar";

export default function App () {
  return (
    <Box width="100%" height="100%" display="flex" p={4}>
      <Calendar />
    </Box>
  );
}
`;

export const CalendarTsx = `
import { FlexCol } from "@internals/calendar";
import CalendarHeader from "./CalendarHeader.tsx";
import CalendarGrid from "./CalendarGrid.tsx";

export default function Calendar() {
  return (
    <FlexCol width="664px">
      <div style={{paddingLeft:'24px'}}>
        <CalendarHeader />
      </div>
      <CalendarGrid />
    </FlexCol>
  );
}
`;

export const CalendarHeaderTsx = `
import { 
  CalendarLayoutBar, 
  CalendarWeekViewBar, 
  CalendarFullDayEventBar, 
  FlexCol 
} from "@internals/calendar";

export default function CalendarHeader() {
  return (
    <FlexCol>
      <CalendarLayoutBar />
      <CalendarWeekViewBar />
      <CalendarFullDayEventBar eventHeight={2} />
    </FlexCol>
  );
}`;

export const CalendarGridTsx = `
import { Box, Divider } from "@mui/material";
import CalendarEvent from "./CalendarEvent.tsx";
import { 
  CalendarGridAmPmSidebar, 
  FlexRow, 
  FlexCol, 
  addMinutes
 } from "@internals/calendar";

export default function CalendarGrid() {
  return (
    <FlexRow
    sx={{
      alignItems: "flex-start",
      width: "664px",
    }}
  >
    <CalendarGridAmPmSidebar />
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: 1440,
      }}
    >
      {/* Horizontal lines */}
      <FlexCol
        sx={{
          gap: "59px",
          position: "absolute",
          alignItems: "stretch",
          inset: 0,
        }}
      >
        {[...Array(25)].map((_, i) => {
          return (
            <Divider
              key={i}
              sx={{
                marginLeft: "-16px",
                opacity: i === 0 ? 0 : 1,
              }}
            />
          );
        })}
      </FlexCol>
      {/* Vertical lines */}
      <FlexRow
        sx={{
          position: "absolute",
          alignItems: "stretch",
          justifyContent: "flex-start",
          inset: 0,
          gap: "120px",
        }}
      >
        {[...Array(6)].map((_, i) => {
          return (
            <Divider
              key={i}
              orientation="vertical"
              sx={{
                opacity: i === 5 ? 0 : 1,
              }}
            />
          );
        })}
      </FlexRow>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
        }}
      >
        <Box sx={{ top: 1, left: 1, position: "absolute" }}>
          <CalendarEvent
            variant="orange"
            title="event"
            startTime={new Date()}
            endTime={addMinutes(new Date(), 10)}
          />
        </Box>
      </Box>
    </Box>
  </FlexRow>
  );
}
`;

export const CalendarEventTsx = `
  import { 
    mergeSx, 
    compileEventProperties, 
    EventTypography, 
    variationsToColorRecord
  } from "@internals/calendar";
  import { Box } from "@mui/material";

  export default function CalendarEvent({
    title,
    startTime,
    endTime,
    variant = "orange",
    sx,
  }: {
    title: string;
    startTime: Date;
    endTime: Date;
    variant?: CalendarVariant;
    sx?: SxProps<Theme>;
  }) {
    const {
      sxProps: eventSxProp,
      updatedTitle,
      updatedDuration,
    } = compileEventProperties(title, startTime, endTime, variant);

    return (
      <Box sx={
        mergeSx(
          // {
          //   backgroundColor: variationsToColorRecord[variant],
          //   display: "flex",
          //   padding: "0px 8px",
          //   height: "16px",
          //   borderRadius: "4px",
          // }, 
          eventSxProp,
          sx
        )
      }>
        <Box>
          <EventTypography>aa</EventTypography>
        </Box>

        <EventTypography>aa</EventTypography>
      </Box>
    );
  }
`;
