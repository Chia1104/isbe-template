import { type FC, memo } from "react";

const ProjectVersion: FC = () => {
  const version = window.Config.IMAGE_VERSION;

  if (version === "APP_IMAGE_VERSION") {
    return "local develop";
  }
  if (version === "develop") {
    return version;
  }
  return `v${version}`;
};

export default memo(ProjectVersion);
