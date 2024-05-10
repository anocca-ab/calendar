import type { BoxProps } from "@mui/material";
import { Box } from "@mui/material";

/**
 *
 * A Flex Box with direction col. Accepts the standard BoxProps.
 * @public
 */
export function FlexCol(props: BoxProps) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
      {...other}
    />
  );
}

/**
 *
 * A Flex Box with direction row. Accepts the standard BoxProps.
 * @public
 */
export function FlexRow(props: BoxProps) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        ...sx,
      }}
      {...other}
    />
  );
}
