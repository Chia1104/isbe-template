import { type FC } from "react";
import { Outlet } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import logo from "@/assets/images/logo.png";
import { Typography } from "@mui/material";
import ProjectVersion from "@/components/ProjectVersion";

const Layout: FC = () => {
  return (
    <main className="min-w-screen flex bg-[#EFEFEF]">
      <div className="hidden min-h-screen w-1/2 bg-[url('/src/assets/images/banner.avif')] bg-cover bg-center lg:block" />
      <div className="flex min-h-screen w-full flex-col items-center justify-center lg:w-1/2">
        <img
          src={logo}
          className="mb-[17px] h-auto w-[70px]"
          alt="yulon logo"
        />
        <PageTransition className="flex w-full items-center justify-center">
          <Outlet />
        </PageTransition>
        <Typography variant="body2" className="mt-6 text-center text-[#666666]">
          <ProjectVersion />
        </Typography>
      </div>
    </main>
  );
};

export default Layout;
