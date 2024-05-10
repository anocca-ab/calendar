import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import * as _emotion_styled from '@emotion/styled';
import * as _mui_system from '@mui/system';
import * as _mui_material_OverridableComponent from '@mui/material/OverridableComponent';
import * as _mui_material from '@mui/material';
import { Theme, SxProps, GridProps, BoxProps } from '@mui/material';

declare function CalendarEntry(): react_jsx_runtime.JSX.Element;

declare function Calendar(): react_jsx_runtime.JSX.Element;

declare function CalendarHeader(): react_jsx_runtime.JSX.Element;

declare function CalendarGrid(): react_jsx_runtime.JSX.Element;

declare function CalendarWeekViewBar(): react_jsx_runtime.JSX.Element;

declare function CalendarFullDayEventBar({ eventHeight, }: {
    eventHeight: number;
}): react_jsx_runtime.JSX.Element;

declare function CalendarLayoutBar(): react_jsx_runtime.JSX.Element;

declare function addDays(date: Date, days: number): Date;
declare function addMinutes(date: Date, minutes: number): Date;
declare function daysInMonth(month: number, year: number): number;

type CalendarVariant = "orange" | "indigo" | "pink" | "teal" | "red";
declare const variationsToColorRecord: Record<CalendarVariant, string>;
declare const EventTypography: _emotion_styled.StyledComponent<_mui_material.TypographyOwnProps & _mui_material_OverridableComponent.CommonProps & Omit<Omit<react.DetailedHTMLProps<react.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> & {
    ref?: react.Ref<HTMLSpanElement>;
}, "className" | "style" | "classes" | "border" | "borderTop" | "borderRight" | "borderBottom" | "borderLeft" | "borderColor" | "borderRadius" | "display" | "displayPrint" | "overflow" | "textOverflow" | "visibility" | "whiteSpace" | "flexBasis" | "flexDirection" | "flexWrap" | "justifyContent" | "alignItems" | "alignContent" | "order" | "flex" | "flexGrow" | "flexShrink" | "alignSelf" | "justifyItems" | "justifySelf" | "gap" | "columnGap" | "rowGap" | "gridColumn" | "gridRow" | "gridAutoFlow" | "gridAutoColumns" | "gridAutoRows" | "gridTemplateColumns" | "gridTemplateRows" | "gridTemplateAreas" | "gridArea" | "bgcolor" | "color" | "zIndex" | "position" | "top" | "right" | "bottom" | "left" | "boxShadow" | "width" | "maxWidth" | "minWidth" | "height" | "maxHeight" | "minHeight" | "boxSizing" | "m" | "mt" | "mr" | "mb" | "ml" | "mx" | "my" | "p" | "pt" | "pr" | "pb" | "pl" | "px" | "py" | "margin" | "marginTop" | "marginRight" | "marginBottom" | "marginLeft" | "marginX" | "marginY" | "marginInline" | "marginInlineStart" | "marginInlineEnd" | "marginBlock" | "marginBlockStart" | "marginBlockEnd" | "padding" | "paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft" | "paddingX" | "paddingY" | "paddingInline" | "paddingInlineStart" | "paddingInlineEnd" | "paddingBlock" | "paddingBlockStart" | "paddingBlockEnd" | "typography" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "lineHeight" | "textAlign" | "textTransform" | "children" | "sx" | "align" | "gutterBottom" | "noWrap" | "paragraph" | "variant" | "variantMapping"> & _mui_system.MUIStyledCommonProps<Theme>, {}, {}>;
declare function CalendarEvent({ title, startTime, endTime, variant, sx, }: {
    title: string;
    startTime: Date;
    endTime: Date;
    variant?: CalendarVariant;
    sx?: SxProps<Theme>;
}): react_jsx_runtime.JSX.Element;
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

declare function renderFixtureEvents(numberOfEvents: number, variant: CalendarVariant): react.JSX.Element[];
declare const eventsFixture: react_jsx_runtime.JSX.Element[];

declare function CalendarGridAmPmSidebar(): react_jsx_runtime.JSX.Element;

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

export { Calendar, CalendarAllDayEvent, CalendarEntry, CalendarEvent, CalendarFullDayEventBar, CalendarGrid, CalendarGridAmPmSidebar, CalendarHeader, CalendarLayoutBar, type CalendarVariant, CalendarWeekViewBar, DayNumberStackDate, EventTypography, FlexCol, FlexRow, HourCalendarCell, MonthYearRowDate, WeekChip, addDays, addMinutes, calculateEventProperties, calculateTitleDuration, compileEventProperties, daysInMonth, eventsFixture, renderFixtureEvents, variationsToColorRecord };
