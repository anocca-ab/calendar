import { Typography } from "@mui/material";
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
        // backgroundColor: variationsToColorRecord[color],
        backgroundColor: "var(--Blue-Gray-50, #ECEFF1);",
        display: "flex",
        width: "20px",
        height: "119px",
        padding: "4px 0px",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "10px",
        borderRadius: "4px",
      }}
    >
      <FlexCol
        sx={{
          // transform: "rotate(-90deg)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          color="var(--Light-Text-Primary, rgba(0, 0, 0, 0.87));"
          // color="var(--Light-Primary-Contrast, #FFF);"
        >
          {title}
        </Typography>
      </FlexCol>
    </FlexCol>
  );
}
