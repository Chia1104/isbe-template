/** @format */

import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import * as themes from "@/themes";
import type { Theme } from "@mui/material/styles";

import ProjectConfig from "../project.config.json";

interface Props {
  children?: React.ReactNode;
}
const themeOptions = Object.assign({}, themes) as Record<string, Theme>;
const theme: Theme =
  themeOptions[ProjectConfig.themeName] || themeOptions.defaultTheme;

const APPThemeProvider = (props: Props) => {
  const { children } = props;
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
};
export default APPThemeProvider;
