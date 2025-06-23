import { ThemeProvider } from "@emotion/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { mainTheme } from "../themes/mainTheme";
import CssBaseline from "@mui/material/CssBaseline";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = mainTheme(isDarkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Outlet />
      <TanStackRouterDevtools />
    </ThemeProvider>
  );
}
