import * as react_jsx_runtime from 'react/jsx-runtime';
import * as _mui_material from '@mui/material';
import { SxProps, Theme, GridProps, BoxProps } from '@mui/material';
import * as react from 'react';
import * as _emotion_styled from '@emotion/styled';
import * as _mui_system from '@mui/system';
import * as _mui_material_OverridableComponent from '@mui/material/OverridableComponent';

declare function CalendarEntry(): react_jsx_runtime.JSX.Element;

type CalendarEvent = {
    title: string;
    startTime: Date;
    endTime: Date;
    variant?: CalendarVariant;
};
type WeekCalendarProps = {
    events: {
        allDayEvents: CalendarEvent[];
        gridEvents: CalendarEvent[];
    };
    onEditEvent: (oldEvent: CalendarEvent, newEvent: CalendarEvent) => void;
    onCreateEvent: (event: CalendarEvent) => void;
    onMoveEvent: (oldEvent: CalendarEvent, newEvent: CalendarEvent) => void;
};
type CalendarVariant = "orange" | "indigo" | "pink" | "teal" | "red";

declare function WeekCalendar(props: WeekCalendarProps): react_jsx_runtime.JSX.Element;

declare function CalendarHeader({ allDayEvents, }: {
    allDayEvents: CalendarEvent[];
}): react_jsx_runtime.JSX.Element;

declare function CalendarGrid({ gridEvents, }: {
    gridEvents: CalendarEvent[];
}): react_jsx_runtime.JSX.Element;

declare function CalendarWeekViewBar(): react_jsx_runtime.JSX.Element;

declare function CalendarFullDayEventBar({ events, eventHeight, }: {
    events: CalendarEvent[];
    eventHeight: number;
}): react_jsx_runtime.JSX.Element;

declare function CalendarLayoutBar(): react_jsx_runtime.JSX.Element;

declare function addDays(date: Date, days: number): Date;
declare function addMinutes(date: Date, minutes: number): Date;
declare function daysInMonth(month: number, year: number): number;
type Sx = SxProps<any>;
/**
 * Use this function to merge sx props
 * @public
 */
declare function mergeSx(...sxs: (Sx | null | undefined | boolean)[]): Sx;

declare function renderFixtureEvents(numberOfEvents: number, variant: CalendarVariant): react.JSX.Element[];
declare const eventsFixture: {
    allDayEvents: CalendarEvent[];
    gridEvents: CalendarEvent[];
};

declare function CalendarGridAmPmSidebar(): react_jsx_runtime.JSX.Element;

declare const variationsToColorRecord: Record<CalendarVariant, string>;
declare const EventTypography: _emotion_styled.StyledComponent<_mui_material.TypographyOwnProps & _mui_material_OverridableComponent.CommonProps & Omit<Omit<react.DetailedHTMLProps<react.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> & {
    ref?: react.Ref<HTMLSpanElement>;
}, "className" | "style" | "classes" | "border" | "borderTop" | "borderRight" | "borderBottom" | "borderLeft" | "borderColor" | "borderRadius" | "display" | "displayPrint" | "overflow" | "textOverflow" | "visibility" | "whiteSpace" | "flexBasis" | "flexDirection" | "flexWrap" | "justifyContent" | "alignItems" | "alignContent" | "order" | "flex" | "flexGrow" | "flexShrink" | "alignSelf" | "justifyItems" | "justifySelf" | "gap" | "columnGap" | "rowGap" | "gridColumn" | "gridRow" | "gridAutoFlow" | "gridAutoColumns" | "gridAutoRows" | "gridTemplateColumns" | "gridTemplateRows" | "gridTemplateAreas" | "gridArea" | "bgcolor" | "color" | "zIndex" | "position" | "top" | "right" | "bottom" | "left" | "boxShadow" | "width" | "maxWidth" | "minWidth" | "height" | "maxHeight" | "minHeight" | "boxSizing" | "m" | "mt" | "mr" | "mb" | "ml" | "mx" | "my" | "p" | "pt" | "pr" | "pb" | "pl" | "px" | "py" | "margin" | "marginTop" | "marginRight" | "marginBottom" | "marginLeft" | "marginX" | "marginY" | "marginInline" | "marginInlineStart" | "marginInlineEnd" | "marginBlock" | "marginBlockStart" | "marginBlockEnd" | "padding" | "paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft" | "paddingX" | "paddingY" | "paddingInline" | "paddingInlineStart" | "paddingInlineEnd" | "paddingBlock" | "paddingBlockStart" | "paddingBlockEnd" | "typography" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "lineHeight" | "textAlign" | "textTransform" | "children" | "sx" | "align" | "gutterBottom" | "noWrap" | "paragraph" | "variant" | "variantMapping"> & _mui_system.MUIStyledCommonProps<Theme>, {}, {}>;
/**
 * Returns the sxProps for the wrapper box and the title/duration strings
 *
 * @param title
 * @param startTime
 * @param endTime
 * @param variant
 * @returns
 */
declare function compileEventProperties(title: string, startTime: Date, endTime: Date, variant: CalendarVariant): {
    sxProps: SxProps<Theme>;
    updatedTitle: string;
    updatedDuration: string;
};
/**
 * This function compiles and returns the title/duration information shown on the event component.
 *
 * @param title
 * @param startTime
 * @param endTime
 * @returns
 */
declare function calculateTitleDuration(title: string, startTime: Date, endTime: Date): {
    updatedTitle: string;
    updatedDuration: string;
};
/**
 * A function to calculate the event's CSS properties
 *
 * @param startTime
 * @param endTime
 * @param variant
 * @returns
 */
declare function calculateEventProperties(startTime: Date, endTime: Date, variant: CalendarVariant): SxProps<Theme>;

declare function CalendarAllDayEvent({ title, startTime, endTime, variant, sx, }: {
    title: string;
    startTime: Date;
    endTime: Date;
    variant?: CalendarVariant;
    sx?: SxProps<Theme>;
}): react_jsx_runtime.JSX.Element;

declare function DayNumberStackDate({ date }: {
    date: Date;
}): react_jsx_runtime.JSX.Element;

declare function HourCalendarCell(props: GridProps): react_jsx_runtime.JSX.Element;

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

export { CalendarAllDayEvent, CalendarEntry, type CalendarEvent, CalendarFullDayEventBar, CalendarGrid, CalendarGridAmPmSidebar, CalendarHeader, CalendarLayoutBar, type CalendarVariant, CalendarWeekViewBar, DayNumberStackDate, EventTypography, FlexCol, FlexRow, HourCalendarCell, MonthYearRowDate, WeekCalendar, type WeekCalendarProps, WeekChip, addDays, addMinutes, calculateEventProperties, calculateTitleDuration, compileEventProperties, daysInMonth, eventsFixture, mergeSx, renderFixtureEvents, variationsToColorRecord };
