import { SvgIcon } from "@mui/material";
import { variationsToColorRecord } from "../../../helpers";

export function EventDot({ color = "orange" }: { color?: string }) {
  return (
    <SvgIcon sx={{ width: "8px", height: "8px" }} fontSize="inherit">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="8"
        fill="none"
        viewBox="0 0 8 8"
      >
        <circle
          cx="4"
          cy="4"
          r="4"
          fill={variationsToColorRecord[color]}
        ></circle>
      </svg>
    </SvgIcon>
  );
}
