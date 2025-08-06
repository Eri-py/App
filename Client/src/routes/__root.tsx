import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";

import { BreakpointContext } from "@/shared/hooks/useBreakpoint";
import { mainTheme } from "@/shared/themes/mainTheme";
import { getUserDetails } from "@/api/AuthApi";
import { AuthContext, type AuthContextTypes } from "@/shared/hooks/useAuth";
import { ThemeToggleContext, type ThemeToggleType } from "@/shared/hooks/useThemeToggle";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  // Initialize theme mode and theme from localStorage or system preference.
  const systemTheme = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const currentThemeMode = localStorage.getItem("currentThemeMode");
    if (currentThemeMode === "light" || currentThemeMode === "dark") {
      return currentThemeMode;
    }
    return systemTheme ? "dark" : "light";
  });
  const theme = mainTheme(mode === "dark");

  // XS would be used for mobile screens while the others would be tablet and larger.
  const isSmOrLarger = useMediaQuery(theme.breakpoints.up("sm"));

  // Fetch user details on Website mount.
  const { data, isPending, refetch } = useQuery({
    queryKey: ["userDetails"],
    queryFn: getUserDetails,
  });

  const refreshUser = () => {
    refetch();
  };

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";

    // Update mode state and localstorage
    setMode(newMode);
    localStorage.setItem("currentThemeMode", newMode);
  };

  const authContextValue: AuthContextTypes = {
    isAuthenticated: data?.data.isAuthenticated || false,
    user: data?.data.user || null,
    refreshUser,
  };

  const themeProviderValues: ThemeToggleType = {
    mode: mode,
    toggleTheme: toggleTheme,
  };

  return (
    <ThemeToggleContext.Provider value={themeProviderValues}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthContext.Provider value={authContextValue}>
          {!isPending && (
            <BreakpointContext.Provider value={{ isSmOrLarger }}>
              <Outlet />
            </BreakpointContext.Provider>
          )}
        </AuthContext.Provider>
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
}
