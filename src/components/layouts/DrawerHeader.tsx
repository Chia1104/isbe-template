/** @format */

import { Box, Typography, Tooltip } from "@mui/material";
import useSelector from "@/hooks/use-app-selector";
import _ from "lodash";
import { useMemo } from "react";

const DrawerHeader = () => {
  const me = useSelector((state) => state.global.me);

  const roles = useMemo(() => {
    if (!me) return [];
    let roles: string[] = [];
    if (me?.data?.roles) {
      roles = Object.keys(me?.data?.roles);
    }
    return roles.join(", ");
  }, [me]);

  return (
    <Box display="flex" alignItems="center" width={1}>
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{ flexGrow: 1 }}></Typography>

      <Box display="flex" alignItems="center">
        {!me && (
          <span className="h-4 w-24 animate-pulse rounded-full bg-[#EBF2F7]" />
        )}
        {!!me && (
          <div className="flex flex-col items-end">
            <Tooltip title={me?.data?.account}>
              <Typography variant="h6" className="text-base">
                {me?.data?.client.name} / {me?.data?.name}
              </Typography>
            </Tooltip>
            <Typography className="text-xs">{roles}</Typography>
          </div>
        )}
      </Box>
    </Box>
  );
};

export default DrawerHeader;
