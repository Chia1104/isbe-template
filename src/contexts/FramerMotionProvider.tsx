/** @format */

import { AnimatePresence } from "framer-motion";
interface Props {
  children?: React.ReactNode;
}

const FramerMotionProvider = (props: Props) => {
  const { children } = props;
  return <AnimatePresence>{children}</AnimatePresence>;
};

export default FramerMotionProvider;
