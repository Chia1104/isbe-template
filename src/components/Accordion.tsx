import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { cn } from "@/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
  // eslint-disable-next-line react/prop-types
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b-primary", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
  // eslint-disable-next-line react/prop-types
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between border-b-primary p-4 text-start font-medium transition-all data-[state=open]:text-primary [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg]:text-primary",
        className
      )}
      {...props}>
      {children}
      <KeyboardArrowDownIcon className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
    slow?: boolean;
    wrapperClassName?: string;
  }
  // eslint-disable-next-line react/prop-types
>(({ className, children, slow, wrapperClassName, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      slow &&
        "data-[state=closed]:animate-accordion-up-slow data-[state=open]:animate-accordion-down-slow",
      className
    )}
    {...props}>
    <div className={cn("px-4 py-[32px]", wrapperClassName)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
