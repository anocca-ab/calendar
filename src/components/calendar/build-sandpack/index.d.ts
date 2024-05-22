import * as react_jsx_runtime from 'react/jsx-runtime';
import * as _mui_material from '@mui/material';
import { GridProps, SxProps, Theme, BoxProps } from '@mui/material';
import * as react from 'react';
import { ReactElement, ReactNode } from 'react';
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
type AllDayCalendarEventWithRange = {
    left: number;
    width: number;
    event: CalendarEvent;
};
type WeekCalendarState = {
    workWeek: boolean;
    startDay: StartDay;
    today: Date;
    currentFirstDayOfTheWeek: Date;
};

declare function Calendar({ variant, workWeek, startDay, today, onSelectEvent, onChangeEventTime, events, }: {
    events: CalendarEvent[];
    variant?: "week" | "month";
    workWeek?: boolean;
    startDay?: StartDay;
    today?: Date;
    onChangeEventTime?: OnChangeEventTime;
    onSelectEvent?: OnSelectEvent;
}): react_jsx_runtime.JSX.Element;

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

/**
 * The event height is calculated so it will be depracated
 * @returns
 */
declare function CalendarFullDayEventBar({ events, }: {
    events: CalendarEvent[];
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
}, "className" | "style" | "classes" | "border" | "borderTop" | "borderRight" | "borderBottom" | "borderLeft" | "borderColor" | "borderRadius" | "display" | "displayPrint" | "overflow" | "textOverflow" | "visibility" | "whiteSpace" | "flexBasis" | "flexDirection" | "flexWrap" | "justifyContent" | "alignItems" | "alignContent" | "order" | "flex" | "flexGrow" | "flexShrink" | "alignSelf" | "justifyItems" | "justifySelf" | "gap" | "columnGap" | "rowGap" | "gridColumn" | "gridRow" | "gridAutoFlow" | "gridAutoColumns" | "gridAutoRows" | "gridTemplateColumns" | "gridTemplateRows" | "gridTemplateAreas" | "gridArea" | "bgcolor" | "color" | "zIndex" | "position" | "top" | "right" | "bottom" | "left" | "boxShadow" | "width" | "maxWidth" | "minWidth" | "height" | "maxHeight" | "minHeight" | "boxSizing" | "m" | "mt" | "mr" | "mb" | "ml" | "mx" | "my" | "p" | "pt" | "pr" | "pb" | "pl" | "px" | "py" | "margin" | "marginTop" | "marginRight" | "marginBottom" | "marginLeft" | "marginX" | "marginY" | "marginInline" | "marginInlineStart" | "marginInlineEnd" | "marginBlock" | "marginBlockStart" | "marginBlockEnd" | "padding" | "paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft" | "paddingX" | "paddingY" | "paddingInline" | "paddingInlineStart" | "paddingInlineEnd" | "paddingBlock" | "paddingBlockStart" | "paddingBlockEnd" | "typography" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "lineHeight" | "textAlign" | "textTransform" | "children" | "sx" | "align" | "gutterBottom" | "noWrap" | "paragraph" | "variant" | "variantMapping"> & _mui_system.MUIStyledCommonProps<Theme>, {}, {}>;
/**
 * Receives events, calculates their ranges and returns an array of GridEventsWithRanges
 *
 * @param events
 * @returns
 */
declare function getEventsWithRange(events: CalendarEvent[], currentFirstDayOfTheWeek: Date): CalendarEventWithRange[];
/**
 * Receives allDayEvents, calculates their width and left position and returns an array of AllDayCalendarEventWithRange
 *
 * @param events
 * @param currentFirstDayOfTheWeek
 * @param maxWidth
 * @returns
 */
declare function getAllDayEventsWithRange(events: CalendarEvent[], currentFirstDayOfTheWeek: Date, maxWidth: number): AllDayCalendarEventWithRange[];
/**
 * Receives an array of GridEventsWithRanges and returns an array of groups of events that overlap with each other
 *
 * @param events
 * @returns
 */
declare function partitionGridEventsOnRanges(events: CalendarEventWithRange[]): CalendarEventWithRange[][];
/**
 *
 * @param filteredEvents
 * @returns
 */
declare function partitionAllDayEventsOnRanges(filteredEvents: AllDayCalendarEventWithRange[]): AllDayCalendarEventWithRange[][];
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
declare function filterWeekEvents(events: CalendarEvent[], currentFirstDayOfTheWeek: Date): CalendarEvent[];

declare function WeekCalendar({ events }: {
    events: CalendarEvent[];
}): react_jsx_runtime.JSX.Element;
declare function WeekCalendarWrapper({ events }: {
    events: CalendarEvent[];
}): react_jsx_runtime.JSX.Element;

type WeekCalendarActionTypes = {
    type: "edit-workWeek";
    workWeek: boolean;
} | {
    type: "edit-startDay";
    startDay: StartDay;
} | {
    type: "edit-today";
    today: Date;
} | {
    type: "edit-currentFirstDayOfTheWeek";
    currentFirstDayOfTheWeek: Date;
};
declare const weekCalendarReducer: (state: WeekCalendarState, action: WeekCalendarActionTypes) => WeekCalendarState;

declare const WeekCalendarContext: react.Context<WeekCalendarState>;
declare const WeekCalendarDispatchContext: react.Context<react.Dispatch<WeekCalendarActionTypes>>;
declare function WeekCalendarProvider({ initialState, children, }: {
    initialState: WeekCalendarState;
    children: ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function useCalendar(): WeekCalendarState;
declare function useCalendarDispatch(): react.Dispatch<WeekCalendarActionTypes>;

export { type AllDayCalendarEventWithRange, Calendar, CalendarAllDayEvent, CalendarBody, CalendarEntry, type CalendarEvent, type CalendarEventWithRange, CalendarFullDayEventBar, CalendarGrid, CalendarGridAmPmSidebar, CalendarHeader, CalendarLayoutBar, CalendarWeekViewBar, DayNumberStackDate, EventTypography, FlexCol, FlexRow, HourCalendarCell, MonthYearRowDate, WeekCalendar, type WeekCalendarActionTypes, WeekCalendarContext, WeekCalendarDispatchContext, WeekCalendarProvider, type WeekCalendarState, WeekCalendarWrapper, WeekChip, calculateEventProperties, formatDuration as calculateTitleDuration, eventsFixture, filterWeekEvents, getAllDayEventsWithRange, getEventsWithRange, mergeSx, partitionAllDayEventsOnRanges, partitionGridEventsOnRanges, renderFixtureEvents, transformEventsToComponents, useCalendar, useCalendarDispatch, variationsToColorRecord, weekCalendarReducer };
