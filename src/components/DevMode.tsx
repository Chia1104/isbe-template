import { type FC, type ReactNode, useMemo } from "react";
import { type Role } from "@/@types/roles";
import { useQueryClient } from "@tanstack/react-query";
import { type MeResponse } from "@/services/globalService";
import { IS_PRODUCTION, queryKey } from "@/constants";
import { queryClient } from "@/contexts/ReactQueryProvider";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  env?: Env[];
  roles?: Role[];
}

const DevMode: FC<Props> = ({
  children,
  fallback,
  env = ["beta", "local"],
  roles = ["superAdmin"],
}) => {
  if (IS_PRODUCTION) {
    return fallback ?? null;
  }

  const queryClient = useQueryClient();
  const isAdmin = useMemo(() => {
    const data = queryClient.getQueryData<MeResponse>([queryKey.me])?.data
      ?.roles;
    return Object.keys(data || {}).some((key) => roles.includes(key as Role));
  }, [queryClient]);

  if (!env.includes(window.Config.ENV) || !isAdmin) {
    return fallback ?? null;
  }

  return <>{children}</>;
};

export const isDevMode = (
  enabled = true,
  env: Env[] = ["beta", "local"],
  roles: Role[] = ["superAdmin"]
) => {
  const data = queryClient.getQueryData<MeResponse>([queryKey.me])?.data?.roles;
  const isAdmin = Object.keys(data || {}).some((key) =>
    roles.includes(key as Role)
  );

  return enabled && env.includes(window.Config.ENV) && isAdmin;
};

export default DevMode;
