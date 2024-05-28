import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";
import { Calendar } from "./calendar";
import { FlexCol } from "./components/wrappers";
import { eventsFixture } from "./fixtures";
import { ChevronLeft } from "./components/calendar_header/components/calendar_layout_bar";

export function CalendarEntry() {
  return (
    <Box>
      <FlexCol width="100%" height="100%" p={4}>
        <Accordion sx={{ width: "960px", height: "100%" }}>
          <AccordionSummary
            sx={{
              "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                transform: "rotate(90deg)",
              },
            }}
            expandIcon={<ChevronLeft style={{ transform: "rotate(180deg)" }} />}
          >
            Week Calendar: Many Events
          </AccordionSummary>
          <AccordionDetails>
            <Calendar variant="week" events={eventsFixture} />
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ width: "960px", height: "100%" }}>
          <AccordionSummary
            sx={{
              "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                transform: "rotate(90deg)",
              },
            }}
            expandIcon={<ChevronLeft style={{ transform: "rotate(180deg)" }} />}
          >
            Week Calendar: A Task
          </AccordionSummary>
          <AccordionDetails>
            <Calendar
              events={[
                {
                  // id: "1",
                  title: "event",
                  start: new Date(),
                  color: "pink",
                },
              ]}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded sx={{ width: "960px", height: "100%" }}>
          <AccordionSummary
            sx={{
              "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                transform: "rotate(90deg)",
              },
            }}
            expandIcon={<ChevronLeft style={{ transform: "rotate(180deg)" }} />}
          >
            Stacked Week Calendars: 1 Calendar
          </AccordionSummary>
          <AccordionDetails>
            <Calendar variant="week-stacked" events={eventsFixture} />
          </AccordionDetails>
        </Accordion>
      </FlexCol>
    </Box>
  );
}
