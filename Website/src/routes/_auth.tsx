import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

import { LogoWithName } from "@/shared/components/Logo";
import { useBreakpoint } from "@/shared/hooks/useBreakpoint";
import { mainTheme } from "@/shared/themes/mainTheme";
import { FormContainer } from "@/features/auth/components/FormContainer";
import { AuthLayoutContext } from "@/features/auth/hooks/useAuthLayout";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const defaultTheme = useTheme();
  const { isSmOrLarger } = useBreakpoint();
  const desktopTheme = mainTheme(false); // Use light mode for desktop
  const theme = isSmOrLarger ? desktopTheme : defaultTheme;

  const authContextValue = {
    theme: theme,
    isSmOrLarger: isSmOrLarger,
  };

  const content = (
    <FormContainer>
      {isSmOrLarger && (
        <Box sx={{ position: "absolute", top: "2rem", left: "3rem" }}>
          <LogoWithName size="large" color="white" />
        </Box>
      )}
      <AuthLayoutContext.Provider value={authContextValue}>
        <Outlet />
      </AuthLayoutContext.Provider>
    </FormContainer>
  );

  return isSmOrLarger ? <ThemeProvider theme={desktopTheme}>{content}</ThemeProvider> : content;
}
