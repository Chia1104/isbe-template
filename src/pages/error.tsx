/** @format */

import { useEffect } from "react";
import { Button, Box } from "@mui/material";
import PageTransition from "@/components/PageTransition";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { useLangNavigate } from "@roswell/hooks";
import notFound from "@/assets/images/not-found.svg";

const RouteError: React.FC = () => {
  const error = useRouteError();
  const navigate = useLangNavigate();

  useEffect(() => {
    console.error(error);
    if (isRouteErrorResponse(error)) {
      if (error.status === 401) {
        navigate("/auth/login");
      }
    }
  }, [error]);

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <PageTransition className="main y-container">
          <img src={notFound} alt="404" className="w-[205px]" />
          <p className="mb-6 text-center text-black/60">抱歉，找不到頁面。</p>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/");
            }}>
            返回上一頁
          </Button>
        </PageTransition>
      );
    }

    if (error.status === 403) {
      return (
        <PageTransition>
          <Box p={8} textAlign="center">
            <Box fontSize={32} py={3} fontWeight="bold">
              你沒有權限瀏覽這個頁面
            </Box>
            <Button
              variant="contained"
              onClick={() => {
                navigate("/");
              }}>
              回首頁
            </Button>
          </Box>
        </PageTransition>
      );
    }

    if (error.status === 401) {
      return (
        <PageTransition>
          <Box p={8} textAlign="center">
            <Box fontSize={32} py={3} fontWeight="bold">
              你尚未登入
            </Box>
            <Button
              variant="contained"
              onClick={() => {
                navigate("/auth/login");
              }}>
              登入
            </Button>
          </Box>
        </PageTransition>
      );
    }

    if (error.status === 503) {
      return <PageTransition>Looks like our API is down</PageTransition>;
    }

    if (error.status === 418) {
      return <PageTransition>🫖</PageTransition>;
    }
  }

  return (
    <PageTransition>
      <Box p={8} textAlign="center">
        <Box fontSize={32} py={3} fontWeight="bold">
          Something went wrong
        </Box>
      </Box>
    </PageTransition>
  );
};

export default RouteError;
