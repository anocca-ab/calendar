import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";

/**
 * Usage:
 * ```tsx
 * import { deepmerge } from '@mui/utils';
 * import { calendarTheme } from '@anocca/calendar';
 * <ThemeProvider theme={outerTheme => deepmerge(outerTheme, calendarTheme)}>
 *   ...
 * </ThemeProvider>
 * ```
 */
export const calendarTheme = {
  typography: {
    event: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: "10px",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "14px",
    },
  },
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiTooltip: {
      defaultProps: { disableInteractive: true },
    },
  },
};

export function Theme({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme?: "dark" | "light";
}) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const origTheme = useTheme();
  const muiTheme = React.useMemo(
    () =>
      createTheme(origTheme, {
        palette: {
          mode: theme ?? (prefersDarkMode ? "dark" : "light"),
        },
        ...calendarTheme,
      }),
    [prefersDarkMode, theme]
  );

  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
