/** @format */

import defaultTheme from "./default";
import { createTheme } from "@mui/material/styles";

export const exampleTheme = createTheme({
  typography: {
    fontFamily: ["Montserrat", "Noto Sans TC", "sans-serif"].join(","),
  },
  palette: defaultTheme.palette,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0055A4",
          color: "#fff",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
          color: "rgba(0, 0, 0, 0.65)",
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          display: "none",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "8px",
          borderStyle: "none",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: "8px",
          boxShadow: "0 2px 8px 0 rgb(0 0 0 / 10%)",
          marginTop: "4px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "0 2px 8px 0 rgb(0 0 0 / 10%)",
        },
      },
    },
  },
});

export default exampleTheme;
