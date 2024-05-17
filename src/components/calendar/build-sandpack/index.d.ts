import * as react_jsx_runtime from 'react/jsx-runtime';
import * as _mui_material from '@mui/material';
import { GridProps, SxProps, Theme, BoxProps } from '@mui/material';
import * as react from 'react';
import { ReactElement } from 'react';
import * as _emotion_styled from '@emotion/styled';
import * as _mui_system from '@mui/system';
import * as _mui_material_OverridableComponent from '@mui/material/OverridableComponent';

declare function CalendarEntry(): react_jsx_runtime.JSX.Element;

type StartDay = "monday" | "sunday";
type CalendarEvent<T = undefined> = {
    /**
     * If (start - end) % 24 * 60 * 60 * 1000 === 0, the event is considered to be an all-day event
     */
    start: Date;
    /**
     * If `end` is not provided, the event is considered to be a task
     */
    end?: Date;
    /**
     * If no title is provided the default title is "(no title)"
     */
    title?: string;
    color?: string;
    data?: T;
};
type OnChangeEventTime = (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
type OnSelectEvent = (event: CalendarEvent) => void;
type CalendarEventWithRange = {
    start: number;
    end: number;
    left: number;
    height: string;
    event: CalendarEvent;
};

declare function CalendarBody({ gridEvents, }: {
    gridEvents: CalendarEvent[];
}): react_jsx_runtime.JSX.Element;

/**
 * This function compiles and returns the title/duration information shown on the event component.
 *
 * @param start
 * @param end
 * @returns
 */
declare function formatDuration(start: Date, end?: Date): string;

declare function CalendarGrid({ events }: {
    events: CalendarEvent[];
}): react_jsx_runtime.JSX.Element;

declare function CalendarGridAmPmSidebar(): react_jsx_runtime.JSX.Element;

declare function HourCalendarCell(props: GridProps): react_jsx_runtime.JSX.Element;

declare function CalendarHeader({ allDayEvents, }: {
    allDayEvents: CalendarEvent[];
}): react_jsx_runtime.JSX.Element;

declare function CalendarAllDayEvent({ title, start, end, color, sx, }: CalendarEvent & {
    sx?: SxProps<Theme>;
}): react_jsx_runtime.JSX.Element;

declare function CalendarFullDayEventBar({ events, eventHeight, }: {
    events: CalendarEvent[];
    eventHeight: number;
}): react_jsx_runtime.JSX.Element;

declare function CalendarLayoutBar(): react_jsx_runtime.JSX.Element;

declare function CalendarWeekViewBar(): react_jsx_runtime.JSX.Element;

declare function DayNumberStackDate({ date }: {
    date: Date;
}): react_jsx_runtime.JSX.Element;

declare function MonthYearRowDate({ date }: {
    date: Date;
}): react_jsx_runtime.JSX.Element;

declare function WeekChip({ date }: {
    date: Date;
}): react_jsx_runtime.JSX.Element;

/**
 *
 * A Flex Box with direction col. Accepts the standard BoxProps.
 * @public
 */
declare function FlexCol(props: BoxProps): react_jsx_runtime.JSX.Element;
/**
 *
 * A Flex Box with direction row. Accepts the standard BoxProps.
 * @public
 */
declare function FlexRow(props: BoxProps): react_jsx_runtime.JSX.Element;

declare function renderFixtureEvents(numberOfEvents: number, color: string): react.JSX.Element[];
declare const eventsFixture: CalendarEvent[];

type Sx = SxProps<any>;
/**
 * Use this function to merge sx props
 * @public
 */
declare function mergeSx(...sxs: (Sx | null | undefined | boolean)[]): Sx;
declare const variationsToColorRecord: Record<string, string>;
declare const EventTypography: _emotion_styled.StyledComponent<_mui_material.TypographyOwnProps & _mui_material_OverridableComponent.CommonProps & Omit<Omit<react.DetailedHTMLProps<react.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> & {
    ref?: ((instance: HTMLSpanElement | null) => void) | react.RefObject<HTMLSpanElement> | null | undefined;
}, "border" | "boxShadow" | "fontWeight" | "zIndex" | "alignContent" | "alignItems" | "alignSelf" | "bottom" | "boxSizing" | "color" | "columnGap" | "display" | "flexBasis" | "flexDirection" | "flexGrow" | "flexShrink" | "flexWrap" | "fontFamily" | "fontSize" | "fontStyle" | "gridAutoColumns" | "gridAutoFlow" | "gridAutoRows" | "gridTemplateAreas" | "gridTemplateColumns" | "gridTemplateRows" | "height" | "justifyContent" | "justifyItems" | "justifySelf" | "left" | "letterSpacing" | "lineHeight" | "marginBlockEnd" | "marginBlockStart" | "marginBottom" | "marginInlineEnd" | "marginInlineStart" | "marginLeft" | "marginRight" | "marginTop" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "order" | "paddingBlockEnd" | "paddingBlockStart" | "paddingBottom" | "paddingInlineEnd" | "paddingInlineStart" | "paddingLeft" | "paddingRight" | "paddingTop" | "position" | "right" | "rowGap" | "textAlign" | "textOverflow" | "textTransform" | "top" | "visibility" | "whiteSpace" | "width" | "borderBottom" | "borderColor" | "borderLeft" | "borderRadius" | "borderRight" | "borderTop" | "flex" | "gap" | "gridArea" | "gridColumn" | "gridRow" | "margin" | "marginBlock" | "marginInline" | "overflow" | "padding" | "paddingBlock" | "paddingInline" | "bgcolor" | "m" | "mt" | "mr" | "mb" | "ml" | "mx" | "marginX" | "my" | "marginY" | "p" | "pt" | "pr" | "pb" | "pl" | "px" | "paddingX" | "py" | "paddingY" | "typography" | "displayPrint" | "className" | "style" | "classes" | "children" | "align" | "gutterBottom" | "noWrap" | "paragraph" | "sx" | "variant" | "variantMapping"> & _mui_system.MUIStyledCommonProps<Theme>, {}, {}>;
/**
 * Receives events, calculates their ranges and returns an array of GridEventsWithRanges
 *
 * @param events
 * @returns
 */
declare function getEventsWithRange(events: CalendarEvent[]): CalendarEventWithRange[];
/**
 * Receives an array of GridEventsWithRanges and returns an array of groups of events that overlap with each other
 *
 * @param events
 * @returns
 */
declare function partitionGridEventsOnRanges(events: CalendarEventWithRange[]): CalendarEventWithRange[][];
/**
 * Receives groups of grouped events, calculates the sx props
 * of overlapping groups and returns an array of events
 *
 * @param groupsOfEvents
 * @returns
 */
declare function transformEventsToComponents(groupsOfEvents: CalendarEventWithRange[][]): ReactElement<any, string | react.JSXElementConstructor<any>>[];
/**
 * A function to calculate the event's CSS properties
 *
 * @param start
 * @param height
 * @param color
 * @param end
 * @returns
 */
declare function calculateEventProperties(start: Date, height: string, color: string, end?: Date): SxProps<Theme>;

declare function WeekCalendar({ workWeek, startDay, today, onSelectEvent, onChangeEventTime, events, }: {
    events: CalendarEvent[];
    workWeek?: boolean;
    startDay?: StartDay;
    today?: Date;
    onChangeEventTime?: OnChangeEventTime;
    onSelectEvent?: OnSelectEvent;
}): react_jsx_runtime.JSX.Element;

export { CalendarAllDayEvent, CalendarBody, CalendarEntry, type CalendarEvent, CalendarFullDayEventBar, CalendarGrid, CalendarGridAmPmSidebar, CalendarHeader, CalendarLayoutBar, CalendarWeekViewBar, DayNumberStackDate, EventTypography, FlexCol, FlexRow, HourCalendarCell, MonthYearRowDate, WeekCalendar, WeekChip, calculateEventProperties, formatDuration as calculateTitleDuration, eventsFixture, getEventsWithRange, mergeSx, partitionGridEventsOnRanges, renderFixtureEvents, transformEventsToComponents, variationsToColorRecord };
