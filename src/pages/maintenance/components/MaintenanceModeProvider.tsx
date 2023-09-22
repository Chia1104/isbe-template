import useDialog from "@/hooks/use-dialog";
import useSelector from "@/hooks/use-app-selector";
import { type FC, useEffect, type ReactNode } from "react";
import MaintenanceMode from "./MaintenanceMode";

const MMFC = () => {
  const toggle = useDialog();
  return (
    <MaintenanceMode
      useButton={{
        onClick: () => {
          toggle({ visible: false });
        },
      }}
    />
  );
};

const MaintenanceModeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const toggle = useDialog();
  const isNearMaintenanceMode = useSelector(
    (state) => state.global.maintenanceMode?.isNear
  );

  /**
   * handle maintenance mode
   */
  useEffect(() => {
    if (isNearMaintenanceMode) {
      toggle({
        visible: true,
        contentComponent: <MMFC />,
      });
    }
  }, []);
  return <>{children}</>;
};

export default MaintenanceModeProvider;
