import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
} from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import CheckIcon from "@mui/icons-material/Check";
import { cn } from "@/utils";
import { type ClassValue } from "clsx";

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "className"> & {
    className?: ClassValue;
  }
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "data-[state=checked]:text-primary-foreground peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary",
      className
    )}
    {...props}>
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}>
      <CheckIcon className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export default Checkbox;
