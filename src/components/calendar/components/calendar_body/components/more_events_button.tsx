import { Button, Typography } from "@mui/material";

export function MoreEventsButton({ number }: { number: number }) {
  return (
    <Button
      variant="text"
      sx={{
        height: "16px",
        position: "absolute",
        bottom: "0px",
        borderRadius: "4px",
      }}
    >
      <Typography
        sx={{
          color: "var(--Light-Primary-Dark, #1565C0)",
          textTransform: "none",
          fontFamily: "Roboto",
          fontSize: "10px",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "100%",
        }}
      >{`${number} more`}</Typography>
    </Button>
  );
}
