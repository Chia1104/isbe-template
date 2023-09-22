import { redirect } from "react-router-dom";
import { type LoaderRequest } from "@/@types/loader";
import { queryClient } from "@/contexts/ReactQueryProvider";
import { get } from "@/utils/request";
import { type HTTPError } from "ky";
import type { MeResponse } from "@/services/globalService";
import { globalActions } from "@/store/global.slice";
import { withMaintenanceMode } from "@/services/maintenanceMode";
import maintenanceMode from "@/assets/maintenanceMode";
import Drawer from "@/components/layouts/Drawer";
import DrawerHeader from "@/components/layouts/DrawerHeader";
import DrawerMenu from "@/components/layouts/DrawerMenu";
import DrawerMenuHeader from "@/components/layouts/DrawerMenuHeader";
import { DerivateIcon, PatientListFillIcon } from "@/components/icons";
import { useGetMe } from "@/services/globalService";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import useDispatch from "@/hooks/use-app-dispatch";
import projectConfig from "@/project.config.json";
import { queryKey } from "@/constants";
import MaintenanceModeProvider from "@/pages/maintenance/components/MaintenanceModeProvider";

const enableMaintenanceMode = projectConfig.enableMaintenance.value;
const enableMeAPI = projectConfig.enableMeAPI.value;

export const loader = withMaintenanceMode(
  async ({ store }: LoaderRequest) => {
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
          retry: false,
        });
      } catch (e) {
        return redirect("/auth/login");
      }
    }
    store.dispatch(globalActions.setMe(meData));
    return null;
  },
  {
    maintenanceMode,
    enable: enableMaintenanceMode,
  }
);

/**
 * you can wrap the main layout with this provider
 */
export const MainProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: me, isError, isSuccess } = useGetMe();

  /**
   * handle me api
   */
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
      <MaintenanceModeProvider>
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
      </MaintenanceModeProvider>
    </MainProvider>
  );
}
