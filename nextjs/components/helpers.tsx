import type { SxProps, Theme } from "@mui/material";
import { addMinutes, endOfDay, startOfDay, subMinutes } from "date-fns";
import { CalendarEvent } from "./types";

type Sx = SxProps<Theme>;

/**
 * Use this function to merge sx props
 * @public
 */
export function mergeSx(...sxs: (Sx | null | undefined | boolean)[]): Sx {
  const sx: any[] = [];

  if (sxs.length === 1 && !sxs[0]) {
    return undefined as any;
  }

  if (sxs.length === 1 && sxs[0]) {
    return sxs[0] as any;
  }

  sxs.forEach((passedSx) => {
    if (!passedSx) {
      return;
    }
    if (Array.isArray(passedSx)) {
      sx.push(
        ...passedSx.flat(Number.POSITIVE_INFINITY).filter((val) => !!val)
      );
    } else {
      sx.push(passedSx);
    }
  });

  return sx;
}

export function isAllDayEvent<T>(event: CalendarEvent<T>) {
  const inRange = (date: Date, start: Date, end: Date) =>
    date.getTime() >= start.getTime() && date.getTime() <= end.getTime();

  return (
    // task
    !event.end ||
    // all day event, it is more than 24h
    (event.end &&
      event.end.getTime() - event.start.getTime() >= 24 * 60 * 60 * 1000) ||
    // all day event that is exactly 24h (plus minus 1 minute)
    (inRange(
      event.start,
      startOfDay(event.start),
      addMinutes(startOfDay(event.start), 1)
    ) &&
      inRange(
        event.end,
        subMinutes(endOfDay(event.start), 1),
        endOfDay(event.start)
      ))
  );
}

let offScreenCanavs: HTMLCanvasElement | null = null;
let offScreenContext: CanvasRenderingContext2D | null = null;

type Rgba = { r: number; g: number; b: number; a: number; cssString: string };
type Hsla = { h: number; s: number; l: number; a: number; cssString: string };

function rgbaToHsla({ r, g, b, a }: Rgba): Hsla {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return {
    h,
    s,
    l,
    a,
    cssString: `hsla(${h}, ${s}%, ${l}%, ${a})`,
  };
}

type ParsedColor = {
  hsla: Hsla;
  rgba: Rgba;
  contrastText: "white" | "black";
  unsaturated: Hsla;
  unsaturatedContrastText: "white" | "black";
};

const colorCache = new Map<string, ParsedColor>();

const getContrastText = (color: Uint8ClampedArray) => {
  const [red, green, blue, alpha] = color;
  const contrastText: "white" | "black" =
    red * 0.299 + green * 0.587 + blue * 0.114 > 150 ? "black" : "white";
  return contrastText;
};

export function parseColor(background: string): ParsedColor | undefined {
  if (colorCache.has(background)) {
    return colorCache.get(background);
  }
  if (!offScreenCanavs) {
    const existingCanvas = document.getElementById(
      "calendar-off-screen-canvas"
    );
    if (existingCanvas && existingCanvas instanceof HTMLCanvasElement) {
      offScreenCanavs = existingCanvas;
    } else {
      offScreenCanavs = document.createElement("canvas");
      offScreenCanavs.id = "calendar-off-screen-canvas";
      offScreenCanavs.style.position = "fixed";
      offScreenCanavs.style.left = "-10px";
      offScreenCanavs.style.width = "1px";
      offScreenCanavs.style.height = "1px";
      offScreenCanavs.width = 2;
      offScreenCanavs.height = 2;
      offScreenCanavs.style.visibility = "hidden";
      document.body.appendChild(offScreenCanavs);
    }
  }
  if (!offScreenContext) {
    offScreenContext = offScreenCanavs.getContext("2d", {
      willReadFrequently: true,
    });
  }
  const c = offScreenContext;
  if (c) {
    const x = 0;
    const y = 0;
    c.clearRect(x, y, 1, 1);
    c.fillStyle = background;
    c.fillRect(x, y, 1, 1);
    const imageData = c.getImageData(x, y, 1, 1).data;
    const [red, green, blue, alpha] = imageData;
    const rgba: Rgba = {
      r: red,
      g: green,
      b: blue,
      a: alpha,
      cssString: `rgba(${red}, ${green}, ${blue}, ${alpha})`,
    };
    const hsla = rgbaToHsla(rgba);
    const unsaturated: Hsla = {
      ...hsla,
      s: Math.max(hsla.s * 0.7, 0),
      l: Math.min(hsla.l * 1.3, 100),
    };
    unsaturated.cssString = `hsla(${unsaturated.h}, ${unsaturated.s}%, ${unsaturated.l}%, ${unsaturated.a})`;
    const contrastText = getContrastText(imageData);

    c.clearRect(x, y, 1, 1);
    c.fillStyle = unsaturated.cssString;
    c.fillRect(x, y, 1, 1);
    const unsaturatedContrastText = contrastText;
    // or if we want the contrast text to be calculated on the more unsaturated color
    // const saturatedContrastText = getContrastText(
    //   c.getImageData(x, y, 1, 1).data
    // );

    const result: ParsedColor = {
      hsla,
      rgba,
      contrastText,
      unsaturated: unsaturated,
      unsaturatedContrastText: unsaturatedContrastText,
    };
    return result;
  }
  return undefined;
}

export function getEventColor(
  now: Date,
  end: Date,
  theme: Theme,
  eventColor: string
) {
  const parsedColor = parseColor(eventColor);

  const bg = parsedColor
    ? end.getTime() - now.getTime() < 0
      ? parsedColor?.unsaturated.cssString
      : parsedColor?.hsla.cssString
    : DEFAULT_COLOR;
  const color = parsedColor
    ? (end.getTime() - now.getTime() < 0
        ? parsedColor.unsaturatedContrastText
        : parsedColor.contrastText) ===
      (theme.palette.mode === "dark" ? "white" : "black")
      ? theme.palette.text.primary
      : theme.palette.primary.contrastText
    : "black";
  return {
    bg,
    color,
  };
}

export function getEventStart<T>(
  event: Pick<CalendarEvent<T>, "start" | "end">
) {
  if (!event.end) {
    return startOfDay(event.start);
  }
  return event.start;
}

export function getEventEnd<T>(event: CalendarEvent<T>) {
  if (event.end && event.start.getTime() === event.end.getTime()) {
    return addMinutes(event.start, 15);
  }
  return event.end ?? endOfDay(event.start);
}

export const DEFAULT_COLOR = "#FF7043";

export function widthToPct(width: number, daysInWeek: number): string {
  return String((width / (120 * daysInWeek)) * 100) + "%";
}
export function heightToPct(height: number, weeksInMonth: number): string {
  return String((height / (120 * weeksInMonth)) * 100) + "%";
}

export function isTask(event: { start: Date; end?: Date }) {
  return !event.end || event.start.getTime() === event.end.getTime();
}

/**
 * @public
 */
export function tuple<A, B, C, D>(a: A, b: B, c: C, d: D): [A, B, C, D];
/**
 * @public
 */
export function tuple<A, B, C>(a: A, b: B, c: C): [A, B, C];
/**
 * @public
 */
export function tuple<A, B>(a: A, b: B): [A, B];
/**
 * @public
 */
export function tuple<A>(a: A): [A];
/**
 * @public
 */
export function tuple(...args: any[]) {
  return args;
}
