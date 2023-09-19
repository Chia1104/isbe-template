/** @format */

import { Box, Skeleton } from "@mui/material";
import PageTransition from "@/components/PageTransition";

const PageLoading: React.FC = () => {
  return (
    <PageTransition>
      <Box>
        <Box px={3} pb={3} bgcolor="#fff">
          <Skeleton height={30} />
        </Box>
      </Box>
      <Box px={3} py={4}>
        <Box p={3} bgcolor="#fff">
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} width="60%" />
        </Box>
        <Box mt={3} p={3} bgcolor="#fff">
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} />
          <Skeleton height={30} width="60%" />
        </Box>
      </Box>
    </PageTransition>
  );
};

export default PageLoading;
