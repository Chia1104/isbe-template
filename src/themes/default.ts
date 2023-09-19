/** @format */

import { createTheme } from "@mui/material/styles";

import { type AlertClassKey } from "@mui/material";

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    default: string;
    paper: string;
    surface: string;
    onSurface: string;
    top: string;
  }
  interface TypeText {
    darkPrimary1: string;
    darkPrimary2: string;
    darkPrimary3: string;
    darkPrimary4: string;
    lightPrimary1: string;
    lightPrimary2: string;
    lightPrimary3: string;
    lightPrimary4: string;
    gary1: string;
    gary2: string;
    gary3: string;
    gary4: string;
    gary5: string;
    gary6: string;
    gary7: string;
    gary8: string;
    gary9: string;
    gary10: string;
    divider: string;
  }
  interface Palette {
    default: Palette["primary"];
    border: Palette["primary"];
    background: Palette["background"];
    text: Palette["text"];
    facebook: PaletteColorOptions;
    line: PaletteColorOptions;
    apple: PaletteColorOptions;
    description: PaletteColorOptions;
  }
  interface PaletteOptions {
    default?: PaletteOptions["primary"];
    border?: PaletteOptions["primary"];
    background?: Partial<TypeBackground>;
    text?: Partial<TypeText>;
    facebook: PaletteColorOptions;
    line: PaletteColorOptions;
    apple: PaletteColorOptions;
    description: PaletteColorOptions;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    facebook: true;
    line: true;
    apple: true;
    description: true;
  }
}

declare module "@mui/material/styles/overrides" {
  export interface ComponentNameToClassKey {
    MuiAlert: AlertClassKey;
  }
}

export const defaultTheme = createTheme({
  palette: {
    description: {
      main: "rgba(0, 0, 0, 0.23)",
      light: "rgba(0, 0, 0, 0.23)",
      dark: "rgba(0, 0, 0, 0.23)",
      contrastText: "#fff",
    },
    facebook: {
      main: "#1877F2",
    },
    line: {
      main: "#06C755",
    },
    apple: {
      main: "#000000",
    },
    primary: {
      main: "#0055a4",
      light: "#3377b6",
      dark: "#003b72",
      contrastText: "#fff",
    },
    secondary: {
      main: "#cff264",
      light: "#e7ff91",
      dark: "#82a633",
      contrastText: "#fff",
    },
    default: {
      main: "#fff",
      contrastText: "#fff",
    },
    success: {
      main: "#4dcc76",
      light: "#70d691",
      dark: "#358e52",
      contrastText: "#fff",
    },
    warning: {
      main: "#f8bc44",
      light: "#f9c969",
      dark: "#ad832f",
      contrastText: "#fff",
    },
    error: {
      main: "#ff5252",
      light: "#ff7474",
      dark: "#b23939",
      contrastText: "#fff",
    },
    info: {
      main: "#0055A4",
      light: "#3377b6",
      dark: "#003b72",
      contrastText: "#fff",
    },
    divider: "#4b546a",
    border: {
      main: "#4b546a",
      light: "#60c2ff",
      dark: "#62657b",
    },
    background: {
      paper: "#fff",
      // default: '#eff4f8',
    },
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
    text: {
      primary: "rgba(0,0,0,0.87)",
      secondary: "rgba(0,0,0,0.60)",
      disabled: "rgba(0,0,0,0.38)",
      divider: "rgba(0,0,0,0.12)",
    },
  },
});

export default defaultTheme;
