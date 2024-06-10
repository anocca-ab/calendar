import { ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import React from "react";

export function Theme({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme?: "dark" | "light";
}) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const muiTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme ?? (prefersDarkMode ? "dark" : "light"),
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
    [prefersDarkMode, theme],
  );

  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
