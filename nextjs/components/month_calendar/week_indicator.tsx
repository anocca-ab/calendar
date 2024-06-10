import { Typography } from "@mui/material";
import { variationsToColorRecord } from "./helpers";
import { FlexCol } from "../wrappers";

export function WeekIndicator({
  title,
  color = "teal",
}: {
  title: string;
  color?: string;
}) {
  return (
    <FlexCol
      sx={{
        backgroundColor: variationsToColorRecord[color],
        display: "flex",
        width: "20px",
        height: "119px",
        padding: "4px 0px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        borderRadius: "4px",
      }}
    >
      <FlexCol
        sx={{
          transform: "rotate(-90deg)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          color="var(--Light-Primary-Contrast, #FFF);"
        >
          {title}
        </Typography>
      </FlexCol>
    </FlexCol>
  );
}
