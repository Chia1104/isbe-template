/** @format */

import { motion, type MotionProps } from "framer-motion";
import { useLocation } from "react-router-dom";
import { type FC, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";
import { type ClassValue } from "clsx";

const PageTransition: FC<
  MotionProps &
    Omit<ComponentPropsWithoutRef<"div">, "className"> & {
      className?: ClassValue;
    }
> = ({ children, className, ...props }) => {
  const location = useLocation();
  return (
    <motion.div
      {...props}
      className={cn(className)}
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}>
      {children}
    </motion.div>
  );
};

export default PageTransition;
