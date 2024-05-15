import * as react_jsx_runtime from 'react/jsx-runtime';
import * as _emotion_styled from '@emotion/styled';
import * as _mui_system from '@mui/system';
import * as react from 'react';
import * as _mui_material_OverridableComponent from '@mui/material/OverridableComponent';
import * as _mui_material from '@mui/material';
import { Theme, SxProps, GridProps, BoxProps } from '@mui/material';

declare function CalendarEntry(): react_jsx_runtime.JSX.Element;

type StartDay = "monday" | "sunday";
type CalendarEvent = {
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
    id?: string;
};
type OnChangeEventTime = (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
type OnSelectEvent = (event: CalendarEvent) => void;

declare function CalendarBody({ gridEvents, }: {
    gridEvents: CalendarEvent[];
}): react_jsx_runtime.JSX.Element;

declare const variationsToColorRecord: Record<string, string>;
declare const EventTypography: _emotion_styled.StyledComponent<_mui_material.TypographyOwnProps & _mui_material_OverridableComponent.CommonProps & Omit<Omit<react.DetailedHTMLProps<react.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> & {
    ref?: ((instance: HTMLSpanElement | null) => void) | react.RefObject<HTMLSpanElement> | null | undefined;
}, "className" | "style" | "classes" | "border" | "borderTop" | "borderRight" | "borderBottom" | "borderLeft" | "borderColor" | "borderRadius" | "display" | "displayPrint" | "overflow" | "textOverflow" | "visibility" | "whiteSpace" | "flexBasis" | "flexDirection" | "flexWrap" | "justifyContent" | "alignItems" | "alignContent" | "order" | "flex" | "flexGrow" | "flexShrink" | "alignSelf" | "justifyItems" | "justifySelf" | "gap" | "columnGap" | "rowGap" | "gridColumn" | "gridRow" | "gridAutoFlow" | "gridAutoColumns" | "gridAutoRows" | "gridTemplateColumns" | "gridTemplateRows" | "gridTemplateAreas" | "gridArea" | "bgcolor" | "color" | "zIndex" | "position" | "top" | "right" | "bottom" | "left" | "boxShadow" | "width" | "maxWidth" | "minWidth" | "height" | "maxHeight" | "minHeight" | "boxSizing" | "m" | "mt" | "mr" | "mb" | "ml" | "mx" | "my" | "p" | "pt" | "pr" | "pb" | "pl" | "px" | "py" | "margin" | "marginTop" | "marginRight" | "marginBottom" | "marginLeft" | "marginX" | "marginY" | "marginInline" | "marginInlineStart" | "marginInlineEnd" | "marginBlock" | "marginBlockStart" | "marginBlockEnd" | "padding" | "paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft" | "paddingX" | "paddingY" | "paddingInline" | "paddingInlineStart" | "paddingInlineEnd" | "paddingBlock" | "paddingBlockStart" | "paddingBlockEnd" | "typography" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "lineHeight" | "textAlign" | "textTransform" | "children" | "sx" | "align" | "gutterBottom" | "noWrap" | "paragraph" | "variant" | "variantMapping"> & _mui_system.MUIStyledCommonProps<Theme>, {}, {}>;
/**
 * Returns the sxProps for the wrapper box and the title/duration strings
 *
 * @param title
 * @param start
 * @param end
 * @param color
 * @returns
 */
declare function compileEventProperties(title: string, color: string, start: Date, end?: Date): {
    sxProps: SxProps<Theme>;
    formattedDuration: string;
};
/**
 * This function compiles and returns the title/duration information shown on the event component.
 *
 * @param start
 * @param end
 * @returns
 */
declare function formatDuration(start: Date, end?: Date): string;
/**
 * A function to calculate the event's CSS properties
 *
 * @param start
 * @param end
 * @param color
 * @returns
 */
declare function calculateEventProperties(start: Date, end: Date, color: string): SxProps<Theme>;

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

declare function renderFixtureEvents(numberOfEvents: number, variant: string): react.JSX.Element[];
declare const eventsFixture: CalendarEvent[];

type Sx = SxProps<any>;
/**
 * Use this function to merge sx props
 * @public
 */
declare function mergeSx(...sxs: (Sx | null | undefined | boolean)[]): Sx;

declare function WeekCalendar({ workWeek, startDay, today, onSelectEvent, onChangeEventTime, events, }: {
    events: CalendarEvent[];
    workWeek?: boolean;
    startDay?: StartDay;
    today?: Date;
    onChangeEventTime?: OnChangeEventTime;
    onSelectEvent?: OnSelectEvent;
}): react_jsx_runtime.JSX.Element;

export { CalendarAllDayEvent, CalendarBody, CalendarEntry, type CalendarEvent, CalendarFullDayEventBar, CalendarGrid, CalendarGridAmPmSidebar, CalendarHeader, CalendarLayoutBar, CalendarWeekViewBar, DayNumberStackDate, EventTypography, FlexCol, FlexRow, HourCalendarCell, MonthYearRowDate, WeekCalendar, WeekChip, calculateEventProperties, formatDuration as calculateTitleDuration, compileEventProperties, eventsFixture, mergeSx, renderFixtureEvents, variationsToColorRecord };
