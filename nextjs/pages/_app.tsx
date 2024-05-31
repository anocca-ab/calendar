import "@/styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  Button,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import type { AppProps } from "next/app";
import React from "react";
import AnoccaCalendar from "@/public/anocca_calendar.png";
import Image from "next/image";

export default function App({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
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
    [prefersDarkMode],
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <nav className="h-20 flex items-center px-8">
          <div className="flex items-center gap-4 md:gap-6 flex-1">
            <Image
              src={AnoccaCalendar}
              height={48 * 4}
              alt="Anocca calendar"
              className="h-8 w-[31px] md:h-12 md:w-[46px]"
            ></Image>
            <div className="gap-4 md:gap-12 flex">
              <Typography
                variant="h5"
                display="flex"
                sx={{ alignItems: "center" }}
                className="text-[min(3vw,32px)]"
              >
                Anocca Calendar
              </Typography>
              <div className="flex items-center gap-0 md:gap-4">
                <Button
                  variant="text"
                  size="large"
                  className="text-black dark:text-white"
                >
                  Tutorial
                </Button>
                <Button
                  variant="text"
                  size="large"
                  className="text-black dark:text-white"
                >
                  API
                </Button>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Button
              variant="text"
              size="large"
              className="text-black dark:text-white"
              endIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="stroke-[--foreground] dark:stroke-white"
                  />
                </svg>
              }
            >
              Github
            </Button>
          </div>
        </nav>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
