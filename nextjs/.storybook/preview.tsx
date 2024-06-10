import React from "react";
import { Theme } from "@/components/theme";
import { Box } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Preview } from "@storybook/react";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, { globals: { backgrounds } }) => {
      return (
        <Theme theme={backgrounds?.value === "#333333" ? "dark" : "light"}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box
              sx={{
                background: (theme) => theme.palette.background.default,
                color: "rgba(0, 0, 0, 0.87)",
                WebkitFontSmoothing: "antialiased",
                // Antialiasing.
                MozOsxFontSmoothing: "grayscale",
                "& *": {
                  boxSizing: "border-box",
                },
              }}
              className={roboto.className}
            >
              <Story />
            </Box>
          </LocalizationProvider>
        </Theme>
      );
    },
  ],
};

export default preview;
