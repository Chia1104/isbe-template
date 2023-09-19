import { redirect } from "react-router-dom";
import { type LoaderRequest } from "@/@types/loader";
import { queryClient } from "@/contexts/ReactQueryProvider";
import { get } from "@/utils/request";
import { type HTTPError } from "ky";
import type { MeResponse } from "@/services/globalService";
import { globalActions } from "@/store/global.slice";
import { handleMaintenanceMode } from "@/services/maintenanceMode";
import maintenanceMode from "@/assets/maintenanceMode";
import Drawer from "@/components/layouts/Drawer";
import DrawerHeader from "@/components/layouts/DrawerHeader";
import DrawerMenu from "@/components/layouts/DrawerMenu";
import DrawerMenuHeader from "@/components/layouts/DrawerMenuHeader";
import { DerivateIcon, PatientListFillIcon } from "@/components/icons";
import { useGetMeAndMeta } from "@/services/globalService";
import React, { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import useDispatch from "@/hooks/use-app-dispatch";
import projectConfig from "@/project.config.json";
import { queryKey } from "@/constants";
import useSelector from "@/hooks/use-app-selector";
import { MaintenanceMode as MaintenanceModeFC } from "@/pages/maintenance/page";

const enableMaintenanceMode = projectConfig.enableMaintenance.value;
const enableMeAPI = projectConfig.enableMeAPI.value;

export const loader = async ({ request, store, params }: LoaderRequest) => {
  const matchingMode = handleMaintenanceMode(
    maintenanceMode,
    { request, store, params },
    enableMaintenanceMode
  );
  if (
    !request.url.includes("/maintenance") &&
    matchingMode &&
    !matchingMode.isNear
  ) {
    return redirect("/maintenance");
  }

  let meData: MeResponse | null = null;
  if (enableMeAPI) {
    try {
      meData = await queryClient.ensureQueryData<
        MeResponse,
        HTTPError,
        MeResponse
      >({
        queryKey: [queryKey.me],
        queryFn: () => get<MeResponse>(`v1/me`),
      });
    } catch (e) {
      return redirect("/auth/login");
    }
  }
  store.dispatch(globalActions.setMe(meData));
  return null;
};

const MMFC = () => {
  const dispatch = useDispatch();
  return (
    <MaintenanceModeFC
      useButton={{
        onClick: () => {
          dispatch(globalActions.toggleDialog({ visible: false }));
        },
      }}
    />
  );
};

const MainProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [{ data: me, isError, isSuccess }] = useGetMeAndMeta();
  const isNearMaintenanceMode = useSelector(
    (state) => state.global.maintenanceMode?.isNear
  );

  useEffect(() => {
    if (isNearMaintenanceMode) {
      dispatch(
        globalActions.toggleDialog({
          visible: true,
          contentComponent: <MMFC />,
        })
      );
    }
  }, []);
  useEffect(() => {
    if (isError) {
      navigate("/auth/login");
    }
    if (me && isSuccess) {
      dispatch(globalActions.setMe(me));
    }
  }, [me, isError, isSuccess]);
  return children;
};

export default function Layout(props: any) {
  return (
    <MainProvider>
      <Drawer
        {...props}
        componentPlugins={{
          DrawerHeader,
          DrawerMenu,
          DrawerMenuHeader,
        }}
        icons={{
          DerivateIcon,
          PatientListFillIcon,
        }}
      />
    </MainProvider>
  );
}
