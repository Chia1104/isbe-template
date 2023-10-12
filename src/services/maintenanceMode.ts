import type { LoaderRequest } from "@/@types/loader";
import type { MaintenanceMode } from "@/@types/maintenance-mode";
import some from "lodash/some";
import dayjs from "dayjs";
import { globalActions } from "@/store/global.slice";
import { redirect } from "react-router-dom";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

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
  });
  some<MaintenanceMode>(sort, (mode) => {
    const duration = dayjs
      .duration(mode?.threshold?.time ?? 0, mode?.threshold?.unit ?? "minutes")
      .asMilliseconds();
    if (
      mode?.enabled &&
      currentTime >= mode.startTimestamp - duration &&
      currentTime <= mode.endTimestamp
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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return matchingMode! as MaintenanceMode & { isNear?: boolean };
};

// const loader = withMaintenanceMode((loaderRequest: LoaderRequest) => {}, options)
export const withMaintenanceMode = <TResult = unknown>(
  loader: (loaderRequest: LoaderRequest) => Promise<TResult> | TResult | null,
  options: { maintenanceMode: MaintenanceMode[]; enable?: boolean }
) => {
  const { maintenanceMode, enable = true } = options;
  return async (loaderRequest: LoaderRequest) => {
    const matchingMode = handleMaintenanceMode(
      maintenanceMode,
      loaderRequest,
      enable
    );
    if (
      !loaderRequest.request.url.includes("/maintenance") &&
      matchingMode &&
      !matchingMode.isNear
    ) {
      return redirect("/maintenance");
    }
    return await loader(loaderRequest);
  };
};
