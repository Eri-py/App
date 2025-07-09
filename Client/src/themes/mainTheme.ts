import { createTheme } from "@mui/material/styles";

export const mainTheme = (isDarkMode: boolean) =>
  createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
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
      ...(isDarkMode
        ? {
            background: {
              default: "#181818",
              paper: "#1e1e1e",
            },
          }
        : {
            background: {
              default: "#fafafa",
              paper: "#ffffff",
            },
          }),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
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
              transition: "background-color 600000s 0s, color 600000s 0s",
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
