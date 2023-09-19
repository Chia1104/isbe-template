import { type FC } from "react";
import logo from "@/assets/images/logo.png";
import { Typography } from "@mui/material";

const DrawerMenuHeader: FC = () => {
  return (
    <div className="flex w-full items-center px-2">
      <img src={logo} className="mr-4 h-auto w-[34px]" alt="yulon logo" />
      <Typography variant="h6" className="text-base">
        裕隆集團
      </Typography>
    </div>
  );
};

export default DrawerMenuHeader;
