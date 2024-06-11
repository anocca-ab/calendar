import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";

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
      createTheme({
        palette: {
          mode: theme ?? (prefersDarkMode ? "dark" : "light"),
        },
        typography: {
          event: {
            fontFamily: origTheme.typography.fontFamily,
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
      }),
    [origTheme.typography.fontFamily, prefersDarkMode, theme],
  );

  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
