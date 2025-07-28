import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";

import { BreakpointContext } from "@/shared/hooks/useBreakpoint";
import { mainTheme } from "@/shared/themes/mainTheme";
import { getUser } from "@/api/AuthApi";
import { AuthContext, type AuthContextTypes } from "@/shared/hooks/useAuth";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = mainTheme(isDarkMode);
  const isSmOrLarger = useMediaQuery(theme.breakpoints.up("sm"));

  const { data, isPending, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
  if (isPending) {
    return <div>Loading...</div>;
  }

  const refreshUser = () => {
    refetch();
  };

  const authContextValue: AuthContextTypes = {
    isAuthenticated: data?.data?.isAuthenticated || false,
    user: data?.data?.user || null,
    refreshUser,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={authContextValue}>
        <BreakpointContext.Provider value={{ isSmOrLarger }}>
          <Outlet />
        </BreakpointContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
