/** @format */

import { useMemo, type ReactNode } from "react";
import _ from "lodash";
import ProjectConfig from "@/project.config.json";
import { useGetMeta } from "@/services/globalService";

const featureToggle = (
  id: string | undefined,
  configAclSet: any,
  apiAclSet: any
): boolean => {
  if (
    Object.keys(configAclSet).length > 0 &&
    !_.isEmpty(configAclSet) &&
    !_.isEmpty(id) &&
    !!_.intersection([id], Object.keys(configAclSet)).length
  ) {
    const idAcl = id ? configAclSet[id] : [];
    const apiAcl = Object.keys(apiAclSet).filter(
      (apiAclKey) => apiAclSet[apiAclKey] === "enabled"
    );
    return !!_.intersection(idAcl, apiAcl).length;
  } else {
    return true;
  }
};

interface featureToggleProps {
  /** feature key, This needs to be a unique value
   *  and this needs mapping to featureAcl value
   *  featureAcl is in project.config.json
   **/
  id?: string | undefined;
  children?: ReactNode;
  fallback?: ReactNode;
}

/**
 * @todo
 * @param props
 * @constructor
 */
const FeatureToggle = (props: featureToggleProps) => {
  const { id, children, fallback } = props;
  const { data, isError } = useGetMeta();
  const configAclSet = ProjectConfig.featureAcl.value;
  const apiAclSet = useMemo(() => {
    return data?.data?.features ?? [];
  }, [data]);

  if (isError) {
    return fallback;
  }

  return (
    <>{featureToggle(id, configAclSet, apiAclSet) ? children : fallback}</>
  );
};

export default FeatureToggle;
export { featureToggle };
