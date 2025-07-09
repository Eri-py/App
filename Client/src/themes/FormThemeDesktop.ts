import { createTheme } from "@mui/material/styles";

export const formThemeDesktop = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1565c0",
      dark: "#0d47a1",
      light: "#42a5f5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#df2a2a",
      dark: "#b11b1b",
      light: "#ef5f5f",
      contrastText: "#ffffff",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
        contained: {
          boxShadow: "0 2px 4px rgba(21, 101, 192, 0.3)",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(21, 101, 192, 0.4)",
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: 0,
          textWrap: "nowrap",
          fontSize: ".75rem",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& input:-webkit-autofill": {
            transition: "background-color 6000000s 0s, color 6000000s 0s",
          },
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      fontWeight: 500,
    },
  },
});
