import { type FC } from "react";
import LoadingButton, { type LoadingButtonProps } from "@mui/lab/LoadingButton";
import { cn } from "@/utils";
import { type ClassValue } from "clsx";

interface Props {
  className?: ClassValue;
}

export type ButtonProps = Omit<LoadingButtonProps, "className"> & Props;

const Button: FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <LoadingButton {...props} className={cn("rounded-[8px]", className)}>
      {children}
    </LoadingButton>
  );
};

export default Button;
