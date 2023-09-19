import { type FC, useState } from "react";
import {
  IconButton,
  type IconButtonProps,
  type SvgIconProps,
} from "@mui/material";
import { useCopyToClipboard, type CopyToClipboardOptions } from "@/hooks";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useInterval } from "react-use";
import { motion } from "framer-motion";
import { cn } from "@/utils";

interface Props extends CopyToClipboardOptions {
  text: string;
  iconProps?: SvgIconProps;
  delay?: number;
}

const CopyButton: FC<IconButtonProps & Props> = ({
  children,
  text,
  onCopy,
  onFail,
  iconProps,
  delay: delayProp = 3000,
  className,
  ...rest
}) => {
  const [delay, setDelay] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard({
    onCopy: (text, isSuccess) => {
      setIsCopied(true);
      onCopy?.(text, isSuccess);
      setDelay(delayProp);
    },
    onFail,
  });
  useInterval(() => {
    setIsCopied(false);
  }, delay ?? null);

  const variants = {
    copyIcon: {
      copied: {
        opacity: 0,
      },
      notCopied: {
        opacity: 1,
      },
    },
    checkIcon: {
      copied: {
        opacity: 1,
      },
      notCopied: {
        opacity: 0,
      },
    },
  };

  return (
    <IconButton
      {...rest}
      className={cn("h-8 w-8", className)}
      disabled={isCopied}
      aria-label="copy to clipboard"
      onClick={async () => await copyToClipboard(text)}>
      <div className="relative">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={variants.checkIcon}
          animate={isCopied ? "copied" : "notCopied"}>
          <CheckRoundedIcon color="success" {...iconProps} />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={variants.copyIcon}
          animate={isCopied ? "copied" : "notCopied"}>
          <ContentCopyRoundedIcon {...iconProps} />
        </motion.div>
      </div>
    </IconButton>
  );
};

export default CopyButton;
