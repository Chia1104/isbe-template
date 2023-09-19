import { queryClient } from "@/contexts/ReactQueryProvider";
import { type MeResponse } from "@/services/globalService";
import _ from "lodash";
import ProjectConfig from "@/project.config.json";
import { Role } from "@/@types/roles";
import { IS_PRODUCTION } from "@/constants";
import { queryKey } from "@/constants";

const permissionType = ProjectConfig.permissionType.value;

export const getAcl = (
  acl: string[],
  useDevMode?: {
    enabled?: boolean;
    env?: Env[];
    roles?: Role[];
  },
  initialData?: MeResponse
) => {
  useDevMode ??= {};
  const {
    enabled,
    env = ["local", "beta"],
    roles: useDevModeRoles = ["superAdmin"],
  } = useDevMode;
  const data = initialData ?? queryClient.getQueryData<MeResponse>([queryKey.me]);
  const roles = data?.data?.roles;
  const user = data?.data;

  if (enabled) {
    if (IS_PRODUCTION) {
      return false;
    }
    const isAdmin = Object.keys(roles || {}).some(
      (key) => useDevModeRoles?.includes(key as Role)
    );

    return !(!env?.includes(window.Config.ENV) || !isAdmin);
  }

  const getUserAcl = () => {
    let userAcl: string[] = [];
    if (permissionType === "role" && !!user?.current && !!roles) {
      userAcl = roles[user.current] || [];
    } else if (permissionType === "acl" && !!roles) {
      Object.keys(roles).forEach((key) => {
        userAcl = [...roles[key], ...userAcl];
      });
    }
    return _.uniq(userAcl);
  };

  const permission = _.intersection(acl, getUserAcl());

  return permission.length > 0;
};
