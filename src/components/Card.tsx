import { type FC } from "react";
import { Box, type BoxProps } from "@mui/material";
import { cn } from "@/utils";

const Card: FC<BoxProps> = ({ children, className, ...props }) => {
  return (
    <Box
      {...props}
      className={cn(
        "flex w-full max-w-[450px] flex-col rounded-[8px] bg-white p-5 shadow-[0_4px_16px_rgba(181,181,182,0.2)]",
        className
      )}>
      {children}
    </Box>
  );
};

export default Card;
