/** @format */

import _ from "lodash";
import ProjectConfig from "@/project.config.json";
import { useMemo, useCallback, type ReactNode } from "react";
import DevMode from "@/components/DevMode";
import { type Role } from "@/@types/roles";
import useSelector from "@/hooks/use-app-selector";
import { queryKey } from "@/constants";
import type { IsBeRoute } from "@/@types/route";

const permissionType = ProjectConfig.permissionType.value;

interface PermissionProps {
  /** permission list */
  acl?: string[];
  children?: ReactNode;
  fallback?: ReactNode;
  useDevMode?: {
    enabled?: boolean;
    env?: Env[];
    roles?: Role[];
  };
  rule?: IsBeRoute["rule"];
}

const Permission = (props: PermissionProps) => {
  const {
    acl,
    children,
    fallback,
    useDevMode = {
      enabled: false,
      env: ["beta", "local"],
      roles: ["superAdmin"],
    },
    rule,
  } = props;

  if (useDevMode?.enabled) {
    return (
      <DevMode
        fallback={fallback}
        env={useDevMode?.env}
        roles={useDevMode?.roles}>
        {children}
      </DevMode>
    );
  }

  const me = useSelector((state) => state.global.me);

  const isRule = rule ? rule(me) : true;

  if (!isRule) {
    return fallback;
  }

  const [user, roles] = useMemo(() => {
    return [me?.data, me?.data?.roles];
  }, [me]);

  const getUserAcl = useCallback(() => {
    let userAcl: string[] = [];
    if (permissionType === "role" && !!user?.current && !!roles) {
      userAcl = roles[user.current] || [];
    } else if (permissionType === "acl" && !!roles) {
      Object.keys(roles).forEach((key) => {
        userAcl = [...roles[key], ...userAcl];
      });
    }
    return _.uniq(userAcl);
  }, [user, roles]);

  const permission = _.intersection(acl, getUserAcl());

  return (
    <>
      {acl?.includes("*") ||
      (!getUserAcl().length && permissionType === "none") ||
      permission.length > 0
        ? children
        : fallback}
    </>
  );
};

export default Permission;
