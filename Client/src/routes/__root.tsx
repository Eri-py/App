import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { mainTheme } from "../themes/mainTheme";
import CssBaseline from "@mui/material/CssBaseline";
import { BreakpointContext } from "../hooks/useBreakpoint";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = mainTheme(isDarkMode);
  const isSmOrLarger = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BreakpointContext.Provider value={{ isSmOrLarger }}>
        <Outlet />
        <TanStackRouterDevtools />
      </BreakpointContext.Provider>
    </ThemeProvider>
  );
}
