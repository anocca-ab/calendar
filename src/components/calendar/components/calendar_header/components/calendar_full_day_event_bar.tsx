import { Box, Divider } from "@mui/material";
import { addDays } from "../../../helpers";
import { FlexCol, FlexRow } from "../../../wrappers";
import { CalendarAllDayEvent } from "./calendar_all_day_event";

export function CalendarFullDayEventBar({
  eventHeight,
}: {
  eventHeight: number;
}) {
  return (
    <Box pl={8}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: `${eventHeight * (16 + 1) + 1}px`,
        }}
      >
        {/* Horizontal lines */}
        <FlexCol
          sx={{
            gap: "59px",
            position: "absolute",
            alignItems: "stretch",
            justifyContent: "flex-end",
            inset: 0,
          }}
        >
          <Divider
            sx={{
              marginLeft: "-16px",
            }}
          />
        </FlexCol>
        {/* Vertical lines */}
        <FlexRow
          sx={{
            position: "absolute",
            alignItems: "stretch",
            inset: 0,
            gap: "119px",
            justifyContent: "flex-start",
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
        {/* Events */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
          }}
        >
          {/* row 1 */}
          <Box
            sx={{ display: "grid", gridTemplateColumns: "repeat(5, 120px)" }}
          >
            <Box pl="2px">
              <CalendarAllDayEvent
                variant="pink"
                title="event"
                startTime={new Date()}
                endTime={addDays(new Date(), 1)}
              />
            </Box>
            <Box pl="2px">
              <CalendarAllDayEvent
                variant="pink"
                title="event"
                startTime={new Date()}
                endTime={addDays(new Date(), 1)}
              />
            </Box>
          </Box>
          <Box sx={{ height: "1px" }} />
          {/* row 2 */}
          <FlexRow>
            <Box pl="2px">
              <CalendarAllDayEvent
                variant="pink"
                title="event"
                startTime={new Date()}
                endTime={addDays(new Date(), 4)}
              />
            </Box>
          </FlexRow>
        </Box>
      </Box>
    </Box>

    // <FlexRow>
    //   <Box width="64px" />
    //   <Grid
    //     width={600}
    //     container
    //     columns={20}
    //     sx={{
    //       "--Grid-borderWidth": "1px",
    //       borderColor: "divider",
    //       position: "relative",
    //       ".MuiGrid-item": { padding: 0, width: 115 },
    //       "& > div": {
    //         borderRight: "var(--Grid-borderWidth) solid",
    //         borderBottom: "var(--Grid-borderWidth) solid",
    //         borderColor: "divider",
    //         "&:nth-of-type(1n)": {
    //           borderLeft: "var(--Grid-borderWidth) solid",
    //           borderColor: "divider",
    //           borderRight: "none",
    //         },
    //         "&:nth-of-type(5n)": {
    //           borderRight: "var(--Grid-borderWidth) solid",
    //           borderColor: "divider",
    //         },
    //       },
    //     }}
    //   >
    //     {[...Array(5)].map((_, index) => {
    //       return (
    //         <Grid item key={index} xs={4} height="17px">
    //           <CalendarEvent
    //             variant="pink"
    //             title="event"
    //             startTime={new Date()}
    //             endTime={addDays(new Date(), 4)}
    //           />
    //         </Grid>
    //       );
    //     })}
    //     {[...Array(1)].map((_, index) => {
    //       return (
    //         <Grid item key={index} xs={4} height="17px">
    //           <CalendarEvent
    //             variant="teal"
    //             title="event"
    //             startTime={new Date()}
    //             endTime={addDays(new Date(), 3)}
    //           />
    //         </Grid>
    //       );
    //     })}
    //     {[...Array(4)].map((_, index) => {
    //       return <Grid item key={index} xs={4} height="17px" />;
    //     })}
    //     {[...Array(1)].map((_, index) => {
    //       return (
    //         <Grid item position="relative" xs={4} key={index} height="17px">
    //           <CalendarEvent
    //             variant="pink"
    //             title="event"
    //             startTime={new Date()}
    //             endTime={addDays(new Date(), 4)}
    //           />
    //         </Grid>
    //       );
    //     })}
    //     {[...Array(4)].map((_, index) => {
    //       return (
    //         <Grid item key={index} height="17px" xs={4}>
    //           {""}
    //         </Grid>
    //       );
    //     })}
    //   </Grid>
    // </FlexRow>
  );
}
