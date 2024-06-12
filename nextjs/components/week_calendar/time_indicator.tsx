import { SvgIcon, SvgIconProps } from "@mui/material";
import { mergeSx } from "../helpers";
import React from "react";


export const TimeIndicator = (props: SvgIconProps) => (
  <SvgIcon sx={mergeSx({ width: "125px", height: "11px" }, props.sx)}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="125"
      height="11"
      fill="none"
      viewBox="0 0 125 11"
    >
      <g fill="#EF5350" clipPath="url(#clip0_373_2629)">
        <circle cx="5.5" cy="5.5" r="5.5"></circle>
        <path d="M0 0H118V2H0z" transform="translate(7 4.5)"></path>
      </g>
      <defs>
        <clipPath id="clip0_373_2629">
          <path fill="#fff" d="M0 0H125V11H0z"></path>
        </clipPath>
      </defs>
    </svg>
  </SvgIcon>
);
