import { SvgIcon } from "@mui/material";
import React from "react";

export const ChevronLeft = (props: React.ComponentProps<"svg">) => (
  <SvgIcon
    sx={{
      fill: (theme) => (theme.palette.mode === "dark" ? "white" : "inherit"),
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="inherit"
      color="inherit"
      {...props}
    >
      <path
        fill="inherit"
        fillOpacity={0.54}
        d="M15.705 7.41 14.295 6l-6 6 6 6 1.41-1.41-4.58-4.59 4.58-4.59Z" />
    </svg>
  </SvgIcon>
);
