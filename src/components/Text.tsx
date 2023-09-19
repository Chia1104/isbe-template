import { type FC, type ReactNode } from "react";
import {
  Tooltip,
  Typography,
  type TypographyProps,
  type TooltipProps,
} from "@mui/material";

type Props = {
  tooltipProps?: Partial<TooltipProps> & {
    text?: string;
    textLength?: number;
  };
} & TypographyProps;

const Text: FC<Props> = ({ tooltipProps, children, ...typographyProps }) => {
  tooltipProps ??= {};
  const { textLength, text } = tooltipProps;
  return tooltipProps ? (
    <Tooltip
      {...tooltipProps}
      title={text ?? children ?? tooltipProps.title}
      disableHoverListener={(text?.length ?? 0) < (textLength ?? 25)}>
      <Typography {...typographyProps}>{children}</Typography>
    </Tooltip>
  ) : (
    <Typography {...typographyProps} />
  );
};

export default Text;
