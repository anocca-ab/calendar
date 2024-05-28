import * as react_jsx_runtime from 'react/jsx-runtime';
import * as _mui_material from '@mui/material';
import { BoxProps, Theme, SxProps } from '@mui/material';
import * as react from 'react';
import { ReactNode } from 'react';
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
type CalendarState = {
    workWeek: boolean;
    startDay: StartDay;
    today: Date;
    currentFirstDayOfTheWeek: Date;
};

declare function Calendar({ variant, workWeek, startDay, today, onSelectEvent, onChangeEventTime, events, }: {
    events: CalendarEvent[];
    variant?: "week" | "week-stacked" | "month";
    workWeek?: boolean;
    startDay?: StartDay;
    today?: Date;
    onChangeEventTime?: OnChangeEventTime;
    onSelectEvent?: OnSelectEvent;
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
declare function renderFixtureWeekEvents(state: "normal" | "hover" | "selected"): react_jsx_runtime.JSX.Element[];
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
}, "children" | "className" | "style" | "classes" | "border" | "borderTop" | "borderRight" | "borderBottom" | "borderLeft" | "borderColor" | "borderRadius" | "display" | "displayPrint" | "overflow" | "textOverflow" | "visibility" | "whiteSpace" | "flexBasis" | "flexDirection" | "flexWrap" | "justifyContent" | "alignItems" | "alignContent" | "order" | "flex" | "flexGrow" | "flexShrink" | "alignSelf" | "justifyItems" | "justifySelf" | "gap" | "columnGap" | "rowGap" | "gridColumn" | "gridRow" | "gridAutoFlow" | "gridAutoColumns" | "gridAutoRows" | "gridTemplateColumns" | "gridTemplateRows" | "gridTemplateAreas" | "gridArea" | "bgcolor" | "color" | "zIndex" | "position" | "top" | "right" | "bottom" | "left" | "boxShadow" | "width" | "maxWidth" | "minWidth" | "height" | "maxHeight" | "minHeight" | "boxSizing" | "m" | "mt" | "mr" | "mb" | "ml" | "mx" | "my" | "p" | "pt" | "pr" | "pb" | "pl" | "px" | "py" | "margin" | "marginTop" | "marginRight" | "marginBottom" | "marginLeft" | "marginX" | "marginY" | "marginInline" | "marginInlineStart" | "marginInlineEnd" | "marginBlock" | "marginBlockStart" | "marginBlockEnd" | "padding" | "paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft" | "paddingX" | "paddingY" | "paddingInline" | "paddingInlineStart" | "paddingInlineEnd" | "paddingBlock" | "paddingBlockStart" | "paddingBlockEnd" | "typography" | "fontFamily" | "fontSize" | "fontStyle" | "fontWeight" | "letterSpacing" | "lineHeight" | "textAlign" | "textTransform" | "sx" | "align" | "gutterBottom" | "noWrap" | "paragraph" | "variant" | "variantMapping"> & _mui_system.MUIStyledCommonProps<Theme>, {}, {}>;

type CalendarActionTypes = {
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
declare const CalendarReducer: (state: CalendarState, action: CalendarActionTypes) => CalendarState;

declare const CalendarContext: react.Context<CalendarState>;
declare const CalendarDispatchContext: react.Context<react.Dispatch<CalendarActionTypes>>;
declare function CalendarProvider({ initialState, children, }: {
    initialState: CalendarState;
    children: ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function useCalendar(): CalendarState;
declare function useCalendarDispatch(): react.Dispatch<CalendarActionTypes>;

export { type AllDayCalendarEventWithRange, Calendar, type CalendarActionTypes, CalendarContext, CalendarDispatchContext, CalendarEntry, type CalendarEvent, type CalendarEventWithRange, CalendarProvider, CalendarReducer, type CalendarState, EventTypography, FlexCol, FlexRow, eventsFixture, mergeSx, renderFixtureEvents, renderFixtureWeekEvents, useCalendar, useCalendarDispatch, variationsToColorRecord };
