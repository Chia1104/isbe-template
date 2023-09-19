/** @format */

import globalLocales from "./global/index";
import ProjectConfig from "@/project.config.json";

type ProjectConfigJSON = typeof ProjectConfig;
export interface ProjectConfigJSONExtends
  extends Omit<ProjectConfigJSON, "languages"> {
  languages: Record<string, Language>;
}
interface Language {
  locale: string;
  label: string;
  id: number;
  messages?: any;
}

type messages = Record<string, any>;
type Default = Record<string, string>;
type ProjectLocales = Record<string, { default: Default }>;

const projectConfig: ProjectConfigJSONExtends = ProjectConfig;
export const languages = projectConfig.languages;
const projectLocales: ProjectLocales = import.meta.glob("./project/*.json", {
  eager: true,
});

const i18nMessages: messages = {};

const setLanguages = () => {
  Object.keys(projectConfig.languages).forEach((key) => {
    const response = projectLocales[`./project/${key}.json`];
    const message = response.default;
    i18nMessages[key] = {
      ...globalLocales[key],
      ...message,
    };
  });
  return i18nMessages;
};

Promise.all([setLanguages()]).catch((error) => {
  console.log(error);
});

export default i18nMessages;
