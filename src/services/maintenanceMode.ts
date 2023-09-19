import type { LoaderRequest } from "@/@types/loader";
import type { MaintenanceMode } from "@/@types/maintenance-mode";
import some from "lodash/some";
import dayjs from "dayjs";
import { globalActions } from "@/store/global.slice";
import { redirect } from "react-router-dom";

export const handleMaintenanceMode = (
  maintenanceMode: MaintenanceMode[],
  loaderRequest: LoaderRequest,
  enable = true
) => {
  if (!enable) return;
  const currentTime = new Date().getTime();
  let matchingMode: (MaintenanceMode & { isNear?: boolean }) | null = null;
  const sort = maintenanceMode.sort((a, b) => {
    return a.startTimestamp - b.startTimestamp;
  }) as MaintenanceMode[];
  some<MaintenanceMode>(sort, (mode) => {
    const duration = dayjs
      .duration(mode?.threshold?.time ?? 0, mode?.threshold?.unit ?? "minutes")
      .asMilliseconds();
    if (
      mode?.enabled &&
      currentTime >= mode.startTimestamp - duration &&
      currentTime <= mode.endTimestamp + duration
    ) {
      const warningThreshold = mode.startTimestamp - duration;
      matchingMode = {
        ...mode,
        isNear:
          currentTime >= warningThreshold && currentTime <= mode.startTimestamp,
      };
      return true;
    }
    return false;
  });

  loaderRequest.store.dispatch(globalActions.setMaintenanceMode(matchingMode));
  return matchingMode! as MaintenanceMode & { isNear?: boolean };
};
