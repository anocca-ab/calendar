import {
  Box,
  Button
} from "@mui/material";
import React from "react";

export function TodayButton({ onPress }: { onPress?: () => void; }) {
  return (
    <Box
      sx={{
        background: (theme) => theme.palette.background.default,
        borderRadius: 1,
      }}
    >
      <Button variant="outlined" onClick={onPress}>
        Today
      </Button>
    </Box>
  );
}
