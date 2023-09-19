import { IS_LOCAL } from "@/constants";

const getBaseUrl = () => {
  return IS_LOCAL ? "/proxy-api" : `${window.Config.API_HOST}`;
};

export default getBaseUrl;
