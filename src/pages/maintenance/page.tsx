import PageTransition from "@/components/PageTransition";
import useSelector from "@/hooks/use-app-selector";
import type { LoaderRequest } from "@/@types/loader";
import { redirect } from "react-router-dom";
import MaintenanceMode from "./components/MaintenanceMode";

export const loader = (request: LoaderRequest) => {
  if (!request.store.getState().global.maintenanceMode) {
    return redirect("/");
  }
  return null;
};

export default function Page() {
  const maintenanceMode = useSelector((state) => state.global.maintenanceMode);
  return (
    <PageTransition className="main y-container p-4">
      <MaintenanceMode
        className="max-w-[450px]"
        sx={{
          border: "1px solid #E5E5E5",
          borderRadius: "16px",
        }}
      />
    </PageTransition>
  );
}
