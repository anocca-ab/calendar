import type { BoxProps } from "@mui/material";
import { Box } from "@mui/material";
import { mergeSx } from "./helpers";

/**
 *
 * A Flex Box with direction col. Accepts the standard BoxProps.
 * @public
 */
export function FlexCol(props: BoxProps) {
  const { sx, ...other } = props;
  const style = mergeSx(
    {
      display: "flex",
      flexDirection: "column",
    },
    sx
  );
  return <Box sx={style} {...other} />;
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
      sx={mergeSx(
        {
          display: "flex",
          flexDirection: "row",
        },
        sx
      )}
      {...other}
    />
  );
}
